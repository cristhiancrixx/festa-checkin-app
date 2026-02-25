"use client";

import { useEffect, useState } from "react";

type StaffRow = {
  id: string;
  full_name: string;
  instagram: string | null;
  phone_masked: string | null;
  has_plus_one: boolean;
  plus_one_name: string | null;
  checked_in: boolean;
  checked_in_at: string | null;
};

export default function CheckinPage() {
  const [role, setRole] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<StaffRow[]>([]);
  const [status, setStatus] = useState("");

  async function refreshRole() {
    const res = await fetch("/api/staff/me");
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
    const res = await fetch("/api/staff/search", {
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

  async function doCheckin(id: string) {
    const res = await fetch("/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registration_id: id }),
    });
    const json = await res.json();
    if (!res.ok) {
      alert(json.error || "Erro");
      return;
    }
    await search();
  }

  if (role !== "STAFF" && role !== "ADMIN") {
    return (
      <main>
        <h1>Check-in</h1>
        <p>Login (segurança/staff)</p>
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha staff" type="password" />
        <button onClick={login} style={{ marginLeft: 8 }}>Entrar</button>
        {status && <p>{status}</p>}
      </main>
    );
  }

  return (
    <main>
      <h1>Check-in</h1>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={logout}>Sair</button>
        <span style={{ color: "#666" }}>Você está como: {role}</span>
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
            <div>Telefone: {r.phone_masked || "-"}</div>
            <div>Acompanhante: {r.has_plus_one ? (r.plus_one_name || "(sem nome)") : "não"}</div>
            <div>Status: {r.checked_in ? `ENTROU (${r.checked_in_at})` : "NÃO ENTROU"}</div>
            {!r.checked_in && (
              <button onClick={() => doCheckin(r.id)} style={{ marginTop: 8 }}>
                Fazer check-in
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
