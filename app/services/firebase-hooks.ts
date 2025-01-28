import { db } from "~/firebase.client";
import {
  doc,
  onSnapshot,
  setDoc,
  collection,
  addDoc,
} from "firebase/firestore";
import { addNewTraining, Collections } from "./firebase-data-service";
export const useFirestore = () => {
  const getDocument = (collection: Collections, docId: string, onUpdate) => {
    onSnapshot(doc(db, collection, docId), onUpdate);
  };

  const addocument = (
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

  return { getDocument, addocument, getCollection };
};
