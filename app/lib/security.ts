export function normalizeInstagram(value?: string | null) {
  if (!value) return null;
  let v = value.trim();
  if (!v) return null;
  if (v.startsWith("@")) v = v.slice(1);
  return v.replace(/\s+/g, "");
}

export function normalizePhoneToE164BR(input?: string | null) {
  if (!input) return { e164: null as string | null, last4: null as string | null };
  const digits = input.replace(/\D/g, "");
  if (!digits) return { e164: null, last4: null };

  let d = digits;
  if (d.startsWith("55") && d.length >= 12) d = d.slice(2);

  let e164: string;
  if (d.length === 11 || d.length === 10) e164 = `+55${d}`;
  else if (d.length >= 11) e164 = `+${digits}`;
  else e164 = `+55${d}`;

  const last4 = e164.slice(-4);
  return { e164, last4 };
}

export function maskPhoneFromE164(e164?: string | null) {
  if (!e164) return null;
  const last4 = e164.slice(-4);
  return `(**) *****-${last4}`;
}
