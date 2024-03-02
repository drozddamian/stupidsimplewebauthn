import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await sql`
     CREATE TABLE IF NOT EXISTS Users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      challenge TEXT
    );`

    await sql`
     CREATE TABLE IF NOT EXISTS Authenticators (
      id SERIAL PRIMARY KEY,
      userID INTEGER NOT NULL,
      credentialID TEXT NOT NULL,
      credentialPublicKey BYTEA NOT NULL,
      counter BIGINT NOT NULL,
      credentialDeviceType VARCHAR(32) NOT NULL,
      credentialBackedUp BOOLEAN NOT NULL,
      transports VARCHAR(255),
      CONSTRAINT fk_user FOREIGN KEY(userID) REFERENCES Users(id) ON DELETE CASCADE
    );`

    await sql`CREATE INDEX IF NOT EXISTS idx_authenticators_credentialID ON Authenticators (credentialID);`

    return NextResponse.json({ message: 'success' }, { status: 200 })
  } catch (error) {
    console.error('error: ', error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
