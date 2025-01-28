import { DateTime, Interval } from "luxon";
import { useEffect, useMemo, useState } from "react";
import useFirebaseData, { Collections } from "~/services/firebase-data-service";
import { Technique } from "./techniques";
import { Button, Card, CardContent, Grid2, Paper } from "@mui/material";
import { CardTitle } from "~/components";
import { styled } from "@mui/material/styles";
import { ConfirmationDialogRaw } from "~/modules/new-training";
import { useFirestore } from "~/services/firebase-hooks";
import { DocumentSnapshot } from "firebase/firestore";
import { QuerySnapshot } from "firebase-admin/firestore";
import { useAuth } from "~/services/auth-provider";

export interface TrainingData {
  id?: string;
  date: DateTime;
  duration?: number; //duration in minutes
  notes?: string;
  techniques: string[];
  // Add other fields as needed
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

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
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(DateTime.now());
  const [selectedEvent, setSelectedEvent] = useState<TrainingData | null>(null);
  const [error, setError] = useState<Error>();

  const fb = useFirestore();

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

  // const { data, isLoading, error } = useFirebaseData<TrainingData>(
  //   "trainings",
  //   mapFromFirebase,
  //   () => {
  //     console.log("data changed");
  //   }
  // );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogDate, setDialogDate] = useState<DateTime>(DateTime.now());

  function handleClose(date?: DateTime) {
    console.log("handleClose", date);
    setDialogOpen(false);
    setSelectedDate(date ?? DateTime.now());
  }

  function renderDialog(day: DateTime) {
    setDialogDate(day);
    setDialogOpen(true);
  }

  function handleOpen() {
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

  if (error) {
    return <p>Error fetching training data: {error.message}</p>;
  }

  return (
    <div className="p-4">
      <ConfirmationDialogRaw
        open={dialogOpen}
        date={dialogDate}
        // techniques={techniques}
        onClose={handleClose}
      />
      <div className="flex items-center justify-between mb-6">
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

      <div className="grid grid-cols-7 gap-4">
        {daysInWeek.map((day) => (
          <Card
            key={day.toISO()}
            className="border rounded p-2 min-h-[200px]"
            variant="outlined"
          >
            <CardTitle className="font-bold mb-2 text-md">
              <div className="flex justify-between">
                {day.toFormat("cccc")}
                {user ? (
                  <Button
                    onClick={() => renderDialog(day)}
                    disabled={user ? false : true}
                  >
                    Add
                  </Button>
                ) : null}
              </div>
              <div className="text-sm text-gray-500">
                {day.toFormat("MMM d")}
              </div>
            </CardTitle>
            <CardContent>
              <Grid2 container spacing={1} columns={2}>
                {trainings
                  .filter((t) => {
                    return t.date.isValid && t.date.hasSame(day, "day");
                  })
                  .map((t) => (
                    <Grid2>
                      <Item>
                        <Button
                          key={t.id}
                          className="bg-gray-100 rounded"
                          onClick={() => setSelectedEvent(t)}
                        >
                          {t.date.toFormat("HH:mm")}
                        </Button>
                      </Item>
                    </Grid2>
                  ))}
              </Grid2>
            </CardContent>
          </Card>
        ))}
      </div>
      <div>
        <div className="p-10" />
        <div className="grid grid-cols-3 gap-4">
          {selectedEvent && (
            <div className="border p-4 rounded-md">
              <h3 className="font-bold">
                {selectedEvent.date.toFormat("yyyy-MM-dd HH:mm")}
              </h3>
              <p>
                {techniques
                  .filter((t) => selectedEvent.techniques.includes(t.id))
                  .map((t) => t.name)
                  .join(", ")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
