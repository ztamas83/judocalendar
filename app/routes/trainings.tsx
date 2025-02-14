import { DateTime, Interval } from "luxon";
import { useEffect, useMemo, useState } from "react";
import useFirebaseData, { Collections } from "~/services/firebase-data-service";
import { Technique } from "./techniques";
import { Card, CardContent, Stack } from "@mui/material";
import { CardTitle } from "~/components";
import { useFirestore } from "~/services/firebase-hooks";
import { QuerySnapshot } from "firebase-admin/firestore";
import { Checkbox } from "~/components/ui/checkbox";
import { useUserData } from "~/services/user-data-hook";
import { Button } from "~/components/ui/button";
import NewTrainingDialog from "~/components/new-training2";
import { toast } from "sonner";

import {
  collection,
  getDoc,
  Timestamp,
  doc,
  writeBatch,
} from "firebase/firestore";
import { db } from "~/firebase.client"; // Assuming you have your Firebase initialization in a separate fil

async function addNormalizedParticipation(userId: string, trainingId: string) {
  // Add normalized participation data to user data

  const trainingData = await getDoc(doc(db, "trainings", trainingId));

  if (trainingData.exists()) {
    const data = trainingData.data();
    if (data) {
      console.log("techniques", data.techniques);
      const batch = writeBatch(db);

      for (const technique of data.techniques) {
        batch.set(
          doc(collection(db, "userProgress", userId, "techniquesProgress")),
          {
            techniqueId: technique,
            trainingId,
            date: Timestamp.now(),
          }
        );
      }

      await batch.commit();
    }
  } else {
    console.log("No such training document!");
  }
}

export interface TrainingData {
  id?: string;
  date: DateTime;
  group?: string;
  duration?: number; //duration in minutes
  notes?: string;
  techniques: string[];
  // Add other fields as needed
}

function mapFromFirebase(doc: any): TrainingData {
  const data = doc.data();
  return {
    id: doc.id,
    date: DateTime.fromJSDate(data.date.toDate()),
    duration: data.duration,
    notes: data.notes,
    techniques: data.techniques,
    // Map other fields as needed
  };
}

export default function Trainings() {
  const [selectedDate, setSelectedDate] = useState(DateTime.now());
  const [selectedEvent, setSelectedEvent] = useState<TrainingData | null>(null);
  const [error, setError] = useState<Error>();

  const fb = useFirestore();
  const [isLoggedIn, userData, setUserdata] = useUserData();
  const isAdminUser = useMemo(() => userData.role == "admin", [userData]);

  const [trainings, setTrainings] = useState<TrainingData[]>([]);

  useEffect(() => {
    const unsubscribe = fb.getCollection(
      Collections.TRAININGS,
      (data: QuerySnapshot) => {
        setTrainings(data.docs.map((doc) => mapFromFirebase(doc)));
      },
      setError
    );
    return () => {
      unsubscribe();
    };
  }, []);

  const [dialogOpen, setDialogOpen] = useState(false);
  // const [dialogDate, setDialogDate] = useState<DateTime>(DateTime.now());

  function handleClose(date: DateTime, techniques: string[]) {
    console.log("handleClose", date, techniques);
    fb.addDocument(
      Collections.TRAININGS,
      {
        date,
        duration: 0,
        notes: "",
        techniques,
      } as TrainingData,
      setError
    );
  }

  useEffect(() => {
    if (error) {
      toast(error.message);
    }
  }, [error]);

  function handleAddTrainingClick(day: DateTime) {
    setDialogOpen(true);
  }

  const {
    data: techniques,
    isLoading: techniquesLoading,
    error: techniquesError,
  } = useFirebaseData<Technique>("techniques");

  const weekStart = selectedDate.startOf("week");
  const weekEnd = selectedDate.endOf("week");

  const daysInWeek = Interval.fromDateTimes(weekStart, weekEnd)
    .splitBy({ days: 1 })
    .map((d) => d.start!);

  const navigateWeek = (direction: "prev" | "next") => {
    setSelectedDate(
      direction === "next"
        ? selectedDate.plus({ weeks: 1 })
        : selectedDate.minus({ weeks: 1 })
    );
  };

  const showEvents = (day: DateTime) => {
    const events = trainings.filter((t) => t.date.hasSame(day, "day"));
    //console.log(events);
  };

  const handleParticipation = (checked: boolean, trainingId: string) => {
    console.log(trainingId, checked);
    if (checked) {
      addNormalizedParticipation(userData.id, trainingId)
        .then(() => {
          toast.success("Participation added");
        })
        .catch((error) => {
          toast.error(error.message);
        });

      setUserdata({
        participations: userData.participations.add(trainingId),
      });
    } else {
      userData.participations.delete(trainingId);

      setUserdata({
        participations: userData.participations,
      });
    }
  };

  if (techniquesLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching training data: {error.message}</p>;
  }

  return (
    // top row with selector is 36px, rest is 100%
    <div className="p-3 overflow-x-auto max-w-[2000px] grid grid-rows-[36px,100fr] grid-cols-1">
      {/* <ConfirmationDialogRaw
        date={dialogDate}
        open={dialogOpen}
        date={dialogDate}
        // techniques={techniques}
        onClose={handleClose}
      /> */}
      <div className="flex items-bottom justify-center mb-6 min-w-full h-9 gap-20">
        <Button
          onClick={() => navigateWeek("prev")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Previous Week
        </Button>

        <h2 className="text-xl font-bold">
          {weekStart.toFormat("MMM d")} - {weekEnd.toFormat("MMM d, yyyy")}
        </h2>

        <Button
          onClick={() => navigateWeek("next")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next Week
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {daysInWeek.map((day) => (
          <Card
            key={day.toISO()}
            className="border rounded p-1.5 min-h-[200px] max-x-auto min-w-[200px]"
            variant="outlined"
            onClick={() => showEvents(day)}
          >
            <CardTitle className="font-bold mb-2 text-md">
              <div className="flex justify-between">
                {day.toFormat("cccc")}
                {isAdminUser ? (
                  // <Button onClick={() => handleAddTrainingClick(day)}>
                  //   Add
                  // </Button>
                  <NewTrainingDialog
                    date={day}
                    handleSave={handleClose}
                  ></NewTrainingDialog>
                ) : null}
              </div>
              <div
                className="text-sm text-gray-500"
                onClick={() => showEvents(day)}
              >
                {day.toFormat("MMM d")}
              </div>
            </CardTitle>
            <CardContent>
              <div className="grid grid-cols-1">
                {trainings
                  .filter((t) => {
                    return t.date.isValid && t.date.hasSame(day, "day");
                  })
                  .map((t) => (
                    <div className="grid">
                      <Card variant="outlined" className="p-1 min-w-auto">
                        <CardContent>
                          <div className="grid grid-cols-1 grid-rows-[auto, 24px] gap-2">
                            <Stack className="grid-row">
                              <div className="font-bold">
                                {t.group ?? "Training"}
                              </div>
                              <div className="text-gray-500 grid grid-cols-1 text-xs text-left">
                                {techniques
                                  .filter((tech) =>
                                    t.techniques.includes(tech.id)
                                  )
                                  .map((t) => {
                                    return <div>- {t.name}</div>;
                                  })}
                              </div>
                            </Stack>
                            <div className="text-left mt-auto">
                              {isLoggedIn ? (
                                <>
                                  <label
                                    htmlFor={t.id}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    I was there
                                  </label>
                                  <Checkbox
                                    id={t.id}
                                    onCheckedChange={(state) =>
                                      handleParticipation(
                                        state.valueOf() ? true : false,
                                        t.id
                                      )
                                    }
                                    checked={
                                      userData.participations?.has(t.id) ??
                                      false
                                    }
                                  ></Checkbox>
                                </>
                              ) : null}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div> // end of 2 rows grid
  );
}
