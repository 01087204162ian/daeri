import { NextResponse } from "next/server";
import { ConsultationSchema } from "@/lib/validators";
import { getPartnerContext } from "@/app/api/_lib/context";
import { query, queryOne } from "@/lib/mysql";
import { aligoSendSms } from "@/lib/aligo";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ConsultationSchema.safeParse(body);
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
    const consultationId = randomUUID();

    // 상담신청 저장
    await query(
      `INSERT INTO consultations (id, partner_id, name, phone, service_type, message, consent_privacy, ip, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        consultationId,
        partner.id,
        parsed.data.name,
        parsed.data.phone,
        parsed.data.serviceType ?? null,
        parsed.data.message ?? null,
        parsed.data.consentPrivacy,
        ip,
        userAgent,
      ]
    );

    // Notify operator (SMS)
    const operatorPhone = process.env.OPERATOR_PHONE;
    if (operatorPhone) {
      const text = `[daeri][${partner.code}] 상담신청\n이름:${parsed.data.name}\n전화:${parsed.data.phone}\n유형:${parsed.data.serviceType ?? "-"}\n내용:${(parsed.data.message ?? "-").slice(0, 1000)}`;
      const smsResult = await aligoSendSms({ to: operatorPhone, text });

      // 발송 로그 저장
      await query(
        `INSERT INTO message_logs (id, partner_id, entity_type, entity_id, channel, to_phone, status, vendor_response)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          randomUUID(),
          partner.id,
          "consultation",
          consultationId,
          "sms",
          operatorPhone,
          smsResult.ok ? "success" : "error",
          JSON.stringify(smsResult.ok ? smsResult.raw : { error: smsResult.error, raw: smsResult.raw }),
        ]
      );
    }

    return NextResponse.json({ ok: true, id: consultationId });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "UNKNOWN";
    return NextResponse.json({ ok: false, error: "SERVER_ERROR", message: msg }, { status: 500 });
  }
}

