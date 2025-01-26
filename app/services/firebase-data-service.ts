import { useEffect, useState } from "react";
import { collection, DocumentSnapshot, getDocs } from "firebase/firestore";
import { db } from "~/firebase.client"; // Assuming you have your Firebase initialization in a separate file

function useFirebaseData<T>(
  collectionName: string,
  mapFunction?: (doc: DocumentSnapshot) => T
): {
  data: T[];
  isLoading: boolean;
  error: any;
} {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  function defaultMapFunction(doc: DocumentSnapshot): unknown {
    return {
      id: doc.id,
      ...doc.data(),
    };
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataCollection = collection(db, collectionName);
        const dataSnapshot = await getDocs(dataCollection);
        const dataArray = dataSnapshot.docs.map(
          mapFunction ?? defaultMapFunction
        );
        setData(dataArray);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [collectionName]);

  return { data, isLoading, error };
}

export default useFirebaseData;
