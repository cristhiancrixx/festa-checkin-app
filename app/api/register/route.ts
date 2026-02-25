import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { normalizeInstagram, normalizePhoneToE164BR } from "../../lib/security";

export async function POST(req: Request) {
  const body = await req.json();
  const { token, full_name, instagram, phone, has_plus_one, plus_one_name } = body;

  if (!token || !full_name) {
    return NextResponse.json({ error: "Token e nome do convidado são obrigatórios" }, { status: 400 });
  }

  const invite = await prisma.invite.findUnique({ where: { token } });
  if (!invite) return NextResponse.json({ error: "Convite inválido" }, { status: 404 });
  if (invite.registeredAt) return NextResponse.json({ error: "Convite já usado" }, { status: 409 });

  const wantsPlusOne = !!has_plus_one;
  if (wantsPlusOne && invite.maxPeople < 2) {
    return NextResponse.json({ error: "Este convite não permite acompanhante" }, { status: 400 });
  }
  if (wantsPlusOne && (!plus_one_name || String(plus_one_name).trim().length < 3)) {
    return NextResponse.json({ error: "Nome do acompanhante obrigatório" }, { status: 400 });
  }

  const insta = normalizeInstagram(instagram);
  const { e164, last4 } = normalizePhoneToE164BR(phone);

  const reg = await prisma.registration.create({
    data: {
      inviteId: invite.id,
      fullName: String(full_name).trim(),
      instagram: insta,
      phoneE164: e164,
      phoneLast4: last4,
      hasPlusOne: wantsPlusOne,
      plusOneName: wantsPlusOne ? String(plus_one_name).trim() : null,
    },
    select: { id: true },
  });

  await prisma.invite.update({
    where: { id: invite.id },
    data: { registeredAt: new Date() },
  });

  return NextResponse.json({ ok: true, registration_id: reg.id });
}
