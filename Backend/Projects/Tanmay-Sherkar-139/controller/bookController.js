const ApiError = require("../utils/ApiError");
const {
  db,
  booksCollection,
  transactionsCollection,
} = require("../Config/firebase");
const bookModel = require("../models/bookModel");
const transactionModel = require("../models/transactionModel");
const userModel = require("../models/userModel");

const BORROW_DURATION_DAYS =
  parseInt(process.env.BORROW_DURATION_DAYS, 10) || 14;

const enrichTransaction = async (transaction) => {
  const [user, book] = await Promise.all([
    userModel.findUserById(transaction.userId),
    bookModel.findBookById(transaction.bookId),
  ]);
  return {
    ...transaction,
    user: user
      ? { userId: user.userId, name: user.name, email: user.email }
      : null,
    book: book
      ? { bookId: book.bookId, title: book.title, author: book.author }
      : null,
  };
};

const getBooks = async (req, res, next) => {
  try {
    const books = await bookModel.findAllBooks({
      title: req.query.title,
      author: req.query.author,
      category: req.query.category,
      status: req.query.status,
    });
    res.status(200).json({ count: books.length, books });
  } catch (err) {
    next(err);
  }
};

const searchBooks = async (req, res, next) => {
  try {
    const books = await bookModel.searchBooks(req.query.q);
    res.status(200).json({ count: books.length, books });
  } catch (err) {
    next(err);
  }
};

const getBookById = async (req, res, next) => {
  try {
    const book = await bookModel.findBookById(req.params.id);
    if (!book) {
      throw new ApiError(404, "Book not found.");
    }
    res.status(200).json({ book });
  } catch (err) {
    next(err);
  }
};

const createBook = async (req, res, next) => {
  try {
    const { title, author, isbn, category, quantity = 1 } = req.body;
    const newBook = await bookModel.createBook({
      title,
      author,
      isbn,
      category,
      quantity,
      status: quantity > 0 ? "available" : "borrowed",
    });
    res
      .status(201)
      .json({ message: "Book created successfully.", book: newBook });
  } catch (err) {
    next(err);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const book = await bookModel.findBookById(req.params.id);
    if (!book) {
      throw new ApiError(404, "Book not found.");
    }

    const updates = {};
    ["title", "author", "isbn", "category"].forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (req.body.quantity !== undefined) {
      if (req.body.quantity < 0) {
        throw new ApiError(400, "Quantity cannot be negative.");
      }
      updates.quantity = req.body.quantity;
      updates.status = req.body.quantity > 0 ? "available" : "borrowed";
    }

    const updatedBook = await bookModel.updateBook(req.params.id, updates);
    res
      .status(200)
      .json({ message: "Book updated successfully.", book: updatedBook });
  } catch (err) {
    next(err);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const book = await bookModel.findBookById(req.params.id);
    if (!book) {
      throw new ApiError(404, "Book not found.");
    }
    await bookModel.deleteBook(req.params.id);
    res.status(200).json({ message: "Book deleted successfully." });
  } catch (err) {
    next(err);
  }
};

const borrowBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.userId;

    let newTransactionId;
    await db.runTransaction(async (t) => {
      const bookRef = booksCollection.doc(bookId);
      const bookSnap = await t.get(bookRef);
      if (!bookSnap.exists) {
        throw new ApiError(404, "Book not found.");
      }

      const book = bookSnap.data();
      if (book.quantity <= 0) {
        throw new ApiError(400, "Book is not available for borrowing.");
      }

      const newQuantity = book.quantity - 1;
      t.update(bookRef, {
        quantity: newQuantity,
        status: newQuantity === 0 ? "borrowed" : "available",
        updatedAt: new Date(),
      });

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + BORROW_DURATION_DAYS);

      const txRef = transactionsCollection.doc();
      t.set(txRef, {
        userId,
        bookId,
        type: "borrow",
        borrowDate: new Date(),
        returnDate: null,
        dueDate,
        status: "active",
        createdAt: new Date(),
      });
      newTransactionId = txRef.id;
    });

    const transaction =
      await transactionModel.findTransactionById(newTransactionId);
    res.status(201).json({
      message: "Book borrowed successfully.",
      dueDate: transaction.dueDate,
      transaction,
    });
  } catch (err) {
    next(err);
  }
};

const returnBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.userId;

    const activeBorrow = await transactionModel.findActiveBorrow(
      userId,
      bookId,
    );
    if (!activeBorrow) {
      throw new ApiError(400, "No active borrow found for this book.");
    }

    let transaction;
    await db.runTransaction(async (t) => {
      const bookRef = booksCollection.doc(bookId);
      const bookSnap = await t.get(bookRef);
      const book = bookSnap.exists ? bookSnap.data() : { quantity: 0 };

      const newQuantity = book.quantity + 1;
      t.update(bookRef, {
        quantity: newQuantity,
        status: newQuantity > 0 ? "available" : "borrowed",
        updatedAt: new Date(),
      });

      const txRef = transactionsCollection.doc(activeBorrow.transactionId);
      t.update(txRef, {
        type: "return",
        returnDate: new Date(),
        status: "returned",
        updatedAt: new Date(),
      });
    });

    transaction = await transactionModel.findTransactionById(
      activeBorrow.transactionId,
    );
    res.status(200).json({
      message: "Book returned successfully.",
      transaction,
    });
  } catch (err) {
    next(err);
  }
};

const getAllTransactions = async (req, res, next) => {
  try {
    await transactionModel.markOverdueTransactions();
    const transactions = await transactionModel.findAllTransactions();
    const enriched = await Promise.all(transactions.map(enrichTransaction));
    res.status(200).json({ count: enriched.length, transactions: enriched });
  } catch (err) {
    next(err);
  }
};

const getMyTransactions = async (req, res, next) => {
  try {
    await transactionModel.markOverdueTransactions();
    const transactions = await transactionModel.findTransactionsByUser(
      req.user.userId,
    );
    const enriched = await Promise.all(transactions.map(enrichTransaction));
    res.status(200).json({ count: enriched.length, transactions: enriched });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
  borrowBook,
  returnBook,
  getAllTransactions,
  getMyTransactions,
};
