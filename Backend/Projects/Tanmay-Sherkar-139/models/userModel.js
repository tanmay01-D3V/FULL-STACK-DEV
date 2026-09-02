const { usersCollection } = require('../Config/firebase');

const serialize = (snap) => {
  const data = snap.data();
  return { userId: snap.id, ...data };
};

const createUser = async (userData) => {
  const docRef = await usersCollection.add({
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const snap = await docRef.get();
  return serialize(snap);
};

const findUserByEmail = async (email) => {
  const querySnap = await usersCollection.where('email', '==', email).limit(1).get();
  if (querySnap.empty) return null;
  return serialize(querySnap.docs[0]);
};

const findUserById = async (userId) => {
  const snap = await usersCollection.doc(userId).get();
  if (!snap.exists) return null;
  return serialize(snap);
};

const findAllUsers = async (role) => {
  let query = usersCollection;
  if (role) {
    query = usersCollection.where('role', '==', role);
  }
  const querySnap = await query.get();
  return querySnap.docs.map(serialize);
};

const updateUser = async (userId, updateData) => {
  const updates = { ...updateData, updatedAt: new Date() };
  await usersCollection.doc(userId).update(updates);
  return findUserById(userId);
};

const updateUserRole = async (userId, role) => {
  return updateUser(userId, { role });
};

const deleteUser = async (userId) => {
  await usersCollection.doc(userId).delete();
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  findAllUsers,
  updateUser,
  updateUserRole,
  deleteUser,
};