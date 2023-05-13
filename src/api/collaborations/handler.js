const ClientError = require('../../exceptions/ClientError')

class CollaborationsHandler {
  constructor (collaborationsService, notesService, validator) {
    this._collaborationsService = collaborationsService
    this._notesService = notesService
    this._validator = validator

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this)
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this)
  }

  async postCollaborationHandler (request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload)
      const { id: credentialId } = request.auth.credentials // mengambil id dari owner yang melakukan request kolaborator
      const { noteId, userId } = request.payload

      await this._notesService.verifyNoteOwner(noteId, credentialId)
      const collaborationId = await this._collaborationsService.addCollaboration(noteId, userId)

      const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: {
          collaborationId
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

      // Server error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      }).code(500)
      console.error(error)
      return response
    }
  }

  async deleteCollaborationHandler (request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload)
      const { id: credentialId } = request.auth.credentials
      const { noteId, userId } = request.payload

      await this._notesService.verifyNoteOwner(noteId, credentialId)
      await this._collaborationsService.deleteCollaboration(noteId, userId)

      return {
        status: 'success',
        message: 'Kolaborasi berhasil dihapus'
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        }).code(error.statusCode)
        return response
      }

      const response = h.response({
        status: 'fail',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      }).code(500)
      console.error(error)
      return response
    }
  }
}

module.exports = CollaborationsHandler
