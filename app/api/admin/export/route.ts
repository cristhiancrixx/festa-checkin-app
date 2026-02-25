import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/session";

function csvEscape(v: any) {
  const s = (v ?? "").toString();
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET() {
  const session = await getSession();
  if (session.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const regs = await prisma.registration.findMany({ include: { checkin: true, invite: true } });
  const header = [
    "token",
    "convidado_nome",
    "instagram",
    "telefone",
    "tem_acompanhante",
    "acompanhante_nome",
    "checked_in",
    "checked_in_at"
  ];

  const lines = [header.join(",")];
  for (const r of regs) {
    lines.push([
      csvEscape(r.invite.token),
      csvEscape(r.fullName),
      csvEscape(r.instagram ? `@${r.instagram}` : ""),
      csvEscape(r.phoneE164 || ""),
      csvEscape(r.hasPlusOne ? "sim" : "nao"),
      csvEscape(r.plusOneName || ""),
      csvEscape(r.checkin ? "sim" : "nao"),
      csvEscape(r.checkin?.checkedInAt?.toISOString() || "")
    ].join(","));
  }

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=convidados.csv",
    },
  });
}
