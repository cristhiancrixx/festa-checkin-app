import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { getSession } from "../../lib/session";

export async function POST(req: Request) {
  const session = await getSession();
  if (session.role !== "STAFF" && session.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { registration_id } = await req.json();
  if (!registration_id) return NextResponse.json({ error: "Faltou id" }, { status: 400 });

  const existing = await prisma.checkin.findUnique({ where: { registrationId: registration_id } });
  if (existing) return NextResponse.json({ error: "Já fez check-in" }, { status: 409 });

  await prisma.checkin.create({
    data: {
      registrationId: registration_id,
      checkedInBy: session.role,
    },
  });

  return NextResponse.json({ ok: true });
}
