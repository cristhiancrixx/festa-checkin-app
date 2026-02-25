/* eslint-disable no-console */
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function genToken() {
  return crypto.randomBytes(24).toString('base64url');
}

async function main() {
  const count = Number(process.argv[2] || 10);
  const maxPeople = Number(process.argv[3] || 2) === 1 ? 1 : 2;

  const created = [];
  for (let i = 0; i < count; i++) {
    const token = genToken();
    await prisma.invite.create({ data: { token, maxPeople } });
    created.push(token);
  }

  console.log('Tokens gerados:');
  for (const t of created) console.log(t);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
