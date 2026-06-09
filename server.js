const express = require('express');

const {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook
} = require('./handler');

const app = express();
const PORT = 9000;

app.use(express.json());

// ROUTES
app.post('/books', addBook);
app.get('/books', getAllBooks);
app.get('/books/:id', getBookById);
app.put('/books/:id', updateBook);
app.delete('/books/:id', deleteBook);

app.listen(PORT, () => {
  console.log(`Server jalan di port ${PORT}`);
});