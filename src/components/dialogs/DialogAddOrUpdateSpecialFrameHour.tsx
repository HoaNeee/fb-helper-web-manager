import {
  DEFAULT_LIST_DAY_OF_WEEK,
  type SpecialFrameHour,
} from "@/services/special-frame-hour-service";
import Button from "../Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useEffect, useRef, useState } from "react";
import DialogChooseDayOfWeek from "./DialogChooseDayOfWeek";
import { getDayOfWeekText } from "@/utils/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onSave: (data: Partial<SpecialFrameHour>) => void;
  mode?: "add" | "edit";
  specialFrameHour?: SpecialFrameHour | undefined;
};

export default function DialogAddOrUpdateSpecialFrameHour({
  open,
  onOpenChange,
  onClose,
  onSave,
  mode,
  specialFrameHour,
}: Props) {
  const [openDialogChooseDay, setOpenDialogChooseDay] = useState(false);
  const [listDayOfWeek, setListDayOfWeek] = useState<number[]>([]);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (mode === "add") {
      setListDayOfWeek([...DEFAULT_LIST_DAY_OF_WEEK]);
    }
  }, [mode]);

  function handleSaveSpecialFrameHour() {
    if (!formRef.current) {
      return;
    }
    const form = formRef.current;

    const formData = new FormData(form);

    const data = {
      start_time: Number(formData.get(`start_time`)),
      end_time: Number(formData.get(`end_time`)),
      max_group: Number(formData.get(`max_group`)),
    };

    const payload = {
      ...specialFrameHour,
      ...data,
    };

    if (mode === "add") {
      payload.apply_dates = listDayOfWeek;
    }

    onSave(payload);
  }

  if (mode === "edit" && !specialFrameHour) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add or update</DialogTitle>
          </DialogHeader>
          <div className="">
            <form ref={formRef} className="flex flex-col gap-4 py-4 px-6">
              <Field>
                <FieldLabel htmlFor={`${mode}-start-time`}>
                  Start time
                </FieldLabel>
                <Input
                  type="number"
                  id={`${mode}-start-time`}
                  defaultValue={
                    mode === "edit" ? specialFrameHour?.start_time : undefined
                  }
                  placeholder="Ex: 1,2,3..."
                  name="start_time"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={`${mode}-end-time`}>End time</FieldLabel>
                <Input
                  type="number"
                  id={`${mode}-end-time`}
                  placeholder="Ex: 2,3,4..."
                  defaultValue={
                    mode === "edit" ? specialFrameHour?.end_time : undefined
                  }
                  name="end_time"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={`${mode}-max-group`}>Max group</FieldLabel>
                <Input
                  type="number"
                  id={`${mode}-max-group`}
                  placeholder="Ex: 10,20,30..."
                  defaultValue={
                    mode === "edit" ? specialFrameHour?.max_group : undefined
                  }
                  name="max_group"
                />
              </Field>

              {mode === "add" ? (
                <div className="flex flex-col gap-2">
                  <p>Day of week</p>
                  <div className="border min-h-14 rounded-md bg-muted/20 p-2 text-xs">
                    {listDayOfWeek.length === 0
                      ? "No day of week selected"
                      : listDayOfWeek
                          .map((day) => getDayOfWeekText({ day }))
                          .join(", ")}
                  </div>
                  <div>
                    <Button
                      size="sm"
                      text="Change day of week"
                      className="rounded-sm"
                      onClick={() => setOpenDialogChooseDay(true)}
                    />
                  </div>
                </div>
              ) : null}
            </form>
          </div>
          <DialogFooter>
            <Button text="Cancel" variant="secondary" onClick={onClose} />
            <Button
              text="Save"
              variant="primary"
              onClick={handleSaveSpecialFrameHour}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DialogChooseDayOfWeek
        open={openDialogChooseDay}
        onOpenChange={setOpenDialogChooseDay}
        onClose={() => setOpenDialogChooseDay(false)}
        onSave={(days) => {
          setListDayOfWeek(days);
          setOpenDialogChooseDay(false);
        }}
        initDayOfWeeks={listDayOfWeek}
      />
    </>
  );
}
