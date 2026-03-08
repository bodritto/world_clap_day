#!/usr/bin/env node
/**
 * Set or reset admin panel credentials (email and password).
 * Uses DATABASE_URL from .env. Run from project root.
 *
 * Usage:
 *   node scripts/set-admin-credentials.cjs <email> <password>
 *   npm run admin:set-credentials -- admin@example.com MyNewPassword123
 */

require('dotenv/config')

async function main() {
  const email = process.argv[2]
  const password = process.argv[3]

  if (!email || !password) {
    console.error('Usage: node scripts/set-admin-credentials.cjs <email> <password>')
    console.error('Example: node scripts/set-admin-credentials.cjs admin@worldclapday.com MySecurePass123')
    process.exit(1)
  }

  if (password.length < 8) {
    console.error('Password must be at least 8 characters')
    process.exit(1)
  }

  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('DATABASE_URL is required (e.g. in .env)')
    process.exit(1)
  }

  const { PrismaClient } = require('@prisma/client')
  const { PrismaPg } = require('@prisma/adapter-pg')
  const { Pool } = require('pg')
  const bcrypt = require('bcryptjs')

  const pool = new Pool({ connectionString: databaseUrl })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  const passwordHash = await bcrypt.hash(password, 12)
  const existing = await prisma.adminUser.findFirst()

  if (existing) {
    await prisma.adminUser.update({
      where: { id: existing.id },
      data: { email, passwordHash, name: existing.name ?? 'Admin' },
    })
    console.log('Admin credentials updated.')
  } else {
    await prisma.adminUser.create({
      data: { email, passwordHash, name: 'Admin' },
    })
    console.log('Admin user created.')
  }

  console.log('Email:', email)
  console.log('You can log in at /admin/login with these credentials.')
  await prisma.$disconnect()
  await pool.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
