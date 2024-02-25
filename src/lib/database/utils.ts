import { db } from '@/lib/database/db'
import { User } from '@/types'

export const getExistingUser = (username: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE username = ?',
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
        'INSERT INTO users (username, password) VALUES (?, ?)',
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
