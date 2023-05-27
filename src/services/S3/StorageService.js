// const AWS = require('aws-sdk')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')

class StorageService {
  constructor () {
    this._S3 = new S3Client({ region: process.env.AWS_REGION })
  }

  writeFile (file, meta) {
    const parameter = {
      Bucket: process.env.AWS_BUCKET_NAME, // Nama S3 bucket yang digunakan
      Key: +new Date() + meta.filename, // Nama berkas yang akan disimpan
      Body: file._data, // Berkas (dalam bentuk buffer) yang akan disimpan
      ContentType: meta.headers['content-type'] // MIME type berkas yang akan disimpan
    }

    const command = new PutObjectCommand(parameter)

    return new Promise((resolve, reject) => {
      this._S3.send(command, (error) => {
        if (error) reject(error)
        const fileLocation = `https://${parameter.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${parameter.Key}`
        resolve(fileLocation)
      })
    })
  }
}

module.exports = StorageService
