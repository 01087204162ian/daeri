type AligoResult =
  | { ok: true; raw: unknown }
  | { ok: false; error: string; raw?: unknown };

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

/**
 * AWS Lambda 프록시를 통한 알리고 SMS 전송 (pci0327 방식)
 * - JSON 형식으로 요청
 * - API 키는 Lambda에 저장되어 보안 강화
 */
async function postJson(url: string, data: Record<string, any>): Promise<AligoResult> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const text = await res.text();
  let parsed: unknown = text;
  try {
    parsed = JSON.parse(text);
  } catch {
    // ignore (some endpoints return plain text)
  }

  if (!res.ok) return { ok: false, error: `HTTP ${res.status}`, raw: parsed };
  return { ok: true, raw: parsed };
}

/**
 * 기존 Form data 방식 (직접 알리고 API 호출)
 */
async function postForm(url: string, params: Record<string, string>): Promise<AligoResult> {
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) body.set(k, v);

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body,
    cache: "no-store",
  });

  const text = await res.text();
  let parsed: unknown = text;
  try {
    parsed = JSON.parse(text);
  } catch {
    // ignore (some aligo endpoints return plain text)
  }

  if (!res.ok) return { ok: false, error: `HTTP ${res.status}`, raw: parsed };
  return { ok: true, raw: parsed };
}

/**
 * 알리고 SMS 전송
 * 
 * 사용 방식:
 * 1. AWS Lambda 프록시 사용 (권장): ALIGO_LAMBDA_URL 환경변수 설정
 *    - JSON 형식, 보안 강화
 *    - 파라미터: receiver, msg, testmode_yn
 * 
 * 2. 직접 알리고 API 호출: ALIGO_SMS_URL 환경변수 설정
 *    - Form data 형식
 *    - 파라미터: user_id, key, sender, receiver, msg
 */
export async function aligoSendSms(args: { 
  to: string; 
  text: string; 
  title?: string;
  testmode?: boolean;
}): Promise<AligoResult> {
  // AWS Lambda 프록시 방식 (pci0327과 동일)
  const lambdaUrl = process.env.ALIGO_LAMBDA_URL;
  if (lambdaUrl) {
    return postJson(lambdaUrl, {
      receiver: args.to,
      msg: args.text,
      testmode_yn: args.testmode ? "Y" : "N",
    });
  }

  // 기존 직접 호출 방식
  const url = requireEnv("ALIGO_SMS_URL");
  const userId = requireEnv("ALIGO_USER_ID");
  const apiKey = requireEnv("ALIGO_API_KEY");
  const sender = requireEnv("ALIGO_SENDER");

  // NOTE: aligo parameter names can differ by product configuration.
  // We keep the common defaults here; adjust via env or in-code if needed.
  return postForm(url, {
    user_id: userId,
    key: apiKey,
    sender,
    receiver: args.to,
    msg: args.text,
    ...(args.title ? { title: args.title } : {}),
  });
}

export async function aligoSendKakao(args: Record<string, string>): Promise<AligoResult> {
  const url = requireEnv("ALIGO_KAKAO_URL");
  const userId = requireEnv("ALIGO_USER_ID");
  const apiKey = requireEnv("ALIGO_API_KEY");

  return postForm(url, {
    user_id: userId,
    key: apiKey,
    ...args,
  });
}

