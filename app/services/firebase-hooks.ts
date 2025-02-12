import { db } from "~/firebase.client";
import { doc, onSnapshot, setDoc, collection } from "firebase/firestore";
import { addNewTraining, Collections } from "./firebase-data-service";
import { UserData, userConverter } from "~/models/userData";

export const useFirestore = () => {
  const getDocument = (
    collection: Collections,
    docId: string,
    onUpdate: (data: any) => void
  ) => {
    return onSnapshot(doc(db, collection, docId), onUpdate);
  };

  const updateDocument = (
    collection: Collections,
    docId: string,
    data: any,
    onError?: (err: Error) => void
  ) => {
    switch (collection) {
      case Collections.USERS:
        setDoc(
          doc(db, collection, docId),
          userConverter.toFirestore(data as UserData),
          {
            merge: true,
          }
        );
    }
  };

  const addDocument = (
    collection: Collections,
    document: any,
    onError: (err: Error) => void
  ) => {
    if (collection == Collections.TRAININGS) {
      addNewTraining(document)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          onError(err);
        });
    }
  };

  const getCollection = (
    collectionId: Collections,
    onUpdate,
    onError: (err: Error) => void
  ) => {
    const unsubscribe = onSnapshot(
      collection(db, collectionId),
      onUpdate,
      onError
    );
    return unsubscribe;
  };

  return { getDocument, addDocument, updateDocument, getCollection };
};
