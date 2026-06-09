const { nanoid } = require('nanoid');
const books = require('./books');

// ➕ ADD BOOK
const addBook = (req, res) => {
  const {
    name, year, author, summary,
    publisher, pageCount, readPage, reading
  } = req.body;

  if (!name) {
    return res.status(400).json({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku"
    });
  }

  if (readPage > pageCount) {
    return res.status(400).json({
      status: "fail",
      message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
    });
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const finished = pageCount === readPage;

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
    updatedAt: insertedAt
  };

  books.push(newBook); // 🔥 WAJIB

  return res.status(201).json({
    status: "success",
    message: "Buku berhasil ditambahkan",
    data: { bookId: id }
  });
};

// 📚 GET ALL BOOKS (WITH QUERY OPTIONAL)
const getAllBooks = (req, res) => {
  const { name, reading, finished } = req.query;

  let result = books;

  if (name) {
    result = result.filter(book =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (reading !== undefined) {
    result = result.filter(book =>
      book.reading === (Number(reading) === 1)
    );
  }

  if (finished !== undefined) {
    result = result.filter(book =>
      book.finished === (Number(finished) === 1)
    );
  }

  return res.json({
    status: "success",
    data: {
      books: result.map(b => ({
        id: b.id,
        name: b.name,
        publisher: b.publisher
      }))
    }
  });
};

// 🔍 GET DETAIL BOOK
const getBookById = (req, res) => {
  const { id } = req.params;

  const book = books.find(b => b.id === id);

  if (!book) {
    return res.status(404).json({
      status: "fail",
      message: "Buku tidak ditemukan"
    });
  }

  return res.json({
    status: "success",
    data: { book }
  });
};

// ✏️ UPDATE BOOK
const updateBook = (req, res) => {
  const { id } = req.params;

  const index = books.findIndex(b => b.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan"
    });
  }

  const {
    name, year, author, summary,
    publisher, pageCount, readPage, reading
  } = req.body;

  if (!name) {
    return res.status(400).json({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku"
    });
  }

  if (readPage > pageCount) {
    return res.status(400).json({
      status: "fail",
      message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
    });
  }

  const finished = pageCount === readPage;

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
    finished,
    updatedAt: new Date().toISOString()
  };

  return res.json({
    status: "success",
    message: "Buku berhasil diperbarui"
  });
};

// 🗑️ DELETE BOOK
const deleteBook = (req, res) => {
  const { id } = req.params;

  const index = books.findIndex(b => b.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan"
    });
  }

  books.splice(index, 1);

  return res.json({
    status: "success",
    message: "Buku berhasil dihapus"
  });
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook
};