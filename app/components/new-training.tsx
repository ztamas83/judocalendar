import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { DateTime } from "luxon";
import * as React from "react";
import { Component } from "react";

interface NewTrainingDialogProps {
  onClose: (date?: DateTime) => void;
  
}

interface NewTrainingDialogState {}

class NewTrainingDialog extends React.Component<
  NewTrainingDialogProps,
  NewTrainingDialogState
> {
  state = {
    date: DateTime.now(),
    open: false,
  };

  render() {
    const { date, open } = this.state;

    return (
      <Dialog open={open}>
        <DialogTitle id="new-training-dialog-title">
          Add new training
        </DialogTitle>
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
}

export default NewTrainingDialog;
