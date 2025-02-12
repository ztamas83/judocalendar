import { Dispatch, useEffect, useMemo, useState } from "react";
import { userConverter, UserData } from "~/models/userData";
import { Collections } from "./firebase-data-service";
import { DocumentSnapshot } from "firebase/firestore";
import { useFirestore } from "./firebase-hooks";
import { useAuth } from "./auth-provider";

export function useUserData(): [
  isLoggedIn: boolean,
  userData: UserData,
  setUserData: Dispatch<Partial<UserData>>
] {
  const authenticatedUser = useAuth();

  const isLoggedIn = useMemo(
    () => authenticatedUser.user != null,
    [authenticatedUser]
  );

  const [localData, setLocalData] = useState<UserData>({});
  const fb = useFirestore();

  // subscribe to user profile changes
  useEffect(() => {
    if (authenticatedUser.user) {
      const unsubscribe = fb.getDocument(
        Collections.USERS,
        authenticatedUser.user?.uid,
        (data: DocumentSnapshot) => {
          console.log(data.data());
          setLocalData(userConverter.fromFirestore(data));
        }
      );
      return () => {
        unsubscribe();
      };
    }
  }, [authenticatedUser]);

  function setUserData(value: Partial<UserData>) {
    if (!isLoggedIn) {
      throw new Error("User is not logged in");
    }
    if (!value) {
      console.warn("No value provided");
      return;
    }
    fb.updateDocument(Collections.USERS, authenticatedUser.user!.uid, value);
  }

  return [isLoggedIn, localData, setUserData];
}
