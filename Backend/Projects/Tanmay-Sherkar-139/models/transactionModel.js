const { transactionsCollection } = require('../Config/firebase');

const serialize = (snap) => {
  const data = snap.data();
  return { transactionId: snap.id, ...data };
};

const createTransaction = async (transactionData) => {
  const docRef = await transactionsCollection.add({
    ...transactionData,
    returnDate: null,
    status: 'active',
    createdAt: new Date(),
  });
  const snap = await docRef.get();
  return serialize(snap);
};

const findActiveBorrow = async (userId, bookId) => {
  const querySnap = await transactionsCollection
    .where('userId', '==', userId)
    .where('bookId', '==', bookId)
    .where('type', '==', 'borrow')
    .where('status', '==', 'active')
    .limit(1)
    .get();
  if (querySnap.empty) return null;
  return serialize(querySnap.docs[0]);
};

const findTransactionById = async (transactionId) => {
  const snap = await transactionsCollection.doc(transactionId).get();
  if (!snap.exists) return null;
  return serialize(snap);
};

const updateTransaction = async (transactionId, updateData) => {
  await transactionsCollection.doc(transactionId).update({
    ...updateData,
    updatedAt: new Date(),
  });
  return findTransactionById(transactionId);
};

const findAllTransactions = async () => {
  const querySnap = await transactionsCollection.orderBy('borrowDate', 'desc').get();
  return querySnap.docs.map(serialize);
};

const findTransactionsByUser = async (userId) => {
  const querySnap = await transactionsCollection
    .where('userId', '==', userId)
    .orderBy('borrowDate', 'desc')
    .get();
  return querySnap.docs.map(serialize);
};

const markOverdueTransactions = async () => {
  const now = new Date();
  const querySnap = await transactionsCollection
    .where('status', 'in', ['active'])
    .where('dueDate', '<', now)
    .get();
  const batch = transactionsCollection.firestore.batch();
  querySnap.docs.forEach((doc) => {
    batch.update(doc.ref, { status: 'overdue', updatedAt: new Date() });
  });
  await batch.commit();
};

module.exports = {
  createTransaction,
  findActiveBorrow,
  findTransactionById,
  updateTransaction,
  findAllTransactions,
  findTransactionsByUser,
  markOverdueTransactions,
  serialize,
};