"use client";

import { useEffect, useState } from "react";

type AdminRow = {
  id: string;
  token: string;
  full_name: string;
  instagram: string | null;
  phone_e164: string | null;
  has_plus_one: boolean;
  plus_one_name: string | null;
  checked_in: boolean;
  checked_in_at: string | null;
};

export default function AdminPage() {
  const [role, setRole] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [status, setStatus] = useState("");

  async function refreshRole() {
    const res = await fetch("/api/admin/me");
    const json = await res.json();
    setRole(json.role);
  }

  useEffect(() => { refreshRole(); }, []);

  async function login() {
    setStatus("Logando...");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const json = await res.json();
    if (!res.ok) {
      setStatus(json.error || "Falhou");
      return;
    }
    setStatus("OK");
    await refreshRole();
  }

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    setRole(null);
    setRows([]);
  }

  async function search() {
    setStatus("Buscando...");
    const res = await fetch("/api/admin/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q }),
    });
    const json = await res.json();
    if (!res.ok) {
      setStatus(json.error || "Erro");
      return;
    }
    setRows(json.results);
    setStatus(`Encontrados: ${json.results.length}`);
  }

  async function generateInvites() {
    const countStr = prompt("Quantos convites gerar? (1-500)", "10") || "";
    const count = Number(countStr);
    const maxPeopleStr = prompt("Max pessoas por convite? (1 ou 2)", "2") || "2";
    const max_people = Number(maxPeopleStr) === 1 ? 1 : 2;

    setStatus("Gerando...");
    const res = await fetch("/api/admin/generate-invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count, max_people }),
    });
    const json = await res.json();
    if (!res.ok) {
      setStatus(json.error || "Erro");
      return;
    }

    const tokens = (json.created || []).map((x: any) => x.token);
    alert("Gerados:\n" + tokens.map((t: string) => `${location.origin}/i/${t}`).join("\n"));
    setStatus("Convites gerados");
  }

  if (role !== "ADMIN") {
    return (
      <main>
        <h1>Admin</h1>
        <p>Login (apenas admin)</p>
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha admin" type="password" />
        <button onClick={login} style={{ marginLeft: 8 }}>Entrar</button>
        {status && <p>{status}</p>}
      </main>
    );
  }

  return (
    <main>
      <h1>Admin</h1>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={logout}>Sair</button>
        <button onClick={generateInvites}>Gerar convites</button>
        <a href="/api/admin/export">Exportar CSV</a>
      </div>

      <hr style={{ margin: "16px 0" }} />

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nome, @ ou telefone"
          style={{ flex: 1 }}
        />
        <button onClick={search}>Buscar</button>
      </div>

      {status && <p>{status}</p>}

      <div style={{ marginTop: 12 }}>
        {rows.map((r) => (
          <div key={r.id} style={{ border: "1px solid #ddd", padding: 10, borderRadius: 8, marginBottom: 8 }}>
            <div><b>{r.full_name}</b> {r.instagram ? `(${r.instagram})` : ""}</div>
            <div>Telefone: {r.phone_e164 || "-"}</div>
            <div>Acompanhante: {r.has_plus_one ? (r.plus_one_name || "(sem nome)") : "não"}</div>
            <div>Check-in: {r.checked_in ? `sim (${r.checked_in_at})` : "não"}</div>
            <div style={{ color: "#666" }}>Token: {r.token}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
