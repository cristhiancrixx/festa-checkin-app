import { NextResponse } from "next/server";
import { getSession } from "../../lib/session";

export async function POST(req: Request) {
  const { password } = await req.json();
  const session = await getSession();

  const adminPass = process.env.ADMIN_PASSWORD || "";
  const staffPass = process.env.STAFF_PASSWORD || "";

  if (password === adminPass) {
    session.role = "ADMIN";
    await session.save();
    return NextResponse.json({ ok: true, role: "ADMIN" });
  }

  if (password === staffPass) {
    session.role = "STAFF";
    await session.save();
    return NextResponse.json({ ok: true, role: "STAFF" });
  }

  return NextResponse.json({ ok: false, error: "Senha inválida" }, { status: 401 });
}
