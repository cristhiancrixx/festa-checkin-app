import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/session";
import crypto from "crypto";

function genToken() {
  return crypto.randomBytes(24).toString("base64url");
}

export async function POST(req: Request) {
  const session = await getSession();
  if (session.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const count = Math.max(1, Math.min(500, Number(body.count || 1)));
  const maxPeople = body.max_people === 1 ? 1 : 2;

  const created: { token: string }[] = [];
  for (let i = 0; i < count; i++) {
    const token = genToken();
    await prisma.invite.create({ data: { token, maxPeople } });
    created.push({ token });
  }

  return NextResponse.json({ ok: true, created });
}
