import { DateTime } from "luxon";
import { useState } from "react";
import { Card } from "~/components/ui/card";
import { CardContent } from "~/components/ui/card";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
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

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [newKyu, setNewKyu] = useState("");
  const [newDate, setNewDate] = useState(DateTime.now().toISODate());

  // Handle modal form submit

  const handleAddBelt = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding new belt", newKyu, newDate);
    if (!newKyu || !newDate) return;
    const newEntry = {
      kyu: +newKyu,
      date: DateTime.fromISO(newDate),
    };
    userData.beltHistory?.push(newEntry);
    console.log("new history", userData.beltHistory);
    setUserdata({
      ...userData,
    });
    setOpenModal(false);
    setNewKyu("");
    setNewDate(DateTime.now().toISODate());
  };

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
            <Button
              color="inherit"
              variant="text"
              size="small"
              disabled={!editMode}
              onClick={() => setOpenModal(true)}
            >
              <PlusCircle />
            </Button>
          </div>
        </div>
      </div>
      {/* Modal for adding new Kyu level */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            minWidth: 300,
          }}
        >
          <form onSubmit={handleAddBelt} className="flex flex-col gap-4">
            <FormControl fullWidth>
              <InputLabel id="kyu-select-label">Kyu Level</InputLabel>
              <Select
                labelId="kyu-select-label"
                value={newKyu}
                label="Kyu Level"
                onChange={(e) => setNewKyu(e.target.value)}
                required
              >
                {[6, 5, 4, 3, 2, 1].map((level) => (
                  <MenuItem key={level} value={level}>
                    {level} kyu
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Date"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
            <Button type="submit" variant="contained" color="primary">
              Add Belt
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
