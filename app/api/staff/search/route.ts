import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/session";
import { maskPhoneFromE164 } from "../../../lib/security";

export async function POST(req: Request) {
  const session = await getSession();
  if (session.role !== "STAFF" && session.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { q } = await req.json();
  const raw = String(q || "").trim();
  if (raw.length < 2) return NextResponse.json({ error: "Busca muito curta" }, { status: 400 });

  const digits = raw.replace(/\D/g, "");
  const looksNumeric = digits.length >= 4;

  const results = await prisma.registration.findMany({
    where: {
      OR: [
        { fullName: { contains: raw, mode: "insensitive" } },
        { instagram: { contains: raw.replace(/^@/, ""), mode: "insensitive" } },
        ...(looksNumeric
          ? [
              { phoneE164: { contains: digits, mode: "insensitive" } },
              { phoneLast4: digits.length === 4 ? digits : undefined },
            ].filter(Boolean) as any
          : []),
      ],
    },
    take: 20,
    include: { checkin: true },
  });

  return NextResponse.json({
    results: results.map((r) => ({
      id: r.id,
      full_name: r.fullName,
      instagram: r.instagram ? `@${r.instagram}` : null,
      phone_masked: maskPhoneFromE164(r.phoneE164),
      has_plus_one: r.hasPlusOne,
      plus_one_name: r.plusOneName,
      checked_in: !!r.checkin,
      checked_in_at: r.checkin?.checkedInAt || null,
    })),
  });
}
