import crypto from 'node:crypto'

import DBLocal from 'db-local'
import bcrypt from 'bcryptjs'
import { SALT_ROUNDS } from './config.js'

const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})

export class UserRepository {
  static async create ({ username, password }) {
    // Validaciones de username
    const usernameErrors = Validation.username(username)
    const passwordErrors = Validation.password(password)

    const errors = {
      username: usernameErrors,
      password: passwordErrors
    }

    if (usernameErrors.length > 0 || passwordErrors.length > 0) {
      throw errors
    }

    // Asegurarse que el username nooooo existe
    const user = User.findOne({ username })
    if (user) {
      errors.username.push('Username already exists')
      throw errors
    }

    const id = crypto.randomUUID()

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    User.create({
      _id: id,
      username,
      password: hashedPassword
    }).save()

    return id
  }

  static async login ({ username, password }) {
    const usernameErrors = Validation.username(username)
    const passwordErrors = Validation.password(password)

    const errors = {
      username: usernameErrors,
      password: passwordErrors
    }

    if (usernameErrors.length > 0 || passwordErrors.length > 0) {
      throw errors
    }

    const user = User.findOne({ username })
    if (!user) {
      errors.username.push('username does not exist')
      throw errors
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) throw new Error('password is invalid')

    const { password: _, ...publicUser } = user

    return publicUser
  }
}

class Validation {
  static username (username) {
    const errors = []
    if (typeof username !== 'string') {
      errors.push('Must be a string')
    }
    if (username.length < 3) {
      errors.push('Must be at least 3 characters long')
    }
    return errors
  }

  static password (password) {
    const errors = []
    if (typeof password !== 'string') {
      errors.push('Must be a string')
    }
    if (password.length < 6) {
      errors.push('Must be at least 6 characters long')
    }
    return errors
  }
}
