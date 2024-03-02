import { QueryResult, sql } from '@vercel/postgres'
import { Authenticator } from '@/lib/auth/types'
import { User } from '@/types'

export const getExistingUser = async (
  username: string,
): Promise<User | null> => {
  try {
    const existingUserResult: QueryResult<User> =
      await sql`SELECT * FROM Users WHERE username = ${username};`

    return existingUserResult.rows ? existingUserResult.rows[0] : null
  } catch (error) {
    console.error(error)
    return null
  }
}

export const insertUser = (username: string, hashedPassword: string) => {
  return sql`INSERT INTO Users (username, password) VALUES (${username}, ${hashedPassword});`
}

export const getExistingUserAuthenticators = async (
  userId: string,
): Promise<Authenticator[] | null> => {
  try {
    const existingUserAuthenticators: QueryResult<Authenticator> =
      await sql`SELECT * FROM Authenticators WHERE user_id = ${userId};`

    return existingUserAuthenticators.rows ?? null
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getExistingUserAuthenticatorById = async (
  userId: string,
  authenticatorId: string,
): Promise<Authenticator | null> => {
  try {
    const userAuthenticatorById: QueryResult<Authenticator> =
      await sql`SELECT * FROM Authenticators WHERE id = ${authenticatorId} AND user_id = ${userId};`

    return userAuthenticatorById.rows ? userAuthenticatorById.rows[0] : null
  } catch (error) {
    console.error(error)
    return null
  }
}

export const updateChallengeForUser = (
  userId: string,
  challenge: string,
): Promise<QueryResult> => {
  return sql`UPDATE Users SET challenge = ${challenge} WHERE id = ${userId};`
}

export const insertAuthenticator = (
  userId: string,
  authenticator: Authenticator,
): Promise<QueryResult<Authenticator>> => {
  return sql`
    INSERT INTO Authenticators 
        (user_id, credential_id, credential_public_key, counter, credential_device_type, credential_backed_up, transports)  
        VALUES (
          ${userId},
          ${String(authenticator.credentialID)},
          ${String(authenticator.credentialPublicKey)},
          ${authenticator.counter},
          ${authenticator.credentialDeviceType},
          ${authenticator.credentialBackedUp},
          ${authenticator.transports ? authenticator.transports.join(',') : ''}
        );`
}
