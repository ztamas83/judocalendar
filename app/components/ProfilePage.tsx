import { useState } from "react";
import { Card } from "~/components/ui/card";
import { CardContent } from "~/components/ui/card";
import {
  Box,
  Button,
  FormControl,
  Icon,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { useUserData } from "~/services/user-data-hook";
import { KyuLevel } from "~/models/technique";
import SportsMartialArtsIcon from "@mui/icons-material/SportsMartialArts";
import { PlusCircle } from "lucide-react";

export function ProfilePage() {
  const [isLoggedin, userData, setUserdata, authenticatedUser] = useUserData();
  const [editMode, setEditMode] = useState(false);
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <Card>
        <CardContent className="grid grid-cols-[auto_100px] max-h-100% p-6">
          <div className="flex items-center">
            <img
              src={authenticatedUser.photoURL ?? ""}
              alt={authenticatedUser.uid}
              className="w-24 h-24 rounded-full m-4"
            />
            <div className="text-3xl font-bold">
              {authenticatedUser.displayName}
            </div>
          </div>
          <div>
            <Button
              size="small"
              variant="contained"
              disableElevation
              disableFocusRipple
              color="inherit"
              onClick={() => setEditMode(!editMode)}
              startIcon={
                editMode ? (
                  <span className="top-2 right-2 material-symbols-outlined font-black">
                    edit_off
                  </span>
                ) : (
                  <span className="top-2 right-2 material-symbols-outlined">
                    edit
                  </span>
                )
              }
            >
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* here goes the belt history and other profile details */}
      <div className="grid grid-cols-4">
        <div id="col1 flex flex-rows col-start-1 col-end-2 items-center">
          <Timeline>
            {userData.beltHistory?.map((entry, idx) => (
              <TimelineItem key={idx}>
                <TimelineSeparator>
                  <TimelineDot
                    sx={{
                      backgroundColor: KyuLevel[entry.kyu],
                    }}
                  >
                    <SportsMartialArtsIcon className="text-gray-500" />
                  </TimelineDot>
                </TimelineSeparator>
                <TimelineContent>
                  <div className="flex flex-col">
                    <span className="font-semibold">{entry.kyu} kyu</span>
                    <span className="text-sm text-gray-500">
                      {entry.date.toISODate()}
                    </span>
                  </div>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
          <div className="flex col-start-1">
            <Button color="inherit" variant="text" size="small">
              <PlusCircle />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
