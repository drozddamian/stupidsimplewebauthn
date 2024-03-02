import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await sql`
     CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      challenge TEXT
    );`

    await sql`
    CREATE TABLE IF NOT EXISTS authenticators (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL, -- You need to define this column
      credential_id TEXT NOT NULL,
      credential_public_key BYTEA NOT NULL,
      counter BIGINT NOT NULL,
      credential_device_type VARCHAR(32) NOT NULL,
      credential_backed_up BOOLEAN NOT NULL,
      transports VARCHAR(255),
      CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );`

    await sql`CREATE INDEX idx_authenticators_credential_id ON authenticators(credential_id);`

    return NextResponse.json({ message: 'success' }, { status: 200 })
  } catch (error) {
    console.error('error: ', error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
