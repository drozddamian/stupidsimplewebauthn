const bcrypt = require('bcrypt')

const saltRounds = 10

export const getHashedPassword = async (plainTextPassword: string) =>
  await bcrypt.hash(plainTextPassword, saltRounds)

export const comparePassword = async (
  plainTextPassword: string,
  hashedPassword: string,
) => ({
  isPasswordMatch: await bcrypt.compare(plainTextPassword, hashedPassword),
})
