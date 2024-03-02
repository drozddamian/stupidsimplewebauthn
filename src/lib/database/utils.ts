import { QueryResult, sql } from '@vercel/postgres'
import { Authenticator, RawAuthenticator } from '@/lib/auth/types'
import { User } from '@/types'
import { arrayToCSV, toBase64Url, toBytea } from '@/utils'

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

export const getExistingUserAuthenticators = async (
  userId: string,
): Promise<Authenticator[] | null> => {
  try {
    const existingUserAuthenticators: QueryResult<RawAuthenticator> =
      await sql`SELECT * FROM Authenticators WHERE user_id = ${userId};`

    return (
      existingUserAuthenticators.rows.map((authenticatorDatabaseValues) => ({
        id: authenticatorDatabaseValues.id,
        credentialID: authenticatorDatabaseValues.credential_id,
        credentialPublicKey: authenticatorDatabaseValues.credential_public_key,
        counter: authenticatorDatabaseValues.counter,
        credentialDeviceType:
          authenticatorDatabaseValues.credential_device_type,
        credentialBackedUp: authenticatorDatabaseValues.credential_backed_up,
        transports: authenticatorDatabaseValues.transports,
      })) ?? null
    )
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
    const userAuthenticatorById: QueryResult<RawAuthenticator> =
      await sql`SELECT * FROM Authenticators WHERE id = ${authenticatorId} AND user_id = ${userId};`

    return userAuthenticatorById.rows
      ? {
          id: userAuthenticatorById.rows[0].id,
          credentialID: userAuthenticatorById.rows[0].credential_id,
          credentialPublicKey:
            userAuthenticatorById.rows[0].credential_public_key,
          counter: userAuthenticatorById.rows[0].counter,
          credentialDeviceType:
            userAuthenticatorById.rows[0].credential_device_type,
          credentialBackedUp:
            userAuthenticatorById.rows[0].credential_backed_up,
          transports: userAuthenticatorById.rows[0].transports,
        }
      : null
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

export const insertUser = (username: string, hashedPassword: string) => {
  return sql`INSERT INTO Users (username, password) VALUES (${username}, ${hashedPassword});`
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
          ${toBase64Url(authenticator.credentialID)},
          ${
            // @ts-ignore
            toBytea(authenticator.credentialPublicKey)
          },
          ${authenticator.counter},
          ${authenticator.credentialDeviceType},
          ${authenticator.credentialBackedUp},
          ${authenticator.transports ? arrayToCSV(authenticator.transports) : null}
        );`
}
