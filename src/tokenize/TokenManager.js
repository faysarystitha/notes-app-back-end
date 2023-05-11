const Jwt = require('@hapi/jwt')
const InvariantError = require('../exceptions/InvariantError')

const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY), // mempunyai 2 parameter yaitu payload dan secretKey
  generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken)
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY) // mengecek apakah refresh token memiliki signature yang sesuai atau tidak
      const { payload } = artifacts.decoded
      return payload // digunakan dalam membuat akses token baru
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid')
    }
  }
}

module.exports = TokenManager
