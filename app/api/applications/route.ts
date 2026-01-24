import { NextResponse } from "next/server";
import { ApplicationSchema } from "@/lib/validators";
import { getPartnerContext } from "@/app/api/_lib/context";
import { supabaseAdmin } from "@/lib/supabase-server";
import { encryptField } from "@/lib/crypto";
import { aligoSendSms } from "@/lib/aligo";

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
    const supabase = supabaseAdmin();

    if (!parsed.data.isSamePerson) {
      if (!parsed.data.contractorName) {
        return NextResponse.json({ ok: false, error: "CONTRACTOR_NAME_REQUIRED" }, { status: 400 });
      }
      if (!parsed.data.contractorResidentNumber1 || !parsed.data.contractorResidentNumber2) {
        return NextResponse.json({ ok: false, error: "CONTRACTOR_RN_REQUIRED" }, { status: 400 });
      }
    }

    const { data: appRow, error: appErr } = await supabase
      .from("applications")
      .insert({
        partner_id: partner.id,
        insurance_type: parsed.data.insuranceType,
        name: parsed.data.name,
        phone: parsed.data.phone,
        yearly_premium: parsed.data.yearlyPremium ?? null,
        first_premium: parsed.data.firstPremium ?? null,
        address: parsed.data.address,
        address_detail: parsed.data.addressDetail ?? null,
        is_same_person: parsed.data.isSamePerson,
        contractor_name: parsed.data.isSamePerson ? null : parsed.data.contractorName ?? null,
        bank_name: parsed.data.bankName,
        consent_privacy: parsed.data.consentPrivacy,
        ip,
        user_agent: userAgent,
      })
      .select("id")
      .single();

    if (appErr) throw new Error(appErr.message);

    const residentEnc = encryptField(`${parsed.data.residentNumber1}-${parsed.data.residentNumber2}`);
    const contractorResidentEnc =
      !parsed.data.isSamePerson && parsed.data.contractorResidentNumber1 && parsed.data.contractorResidentNumber2
        ? encryptField(`${parsed.data.contractorResidentNumber1}-${parsed.data.contractorResidentNumber2}`)
        : "";

    const { error: secErr } = await supabase.from("application_secrets").insert({
      application_id: appRow.id,
      resident_number_enc: residentEnc || null,
      contractor_resident_number_enc: contractorResidentEnc || null,
      account_number_enc: encryptField(parsed.data.accountNumber) || null,
      card_number_enc: encryptField(parsed.data.cardNumber ?? "") || null,
      card_expiry_enc: encryptField(parsed.data.cardExpiry ?? "") || null,
    });

    if (secErr) throw new Error(secErr.message);

    const operatorPhone = process.env.OPERATOR_PHONE;
    if (operatorPhone) {
      const text = `[daeri][${partner.code}] 가입신청\n이름:${parsed.data.name}\n전화:${parsed.data.phone}\n유형:${parsed.data.insuranceType}\n주소:${parsed.data.address} ${parsed.data.addressDetail ?? ""}\n보험료:${parsed.data.yearlyPremium ?? "-"} / 1회:${parsed.data.firstPremium ?? "-"}`;
      const smsResult = await aligoSendSms({ to: operatorPhone, text });

      await supabase.from("message_logs").insert({
        partner_id: partner.id,
        entity_type: "application",
        entity_id: appRow.id,
        channel: "sms",
        to_phone: operatorPhone,
        status: smsResult.ok ? "success" : "error",
        vendor_response: smsResult.ok ? smsResult.raw : { error: smsResult.error, raw: smsResult.raw },
      });
    }

    return NextResponse.json({ ok: true, id: appRow.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "UNKNOWN";
    return NextResponse.json({ ok: false, error: "SERVER_ERROR", message: msg }, { status: 500 });
  }
}

