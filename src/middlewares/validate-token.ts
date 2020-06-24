import * as jsonwebtoken from 'jsonwebtoken'
import config from '@local/config'

type ValidateResponse = {
  id: string
  warriorname: string
  iat: number
  exp: number
}

export const validateToken = (token: string): ValidateResponse => {
  return jsonwebtoken.verify(token, config.jwtSecret) as ValidateResponse
}
