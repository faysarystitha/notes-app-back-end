const ClientError = require('../../exceptions/ClientError')

class UploadsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this)
  }

  async postUploadImageHandler (request, h) {
    try {
      const { data } = request.payload // data yang merupakan readable
      this._validator.validateImageHeaders(data.hapi.headers)

      const fileLocation = await this._service.writeFile(data, data.hapi)

      const response = h.response({
        status: 'success',
        data: {
          fileLocation
        }
      }).code(201)
      return response
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        }).code(error.statusCode)
        return response
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      }).code(500)
      console.error(error)
      return response
    }
  }
}

module.exports = UploadsHandler
