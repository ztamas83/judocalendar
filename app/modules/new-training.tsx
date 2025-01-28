import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Select,
  DialogActions,
  MenuItem,
  Grid2,
  Stack,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DateTime } from "luxon";
import { Technique } from "~/routes/techniques";
import { useState } from "react";
import useFirebaseData, {
  addNewTraining,
} from "~/services/firebase-data-service";

export interface NewTrainingDialogProps {
  date: DateTime;
  open: boolean;
  onClose: (date?: DateTime) => void;
}

export function ConfirmationDialogRaw(props: NewTrainingDialogProps) {
  const { date, open, onClose, ...other } = props;
  console.log(date.toISODate());
  const {
    data: techniques,
    isLoading,
    error,
  } = useFirebaseData<Technique>("techniques");

  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);

  const handleChangeMultiple = (event: any) => {
    const { options } = event.target;
    const value: string[] = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setSelectedTechniques(value);
  };

  async function handleSave() {
    // TODO: Implement the logic to store the new training

    await addNewTraining({
      date,
      techniques: selectedTechniques,
    });
    onClose(date);
  }

  const handleDiscard = () => {
    onClose(date);
  };

  return (
    <Dialog open={open}>
      <DialogTitle id="new-training-dialog-title">Add new training</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField
            disabled={true}
            variant="outlined"
            id="day"
            type="datetime-local"
            placeholder={"yyyy-MM-dd HH:mm"}
            value={date.toFormat("yyyy-MM-dd 19:00")}
            className="p-4"
          />
          <FormControl>
            <InputLabel shrink htmlFor="select-multiple">
              Techniques
            </InputLabel>
            <Select<string[]>
              multiple
              native
              value={selectedTechniques}
              label="Techniques"
              onChange={handleChangeMultiple}
              className="p-4"
              inputProps={{
                id: "select-multiple",
              }}
            >
              {techniques.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDiscard} className="bg-red-300">
          Discard
        </Button>
        <Button autoFocus onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
