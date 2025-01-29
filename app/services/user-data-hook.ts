import { User } from "firebase/auth";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { userConverter, UserData } from "~/models/userData";
import { Collections } from "./firebase-data-service";
import { DocumentSnapshot } from "firebase/firestore";
import { useFirestore } from "./firebase-hooks";

export function useUserData(
  user: User | undefined
): [UserData, Dispatch<UserData>] {
  const [localData, setLocalData] = useState<UserData>({});
  const fb = useFirestore();

  // subscribe to user profile changes
  useEffect(() => {
    if (user) {
      const unsubscribe = fb.getDocument(
        Collections.USERS,
        user.uid,
        (data: DocumentSnapshot) => {
          setLocalData(userConverter.fromFirestore(data));
        }
      );
      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  function setUserData(value: UserData) {
    fb.updateDocument(Collections.USERS, user!.uid, value);
  }

  return [localData, setUserData];
}
