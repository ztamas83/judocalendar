import { useEffect, useState } from "react";
import { collection, DocumentSnapshot, getDocs } from "firebase/firestore";
import { db } from "~/firebase.client"; // Assuming you have your Firebase initialization in a separate file

export interface TechniqueCategories {
  categories: string[];
  subCategories: { [key: string]: string[] };
}

export async function getUniqueCategories(): Promise<
  TechniqueCategories | undefined
> {
  try {
    const querySnapshot = await getDocs(collection(db, "techniques"));
    const categories = new Set<string>();
    const subCategories: { [key: string]: Set<string> } = {};

    querySnapshot.forEach((doc) => {
      const category = doc.data().category;
      categories.add(category);
      if (!subCategories[category]) {
        subCategories[category] = new Set<string>();
      }
      subCategories[category].add(doc.data().sub_category);
    });

    console.log("Categories:", categories);
    console.log("Sub-categories:", subCategories);

    return {
      categories: Array.from(categories),
      subCategories: Object.keys(subCategories).reduce((dict, key) => {
        dict[key] = Array.from(subCategories[key]);
        return dict;
      }, {} as { [key: string]: string[] }),
    };
  } catch (error) {
    console.error("Error getting documents: ", error);
    return undefined;
  }
}

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

    fetchData()
      .then()
      .catch((err) => {
        setError(err);
      });
  }, [collectionName]);

  return { data, isLoading, error };
}

export default useFirebaseData;
