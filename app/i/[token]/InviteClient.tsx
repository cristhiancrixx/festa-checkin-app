"use client";

import { useState } from "react";

export default function InviteClient({ token }: { token: string }) {
  const [status, setStatus] = useState("");

  return (
    <div style={{ padding: 24 }}>
      <h1>Confirmação de presença</h1>
      <p>Token: {token}</p>
      <p>Status: {status}</p>
      <button onClick={() => setStatus("ok")}>Teste</button>
    </div>
  );
}