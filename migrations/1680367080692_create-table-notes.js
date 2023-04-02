/* eslint-disable camelcase */

exports.up = pgm => { // kode untuk membuat tabel notes menggunakan pgm (pg-node-migrate)
  pgm.createTable('notes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    title: {
      type: 'TEXT',
      notNull: true
    },
    body: {
      type: 'TEXT',
      notNull: true
    },
    tags: {
      type: 'TEXT[]',
      notNull: true
    },
    created_at: {
      type: 'TEXT',
      notNull: true
    },
    updated_at: {
      type: 'TEXT',
      notNull: true
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('notes')
}
