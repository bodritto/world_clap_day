#!/usr/bin/env node
/**
 * At startup: ensure admin user exists from ADMIN_EMAIL + ADMIN_PASSWORD in env.
 * Reads .env and .env.local. If both vars are set, creates or updates the admin.
 * If DB is down or vars missing, exits without failing (so dev/start still run).
 */

const path = require('path')
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') })
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') })
if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env.production') })
}

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    return
  }

  if (password.length < 8) {
    console.warn('[ensure-admin] ADMIN_PASSWORD must be at least 8 characters, skipping.')
    return
  }

  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    return
  }

  try {
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
      console.log('[ensure-admin] Admin credentials updated from env.')
    } else {
      await prisma.adminUser.create({
        data: { email, passwordHash, name: 'Admin' },
      })
      console.log('[ensure-admin] Admin user created from env.')
    }

    await prisma.$disconnect()
    await pool.end()
  } catch (err) {
    console.warn('[ensure-admin] Could not ensure admin (e.g. DB not ready):', err.message)
  }
}

main()
