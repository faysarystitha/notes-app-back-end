// memuat kode untuk membuat, mengonfigurasi, dan menjalankan server HTTP menggunakan Hapi

require('dotenv').config() // agar node.js bisa memproses berkas .env

const Hapi = require('@hapi/hapi')

const notes = require('./api/notes')
const NotesService = require('./services/postgres/NotesService')
const NotesValidator = require('./validator/notes')

const users = require('./api/users')
const UsersService = require('./services/postgres/UsersService')
const UsersValidator = require('./validator/users')

const init = async () => {
  const notesService = new NotesService()
  const usersService = new UsersService()

  const server = Hapi.server({ // membuat server
    port: process.env.PORT,
    host: process.env.HOST, // properti host akan bernilai sesuai dengan environment
    routes: {
      cors: { // cross-origin resource sharing
        origin: ['*'] // origin terdiri dari tiga: protokol (http:/), host (blablabla.com), dan port number
      }
    }
  })

  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: NotesValidator
      }
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator
      }
    }
  ])

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
