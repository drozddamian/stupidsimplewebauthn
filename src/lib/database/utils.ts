import { db } from '@/lib/database/db'
import { User } from '@/types'
import { Authenticator } from '@/lib/auth/types'

export const getExistingUser = (username: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM Users WHERE username = ?',
      [username],
      (err, existingUser: User | null) => {
        if (err) {
          reject(err)
        } else {
          resolve(existingUser)
        }
      },
    )
  })
}

export const insertUser = (username: string, hashedPassword: string) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        'INSERT INTO Users (username, password) VALUES (?, ?)',
        [username, hashedPassword],
        function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve(username)
        },
      )
    })
  })
}

export const getExistingUserAuthenticators = (
  userId: string,
): Promise<Authenticator[] | null> => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM Authenticators WHERE userID = ?',
      [userId],
      (err, authenticators: Authenticator[] | null) => {
        if (err) {
          reject(err)
        } else {
          resolve(authenticators)
        }
      },
    )
  })
}

export const getExistingUserAuthenticatorById = (
  userId: string,
  authenticatorId: string,
): Promise<Authenticator | null> => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM Authenticators WHERE userID = ? AND id = ?',
      [userId, authenticatorId],
      (err, authenticator: Authenticator | null) => {
        if (err) {
          reject(err)
        } else {
          resolve(authenticator)
        }
      },
    )
  })
}

export const updateChallengeForUser = (
  userId: string,
  challenge: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE Users SET challenge = ? WHERE id = ?',
      [challenge, userId],
      (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      },
    )
  })
}

export const insertAuthenticator = (
  userId: string,
  authenticator: Authenticator,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO Authenticators 
      (userID, credentialID, credentialPublicKey, counter, credentialDeviceType, credentialBackedUp, transports) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        authenticator.credentialID,
        authenticator.credentialPublicKey,
        authenticator.counter,
        authenticator.credentialDeviceType,
        authenticator.credentialBackedUp,
        authenticator.transports ? authenticator.transports.join(',') : '',
      ],
      (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      },
    )
  })
}
