const {nanoid} = require('nanoid');
const books = require('./books');

const filterValue = (value) =>{
  const result = value.map((n) => ({
    id: n.id,
    name: n.name,
    publisher: n.publisher,
  }));
  return result;
};
const hasID = (obj, id) => {
  return obj.findIndex((n) => n.id === id);
};


// add book handler
const addBook = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading} = request.payload;

  if (!name) {
    const ress = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    ress.code(400);
    return ress;
  } else if (readPage > pageCount) {
    const ress = h.response({
      status: 'fail',
      message:
      'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    ress.code(400);
    return ress;
  }

  const id = nanoid(16);
  const finished = pageCount == readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);
  const isSuccess = books.filter(
      (n) => n.id === id).length > 0;
  if (isSuccess) {
    const ress = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    ress.code(201);
    return ress;
  };

  const ress = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  ress.code(500);
  return ress;
};


// get all book handler
const getAllBooks = (request, h) => {
  const {name, reading, finished} = request.query;

  if (name) {
    const nameValue = books.filter(
        (n) => n.name.toLowerCase().includes(name.toLowerCase()));
    const ress = h.response({
      status: 'success',
      data: {
        books: filterValue(nameValue),
      },
    });
    ress.code(200);
    return ress;
  } else if (reading) {
    const readingValue = books.filter(
        (n) => Number(n.reading) === Number(reading),
    );
    const ress = h.response({
      status: 'success',
      data: {
        books: filterValue(readingValue),
      },
    });
    ress.code(200);
    return ress;
  } else if (finished) {
    const finishedValue = books.filter(
        (n) => n.finished == finished);

    const ress = h.response({
      status: 'success',
      data: {
        books: filterValue(finishedValue),
      },
    });
    ress.code(200);
    return ress;
  } else {
    const ress = h.response( {
      status: 'success',
      data: {
        books: filterValue(books),
      },
    } );
    ress.code(200);
    return ress;
  }
};


// get book by id
const getBookById = (request, h) => {
  const {id} = request.params;
  const book = books.filter((n) => n.id === id)[0];
  if (book) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  } else {
    const ress = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    ress.code(404);
    return ress;
  };
};


// edit book
const editBook = (request, h) => {
  const {id} = request.params;
  const updatedAt = new Date().toISOString();
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const index = hasID(books, id);
  const pageValue = readPage > pageCount? true : false;

  if (!name) {
    const ress = h.response({
      'status': 'fail',
      'message': 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    ress.code(400);
    return ress;
  } else if (pageValue) {
    const ress = h.response({
      'status': 'fail',
      'message':
      'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    ress.code(400);
    return ress;
  } else if (index == -1) {
    const ress = h.response({
      'status': 'fail',
      'message': 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    ress.code(404);
    return ress;
  } else {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const ress = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    ress.code(200);
    return ress;
  }
};


// delete book by id
const deleteBookById = (request, h) => {
  const {id} = request.params;

  const index = hasID(books, id);
  if (index !== -1) {
    books.splice(index, 1);
    const ress = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    ress.code(200);
    return ress;
  }
  const ress = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  ress.code(404);
  return ress;
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  editBook,
  deleteBookById,
};
