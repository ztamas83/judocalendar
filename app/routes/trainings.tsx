import { DateTime, Interval } from "luxon";
import { useState } from "react";
import useFirebaseData from "~/services/techniques-service";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

interface TrainingData {
  id: string;
  date: DateTime;
  duration: number; //duration in minutes
  notes: string;
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
  const { data, isLoading, error } = useFirebaseData<TrainingData>(
    "trainings",
    mapFromFirebase
  );

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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching training data: {error.message}</p>;
  }

  console.log(data);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateWeek("prev")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Previous Week
        </button>

        <h2 className="text-xl font-bold">
          {weekStart.toFormat("MMM d")} - {weekEnd.toFormat("MMM d, yyyy")}
        </h2>

        <button
          onClick={() => navigateWeek("next")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next Week
        </button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {daysInWeek.map((day) => (
          <div key={day.toISO()} className="border rounded p-4 min-h-[200px]">
            <div className="font-bold mb-2">
              {day.toFormat("cccc")}
              <div className="text-sm text-gray-500">
                {day.toFormat("MMM d")}
              </div>
            </div>

            <div className="space-y-2">
              {data
                .filter((t) => {
                  console.log(t.date.isValid, t.date.hasSame(day, "day"));
                  return t.date.isValid && t.date.hasSame(day, "day");
                })
                .map((t) => (
                  <div key={t.id} className="bg-gray-100 p-2 rounded">
                    <Card></Card>
                    {t.date.toFormat("HH:mm")} -
                    {t.date.plus({ minutes: t.duration }).toFormat("HH:mm")}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Add Training</h2>
        <div className="grid grid-cols-3 gap-4">
          {selectedEvent && (
            <div className="border p-4 rounded-lg">
              <h3 className="font-bold">
                {selectedEvent.date.toFormat("HH:mm")}
              </h3>
              <p>{selectedEvent.techniques.join(", ")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
