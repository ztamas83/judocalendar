import { useAuth } from "~/services/auth-provider";
import { db } from "~/firebase.client";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DateTime } from "luxon";

export function ProgressData() {
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [progressData, setProgressData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProgressData() {
      setIsLoading(true);
      try {
        if (user) {
          const progressDocs = collection(
            db,
            "userProgress",
            user.uid,
            "techniquesProgress"
          );

          const progressData = await getDocs(progressDocs);
          const progressDataArray = progressData.docs
            .map((doc) => {
              return {
                id: doc.data().techniqueId,
                date: DateTime.fromMillis(
                  doc.data().date.seconds * 1000
                ).toISO(),
              };
            })
            .sort();

          setProgressData(progressDataArray);
        }
      } catch (error) {
        toast.error(`Error fetching progress data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProgressData();
  }, [user]);

  return (
    <div>
      <h1>Progress Data</h1>
      {isLoading && <p>Loading...</p>}
      <ul>
        {progressData.map((technique) => (
          <li key={technique.id}>
            {technique.id} @ {technique.date}
          </li>
        ))}
      </ul>
    </div>
  );
}
