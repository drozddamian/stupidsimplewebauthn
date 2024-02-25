import path from 'path'
const sqlite3 = require('sqlite3').verbose()

const databasePathname = path.join(process.cwd(), 'stupidsimple.db')

export const db = new sqlite3.Database(databasePathname)
