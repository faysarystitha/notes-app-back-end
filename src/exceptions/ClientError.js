class ClientError extends Error {
  constructor (message, statusCode = 400) {
    super(message) // memakai super untuk mengakses objek yang berasal dari parent class (Error)
    this.statusCode = statusCode
    this.name = 'ClientError'
  }
}

module.exports = ClientError
