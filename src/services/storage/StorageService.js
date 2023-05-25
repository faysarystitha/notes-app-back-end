const fs = require('fs')

class StorageService {
  constructor (folder) {
    this._folder = folder

    if (!fs.existsSync(folder)) { // pengecekan apakah folder telah ada atau belum
      fs.mkdirSync(folder, { recursive: true }) //  jika belum maka akan dibuatkan folder
    }
  }

  writeFile (file, meta) { // file yang merupakan readable dan meta yang mengandung informasi dari berkas
    const filename = +new Date() + meta.filename // memberikan nama berkas yang unik
    const path = `${this._folder}/${filename}` // menampung alamat berkas

    const fileStream = fs.createWriteStream(path)

    return new Promise((resolve, reject) => { // karena mengembalikan promise, maka fungsi ini berjalan secara async
      fileStream.on('error', (error) => reject(error))
      file.pipe(fileStream)
      file.on('end', () => resolve(filename))
    })
  }
}

module.exports = StorageService
