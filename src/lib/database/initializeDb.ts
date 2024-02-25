const path = require('path')
const sqlite3 = require('sqlite3').verbose()
const databasePathname = path.join(process.cwd(), 'stupidsimple.db')

const db = new sqlite3.Database(databasePathname, (err: Error) => {
  if (err) {
    console.error('Error opening database', err.message)
  } else {
    console.log('Connected to the SQLite database.')
  }
})

db.serialize(() => {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      challenge TEXT
    )
  `,
    (err: Error) => {
      if (err) {
        console.error('Error creating Users table', err)
      } else {
        console.log('Created Users table.')
      }
    },
  )

  db.run(
    `
    CREATE TABLE IF NOT EXISTS Authenticators (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userID INTEGER NOT NULL,
      credentialID TEXT NOT NULL,
      credentialPublicKey BYTEA NOT NULL,
      counter BIGINT NOT NULL,
      credentialDeviceType VARCHAR(32) NOT NULL,
      credentialBackedUp BOOLEAN NOT NULL,
      transports VARCHAR(255)
    );
    
    CONSTRAINT fk_user
        FOREIGN KEY(userID) 
        REFERENCES Users(id)
        ON DELETE CASCADE;
    
    CREATE INDEX idx_authenticators_credentialID ON Authenticators (credentialID);
  `,
    (err: Error) => {
      if (err) {
        console.error('Error creating table Authenticators', err)
      } else {
        console.log('Created Authenticators table.')
      }
    },
  )

  db.close((err: Error) => {
    if (err) {
      console.error('Error closing database', err)
    } else {
      console.log('Closed the database connection.')
    }
  })
})
