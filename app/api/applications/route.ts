import { NextResponse } from "next/server";
import { ApplicationSchema } from "@/lib/validators";
import { getPartnerContext } from "@/app/api/_lib/context";
import { query } from "@/lib/mysql";
import { encryptField } from "@/lib/crypto";
import { aligoSendSms } from "@/lib/aligo";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ApplicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "VALIDATION_ERROR", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    if (!parsed.data.consentPrivacy) {
      return NextResponse.json({ ok: false, error: "CONSENT_REQUIRED" }, { status: 400 });
    }

    const { partner, ip, userAgent } = await getPartnerContext();

    if (!parsed.data.isSamePerson) {
      if (!parsed.data.contractorName) {
        return NextResponse.json({ ok: false, error: "CONTRACTOR_NAME_REQUIRED" }, { status: 400 });
      }
      if (!parsed.data.contractorResidentNumber1 || !parsed.data.contractorResidentNumber2) {
        return NextResponse.json({ ok: false, error: "CONTRACTOR_RN_REQUIRED" }, { status: 400 });
      }
    }

    const applicationId = randomUUID();

    // 가입신청 저장
    await query(
      `INSERT INTO applications (id, partner_id, insurance_type, name, phone, yearly_premium, first_premium, address, address_detail, is_same_person, contractor_name, bank_name, consent_privacy, ip, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        applicationId,
        partner.id,
        parsed.data.insuranceType,
        parsed.data.name,
        parsed.data.phone,
        parsed.data.yearlyPremium ?? null,
        parsed.data.firstPremium ?? null,
        parsed.data.address,
        parsed.data.addressDetail ?? null,
        parsed.data.isSamePerson,
        parsed.data.isSamePerson ? null : parsed.data.contractorName ?? null,
        parsed.data.bankName,
        parsed.data.consentPrivacy,
        ip,
        userAgent,
      ]
    );

    // 민감정보 암호화 저장
    const residentEnc = encryptField(`${parsed.data.residentNumber1}-${parsed.data.residentNumber2}`);
    const contractorResidentEnc =
      !parsed.data.isSamePerson && parsed.data.contractorResidentNumber1 && parsed.data.contractorResidentNumber2
        ? encryptField(`${parsed.data.contractorResidentNumber1}-${parsed.data.contractorResidentNumber2}`)
        : null;

    await query(
      `INSERT INTO application_secrets (application_id, resident_number_enc, contractor_resident_number_enc, account_number_enc, card_number_enc, card_expiry_enc)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        applicationId,
        residentEnc || null,
        contractorResidentEnc || null,
        encryptField(parsed.data.accountNumber) || null,
        encryptField(parsed.data.cardNumber ?? "") || null,
        encryptField(parsed.data.cardExpiry ?? "") || null,
      ]
    );

    // Notify operator (SMS)
    const operatorPhone = process.env.OPERATOR_PHONE;
    if (operatorPhone) {
      const text = `[daeri][${partner.code}] 가입신청\n이름:${parsed.data.name}\n전화:${parsed.data.phone}\n유형:${parsed.data.insuranceType}\n주소:${parsed.data.address} ${parsed.data.addressDetail ?? ""}\n보험료:${parsed.data.yearlyPremium ?? "-"} / 1회:${parsed.data.firstPremium ?? "-"}`;
      const smsResult = await aligoSendSms({ to: operatorPhone, text });

      // 발송 로그 저장
      await query(
        `INSERT INTO message_logs (id, partner_id, entity_type, entity_id, channel, to_phone, status, vendor_response)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          randomUUID(),
          partner.id,
          "application",
          applicationId,
          "sms",
          operatorPhone,
          smsResult.ok ? "success" : "error",
          JSON.stringify(smsResult.ok ? smsResult.raw : { error: smsResult.error, raw: smsResult.raw }),
        ]
      );
    }

    return NextResponse.json({ ok: true, id: applicationId });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "UNKNOWN";
    return NextResponse.json({ ok: false, error: "SERVER_ERROR", message: msg }, { status: 500 });
  }
}

