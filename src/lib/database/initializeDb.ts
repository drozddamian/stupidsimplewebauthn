const path = require('path')
const sqlite3 = require('sqlite3').verbose()
const databasePathname = path.join(process.cwd(), 'stupidsimple.db')

const db = new sqlite3.Database(databasePathname, (err) => {
  if (err) {
    console.error('Error opening database', err.message)
  } else {
    console.log('Connected to the SQLite database.')
  }
})

db.serialize(() => {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `,
    (err) => {
      if (err) {
        console.error('Error creating table', err)
      } else {
        console.log('Created table.')
      }
    },
  )

  db.close((err) => {
    if (err) {
      console.error('Error closing database', err)
    } else {
      console.log('Closed the database connection.')
    }
  })
})
