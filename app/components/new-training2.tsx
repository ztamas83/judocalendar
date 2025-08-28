import { DateTime } from "luxon";
import * as React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import useFirebaseData from "~/services/firebase-data-service";
import { Technique } from "~/models/technique";
import MultipleSelector, { Option } from "./ui/multipleSelector";
import { useEffect } from "react";
import { toast } from "sonner";

interface NewTrainingDialogProps {
  date: DateTime;
  handleSave: (date: DateTime, techniques: string[]) => void;
}
function NewTrainingDialog({ date, handleSave }: NewTrainingDialogProps) {
  const { data: techniques } = useFirebaseData<Technique>("techniques");

  const [open, setOpen] = React.useState(false);

  const [techniqueOptions, setTechniqueOptions] = React.useState<Option[]>([]);

  useEffect(() => {
    if (techniques) {
      const options = techniques.map((technique) => {
        return {
          value: technique.id,
          label: technique.name,
          group: technique.category,
        };
      });
      setTechniqueOptions(options);
    }
  }, [techniques]);

  const [selectedTechniques, setSelectedTechniques] = React.useState<Option[]>(
    []
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add new</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <div className="flex justify-between">
              <div>Add new training</div>
              <div className="flex gap-2">{date.toISODate()}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Label htmlFor="techniques" className="text-right">
          Techniques
        </Label>
        <div className="w-full px-10">
          <MultipleSelector
            defaultOptions={techniqueOptions}
            maxSelected={5}
            placeholder="Select techniques..."
            emptyIndicator={
              <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                no results found.
              </p>
            }
            onMaxSelected={(maxLimit) => {
              toast(`You have reached max selected: ${maxLimit}`);
            }}
            onChange={setSelectedTechniques}
            groupBy="group"
          />
        </div>

        {/* <Select<string[]>
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
            </Select> */}
        <DialogClose>
          <Button
            type="submit"
            onClick={() =>
              handleSave(
                date,
                selectedTechniques.map((t) => t.value)
              )
            }
          >
            Save changes
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default NewTrainingDialog;
