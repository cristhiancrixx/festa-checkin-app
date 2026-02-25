# Festa Check-in (MVP)

## O que faz
- Link individual por token para o convidado cadastrar 1 pessoa + opcional 1 acompanhante
- Token (key) só permite cadastro uma vez
- Convidado só consegue editar **apenas o acompanhante** até 27/02/2026 23:59 (SP)
- Check-in por nome/@/telefone
- Admin vê telefone completo; segurança vê telefone mascarado

## Rodar local
1) Instale deps:

```bash
npm install
```

2) Crie `.env.local` a partir de `.env.example` e ajuste senhas.

3) Crie banco:

```bash
npx prisma db push
npx prisma generate
```

4) Gere convites:

```bash
node scripts/seed.js 10 2
```

5) Rode:

```bash
npm run dev
```

- Admin: `/admin`
- Check-in: `/checkin`
- Convite: `/i/<token>`

## Publicar online
- Vercel ou Render
- Use SQLite só para testes; para produção, troque datasource do Prisma para Postgres (Neon/Supabase/Render).
