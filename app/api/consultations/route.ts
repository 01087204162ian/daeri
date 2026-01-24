import { NextResponse } from "next/server";
import { ConsultationSchema } from "@/lib/validators";
import { getPartnerContext } from "@/app/api/_lib/context";
import { supabaseAdmin } from "@/lib/supabase-server";
import { aligoSendSms } from "@/lib/aligo";

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
    const supabase = supabaseAdmin();

    const { data: row, error } = await supabase
      .from("consultations")
      .insert({
        partner_id: partner.id,
        name: parsed.data.name,
        phone: parsed.data.phone,
        service_type: parsed.data.serviceType ?? null,
        message: parsed.data.message ?? null,
        consent_privacy: parsed.data.consentPrivacy,
        ip,
        user_agent: userAgent,
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    // Notify operator (SMS)
    const operatorPhone = process.env.OPERATOR_PHONE;
    if (operatorPhone) {
      const text = `[daeri][${partner.code}] 상담신청\n이름:${parsed.data.name}\n전화:${parsed.data.phone}\n유형:${parsed.data.serviceType ?? "-"}\n내용:${(parsed.data.message ?? "-").slice(0, 1000)}`;
      const smsResult = await aligoSendSms({ to: operatorPhone, text });

      await supabase.from("message_logs").insert({
        partner_id: partner.id,
        entity_type: "consultation",
        entity_id: row.id,
        channel: "sms",
        to_phone: operatorPhone,
        status: smsResult.ok ? "success" : "error",
        vendor_response: smsResult.ok ? smsResult.raw : { error: smsResult.error, raw: smsResult.raw },
      });
    }

    return NextResponse.json({ ok: true, id: row.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "UNKNOWN";
    return NextResponse.json({ ok: false, error: "SERVER_ERROR", message: msg }, { status: 500 });
  }
}

