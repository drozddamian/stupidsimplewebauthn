import { QueryResult, sql } from '@vercel/postgres'
import { Authenticator, RawAuthenticator } from '@/lib/auth/types'
import { User } from '@/types'
import {
  arrayToCSV,
  authenticatorTransportCSVToTypedArray,
  fromBase64UrlString,
} from '@/utils'
import { isoBase64URL } from '@simplewebauthn/server/helpers'

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

    console.log('existingUserAuthenticators: ', existingUserAuthenticators)

    return (
      existingUserAuthenticators.rows.map((authenticatorDatabaseValues) => ({
        id: authenticatorDatabaseValues.id,
        credentialID: fromBase64UrlString(
          authenticatorDatabaseValues.credential_id,
        ),
        credentialPublicKey: fromBase64UrlString(
          authenticatorDatabaseValues.credential_public_key,
        ),
        counter: Number(authenticatorDatabaseValues.counter),
        credentialDeviceType:
          authenticatorDatabaseValues.credential_device_type,
        credentialBackedUp: authenticatorDatabaseValues.credential_backed_up,
        transports: authenticatorTransportCSVToTypedArray(
          authenticatorDatabaseValues.transports,
        ),
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
      await sql`SELECT * FROM Authenticators WHERE credential_id = ${authenticatorId} AND user_id = ${userId};`

    console.log('userAuthenticatorById: ', userAuthenticatorById)

    return userAuthenticatorById.rows
      ? {
          id: userAuthenticatorById.rows[0].id,
          credentialID: fromBase64UrlString(
            userAuthenticatorById.rows[0].credential_id,
          ),
          credentialPublicKey: fromBase64UrlString(
            userAuthenticatorById.rows[0].credential_public_key,
          ),
          counter: Number(userAuthenticatorById.rows[0].counter),
          credentialDeviceType:
            userAuthenticatorById.rows[0].credential_device_type,
          credentialBackedUp:
            userAuthenticatorById.rows[0].credential_backed_up,
          transports: authenticatorTransportCSVToTypedArray(
            userAuthenticatorById.rows[0].transports,
          ),
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
          ${isoBase64URL.fromBuffer(authenticator.credentialID)},
          ${isoBase64URL.fromBuffer(authenticator.credentialPublicKey)},
          ${authenticator.counter},
          ${authenticator.credentialDeviceType},
          ${authenticator.credentialBackedUp}, 
          ${authenticator.transports ? arrayToCSV(authenticator.transports) : null}
        );`
}
