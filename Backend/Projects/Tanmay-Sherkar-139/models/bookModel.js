
/**
 * Book model
 * ----------
 * Data access layer for the Firestore `books` collection.
 * Document id === bookId (exposed in API responses).
 */
const { booksCollection } = require('../Config/firebase');

// Convert a Firestore snapshot into a plain book object.
const serialize = (snap) => {
  const data = snap.data();
  return { bookId: snap.id, ...data };
};

// Create a new book document.
const createBook = async (bookData) => {
  const docRef = await booksCollection.add({
    ...bookData,
    status: bookData.status || 'available',
    quantity: bookData.quantity || 1,
    createdAt: new Date(),
  });
  const snap = await docRef.get();
  return serialize(snap);
};

const findBookById = async (bookId) => {
  const snap = await booksCollection.doc(bookId).get();
  if (!snap.exists) return null;
  return serialize(snap);
};

const findAllBooks = async (filters = {}) => {
  let query = booksCollection;
  if (filters.status) {
    query = query.where('status', '==', filters.status);
  }
  if (filters.category) {
    query = query.where('category', '==', filters.category);
  }
  if (filters.title) {
    query = query.where('title', '==', filters.title);
  }
  if (filters.author) {
    query = query.where('author', '==', filters.author);
  }
  const querySnap = await query.get();
  return querySnap.docs.map(serialize);
};

const updateBook = async (bookId, updateData) => {
  await booksCollection.doc(bookId).update({ ...updateData, updatedAt: new Date() });
  return findBookById(bookId);
};

const deleteBook = async (bookId) => {
  await booksCollection.doc(bookId).delete();
};

const searchBooks = async (queryText) => {
  const q = queryText.toLowerCase();
  const querySnap = await booksCollection
    .orderBy('title')
    .where('title', '>=', q)
    .where('title', '<=', q + '\uf8ff')
    .get();

  const prefixMatches = querySnap.docs.map(serialize);

  const allSnap = await booksCollection.get();
  const substringMatches = allSnap.docs
    .map(serialize)
    .filter(
      (book) =>
        (book.title && book.title.toLowerCase().includes(q)) ||
        (book.author && book.author.toLowerCase().includes(q))
    );

  const seen = new Set();
  return [...prefixMatches, ...substringMatches].filter((book) => {
    if (seen.has(book.bookId)) return false;
    seen.add(book.bookId);
    return true;
  });
};

module.exports = {
  createBook,
  findBookById,
  findAllBooks,
  updateBook,
  deleteBook,
  searchBooks,
  serialize,
};