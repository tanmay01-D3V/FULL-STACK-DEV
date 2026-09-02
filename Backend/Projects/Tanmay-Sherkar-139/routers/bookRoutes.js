const express = require('express');
const bookRouter = express.Router();
const transactionRouter = express.Router();

const bookController = require('../controller/bookController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const { validate } = require('../middleware/validator');
const {
  bookValidation,
  updateBookValidation,
  bookIdParamValidation,
  bookQueryValidation,
  searchQueryValidation,
} = require('../utils/validation');


bookRouter.get('/',auth,validate(bookQueryValidation), bookController.getBooks);

bookRouter.get('/search',auth,validate(searchQueryValidation),bookController.searchBooks);

bookRouter.post('/',auth,requireRole('librarian'),validate(bookValidation),bookController.createBook);

bookRouter.get('/:id',auth,validate(bookIdParamValidation),bookController.getBookById);

bookRouter.put('/:id',auth,requireRole('librarian'),validate([...bookIdParamValidation, ...updateBookValidation]),bookController.updateBook);

bookRouter.delete('/:id',auth,requireRole('librarian'),validate(bookIdParamValidation),bookController.deleteBook);

bookRouter.post('/:id/borrow',auth,requireRole('student'),validate(bookIdParamValidation),bookController.borrowBook);

bookRouter.post('/:id/return',auth,requireRole('student'),validate(bookIdParamValidation),bookController.returnBook);

transactionRouter.get('/',auth,requireRole('librarian'),bookController.getAllTransactions);

transactionRouter.get('/my', auth, bookController.getMyTransactions);

module.exports = { bookRouter, transactionRouter };