import admin from '../../firebase';

const db = admin.firestore();

export function getDocFromCollection(collection, id) {
  return db.collection(collection).doc(id).get()
    .then(result => result.data())
    .catch(error => error);
}

export function updateDocOnCollection(collection, id, dataToUpdate) {
  return db.collection(collection).doc(id).update(dataToUpdate)
    .then(result => result)
    .catch(error => error);
}