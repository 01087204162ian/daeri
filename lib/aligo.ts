type AligoResult =
  | { ok: true; raw: unknown }
  | { ok: false; error: string; raw?: unknown };

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

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

export async function aligoSendSms(args: { to: string; text: string; title?: string }): Promise<AligoResult> {
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

