const ClientError = require('../../exceptions/ClientError')

class NotesHandler {
  constructor (service, validator) { // parameter service akan diberikan nilai instance dari NotesService
    this._service = service // NotesHandler memiliki akses untuk mengelola resource notes melalui ini
    this._validator = validator

    this.postNoteHandler = this.postNoteHandler.bind(this)
    this.getNotesHandler = this.getNotesHandler.bind(this)
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this)
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this)
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this)

    /* Fungsi bind adalah member dari Function.prototype di mana setiap function JavaScript
    dapat mengakses fungsi ini. Fungsi bind berfungsi untuk mengikat implementasi function
    agar ia tetap memiliki konteks sesuai nilai yang ditetapkan pada argumen yang diberikan
    pada fungsi bind tersebut. */
  }

  postNoteHandler (request, h) {
    try {
      this._validator.validateNotePayload(request.payload)
      const { title = 'untitled', body, tags } = request.payload
      const noteId = this._service.addNote({ title, body, tags })

      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil ditambahkan',
        data: {
          noteId
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
      console.error(error) // memberikan penjelasan error apa yang terjadi pada console
      return response
    }
  }

  getNotesHandler () {
    const notes = this._service.getNotes()
    return {
      status: 'success',
      data: {
        notes
      }
    }
  }

  getNoteByIdHandler (request, h) {
    try {
      const { id } = request.params
      const note = this._service.getNoteById(id)
      return {
        status: 'success',
        data: {
          note
        }
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
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      }).code(500)
      console.error(error)
      return response
    }
  }

  putNoteByIdHandler (request, h) {
    try {
      this._validator.validateNotePayload(request.payload)
      const { id } = request.params
      this._service.editNoteById(id, request.payload)
      return {
        status: 'success',
        message: 'Catatan berhasil diperbarui'
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
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      }).code(500)
      console.error(error)
      return response
    }
  }

  deleteNoteByIdHandler (request, h) {
    try {
      const { id } = request.params
      this._service.deleteNoteById(id)
      return {
        status: 'success',
        message: 'Catatan berhasil dihapus'
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
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      }).code(500)
      console.error(error)
      return response
    }
  }
}

module.exports = NotesHandler