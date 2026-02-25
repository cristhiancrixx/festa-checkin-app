"use client";

import { useEffect, useMemo, useState } from "react";

export default function InvitePage({ params }: { params: { token: string } }) {
  const token = params.token;
  const [status, setStatus] = useState<string>("");
  const [mode, setMode] = useState<"register" | "edit">("register");

  const [fullName, setFullName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [phone, setPhone] = useState("");
  const [hasPlusOne, setHasPlusOne] = useState(false);
  const [plusOneName, setPlusOneName] = useState("");

  const canSubmit = useMemo(() => {
    if (mode === "register") {
      if (!fullName.trim()) return false;
      if (hasPlusOne && plusOneName.trim().length < 3) return false;
      return true;
    }
    if (mode === "edit") {
      if (hasPlusOne && plusOneName.trim().length < 3) return false;
      return true;
    }
    return false;
  }, [mode, fullName, hasPlusOne, plusOneName]);

  useEffect(() => {
    // nada aqui por enquanto
  }, []);

  async function submit() {
    setStatus("Enviando...");
    try {
      if (mode === "register") {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            full_name: fullName,
            instagram,
            phone,
            has_plus_one: hasPlusOne,
            plus_one_name: plusOneName,
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Erro");
        setStatus("Cadastro concluído. Se precisar, troque apenas o acompanhante (até 27/02/2026)." );
        setMode("edit");
      } else {
        const res = await fetch("/api/update-plusone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            has_plus_one: hasPlusOne,
            plus_one_name: plusOneName,
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Erro");
        setStatus("Acompanhante atualizado." );
      }
    } catch (e: any) {
      setStatus(e.message || "Falhou");
    }
  }

  return (
    <main>
      <h1>Confirmação de presença</h1>
      <p style={{ color: "#666" }}>
        Este link é individual. Após cadastrar, só será possível alterar o acompanhante até 27/02/2026.
      </p>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={() => setMode("register")} disabled={mode === "register"}>Cadastrar</button>
        <button onClick={() => setMode("edit")} disabled={mode === "edit"}>Trocar acompanhante</button>
      </div>

      {mode === "register" && (
        <section style={{ marginTop: 16 }}>
          <label>Nome completo (convidado)</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: "100%" }} />

          <label style={{ marginTop: 8, display: "block" }}>@ do Instagram (opcional)</label>
          <input value={instagram} onChange={(e) => setInstagram(e.target.value)} style={{ width: "100%" }} />

          <label style={{ marginTop: 8, display: "block" }}>Telefone (opcional)</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: "100%" }} />

          <div style={{ marginTop: 10 }}>
            <label>
              <input type="checkbox" checked={hasPlusOne} onChange={(e) => setHasPlusOne(e.target.checked)} />
              Vou levar acompanhante
            </label>
          </div>

          {hasPlusOne && (
            <>
              <label style={{ marginTop: 8, display: "block" }}>Nome do acompanhante</label>
              <input value={plusOneName} onChange={(e) => setPlusOneName(e.target.value)} style={{ width: "100%" }} />
            </>
          )}
        </section>
      )}

      {mode === "edit" && (
        <section style={{ marginTop: 16 }}>
          <p style={{ color: "#666" }}>
            Aqui você só consegue mudar o acompanhante. O nome do convidado não muda.
          </p>

          <div style={{ marginTop: 10 }}>
            <label>
              <input type="checkbox" checked={hasPlusOne} onChange={(e) => setHasPlusOne(e.target.checked)} />
              Vou levar acompanhante
            </label>
          </div>

          {hasPlusOne && (
            <>
              <label style={{ marginTop: 8, display: "block" }}>Nome do acompanhante</label>
              <input value={plusOneName} onChange={(e) => setPlusOneName(e.target.value)} style={{ width: "100%" }} />
            </>
          )}
        </section>
      )}

      <button onClick={submit} disabled={!canSubmit} style={{ marginTop: 16 }}>
        {mode === "register" ? "Enviar cadastro" : "Atualizar acompanhante"}
      </button>

      {status && <p style={{ marginTop: 12 }}>{status}</p>}
    </main>
  );
}
