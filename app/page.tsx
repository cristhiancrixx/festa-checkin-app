export default function Home() {
  return (
    <main>
      <h1>App de convidados + check-in</h1>
      <p>
        Use o link do convite (com token) para cadastrar. Admin e Segurança acessam suas telas com login.
      </p>
      <ul>
        <li><a href="/admin">/admin</a></li>
        <li><a href="/checkin">/checkin</a></li>
      </ul>
      <p style={{ color: "#666" }}>
        Observação: esta é uma versão funcional (MVP) para você rodar e publicar.
      </p>
    </main>
  );
}
