import { DateTime, Interval } from "luxon";
import { useEffect, useMemo, useState } from "react";
import useFirebaseData, { Collections } from "~/services/firebase-data-service";
import { Technique } from "./techniques";
import {
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Grid2,
  Paper,
  Stack,
} from "@mui/material";
import { CardTitle } from "~/components";
import { styled } from "@mui/material/styles";
import { ConfirmationDialogRaw } from "~/modules/new-training";
import { useFirestore } from "~/services/firebase-hooks";
import { QuerySnapshot } from "firebase-admin/firestore";
import { useAuth } from "~/services/auth-provider";
import { Checkbox } from "~/components/";
import { useUserData } from "~/services/user-data-hook";

export interface TrainingData {
  id?: string;
  date: DateTime;
  group?: string;
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
  const [userData, setUserdata] = useUserData(user);

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

  const showEvents = (day: DateTime) => {
    const events = trainings.filter((t) => t.date.hasSame(day, "day"));
    //console.log(events);
  };

  const handleParticipation = (checked: boolean, trainingId: string) => {
    console.log(trainingId, checked);
    if (checked) {
      setUserdata({
        ...userData,
        participations: userData.participations.add(trainingId),
      });
    } else {
      userData.participations.delete(trainingId);

      setUserdata({
        ...userData,
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
      <ConfirmationDialogRaw
        open={dialogOpen}
        date={dialogDate}
        // techniques={techniques}
        onClose={handleClose}
      />
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
                {user ? (
                  <Button
                    onClick={() => renderDialog(day)}
                    disabled={user ? false : true}
                  >
                    Add
                  </Button>
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
              <Grid2 container spacing={1} columns={2}>
                {trainings
                  .filter((t) => {
                    return t.date.isValid && t.date.hasSame(day, "day");
                  })
                  .map((t) => (
                    <Grid2>
                      <Item>
                        <Card variant="outlined" className="p-1 min-w-auto">
                          <CardContent>
                            <div className="grid grid-cols-1 grid-rows-[auto, 24px] gap-2">
                              <Stack className="grid-row">
                                <div className="font-bold">
                                  {t.group ?? "Training"} -{" "}
                                  {t.date.toFormat("HH:mm")}
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
                                <Checkbox
                                  label="I was there"
                                  id={t.id}
                                  checked={userData.participations.has(t.id)}
                                  onChange={(event) =>
                                    handleParticipation(event, t.id!)
                                  }
                                ></Checkbox>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        {/* <Button
                          key={t.id}
                          className="bg-gray-100 rounded"
                          onClick={() => setSelectedEvent(t)}
                        ></Button> */}
                      </Item>
                    </Grid2>
                  ))}
              </Grid2>
            </CardContent>
          </Card>
        ))}
      </div>
    </div> // end of 2 rows grid
  );
}
