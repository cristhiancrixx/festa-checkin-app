import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

const deadlineIso = process.env.PLUSONE_DEADLINE_ISO || "2026-02-28T02:59:59.999Z";

export async function POST(req: Request) {
  const body = await req.json();
  const { token, has_plus_one, plus_one_name } = body;

  if (!token) return NextResponse.json({ error: "Token obrigatório" }, { status: 400 });

  const now = new Date();
  if (now > new Date(deadlineIso)) {
    return NextResponse.json({ error: "Prazo encerrado para trocar acompanhante" }, { status: 403 });
  }

  const invite = await prisma.invite.findUnique({ where: { token } });
  if (!invite) return NextResponse.json({ error: "Token inválido" }, { status: 404 });
  if (!invite.registeredAt) return NextResponse.json({ error: "Convite ainda não registrado" }, { status: 409 });

  const wantsPlusOne = !!has_plus_one;
  if (wantsPlusOne && invite.maxPeople < 2) {
    return NextResponse.json({ error: "Este convite não permite acompanhante" }, { status: 400 });
  }
  if (wantsPlusOne && (!plus_one_name || String(plus_one_name).trim().length < 3)) {
    return NextResponse.json({ error: "Nome do acompanhante obrigatório" }, { status: 400 });
  }

  await prisma.registration.update({
    where: { inviteId: invite.id },
    data: {
      hasPlusOne: wantsPlusOne,
      plusOneName: wantsPlusOne ? String(plus_one_name).trim() : null,
    },
  });

  return NextResponse.json({ ok: true });
}
