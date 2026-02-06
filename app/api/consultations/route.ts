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

    const { partner, ip, userAgent } = await getPartnerContext(req);
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

    // 사용자에게 SMS 발송 (상담신청 완료 안내)
    const userPhone = parsed.data.phone.replace(/\D/g, ""); // 하이픈 제거
    if (userPhone && userPhone.length >= 10) {
      try {
        const userText = `[대리운전 보험] 상담신청이 완료되었습니다.\n담당자가 확인 후 곧 연락드리겠습니다.\n감사합니다.`;
        const userSmsResult = await aligoSendSms({ to: userPhone, text: userText });

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
            userPhone,
            userSmsResult.ok ? "success" : "error",
            JSON.stringify(userSmsResult.ok ? userSmsResult.raw : { error: userSmsResult.error, raw: userSmsResult.raw }),
          ]
        );

        // SMS 발송 실패 시 콘솔 로그 (운영 환경에서 확인용)
        if (!userSmsResult.ok) {
          console.error(`[SMS 발송 실패] 사용자: ${userPhone}, 오류: ${userSmsResult.error}`, userSmsResult.raw);
        }
      } catch (smsError) {
        // SMS 발송 중 예외 발생 시에도 로그 저장
        console.error(`[SMS 발송 예외] 사용자: ${userPhone}`, smsError);
        await query(
          `INSERT INTO message_logs (id, partner_id, entity_type, entity_id, channel, to_phone, status, vendor_response)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            randomUUID(),
            partner.id,
            "consultation",
            consultationId,
            "sms",
            userPhone,
            "error",
            JSON.stringify({ error: smsError instanceof Error ? smsError.message : "UNKNOWN_ERROR" }),
          ]
        );
      }
    }

    // Notify operator (SMS)
    const operatorPhone = process.env.OPERATOR_PHONE;
    if (operatorPhone) {
      try {
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

        // SMS 발송 실패 시 콘솔 로그
        if (!smsResult.ok) {
          console.error(`[SMS 발송 실패] 담당자: ${operatorPhone}, 오류: ${smsResult.error}`, smsResult.raw);
        }
      } catch (smsError) {
        // SMS 발송 중 예외 발생 시에도 로그 저장
        console.error(`[SMS 발송 예외] 담당자: ${operatorPhone}`, smsError);
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
            "error",
            JSON.stringify({ error: smsError instanceof Error ? smsError.message : "UNKNOWN_ERROR" }),
          ]
        );
      }
    }

    return NextResponse.json({ ok: true, id: consultationId });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "UNKNOWN";
    return NextResponse.json({ ok: false, error: "SERVER_ERROR", message: msg }, { status: 500 });
  }
}

