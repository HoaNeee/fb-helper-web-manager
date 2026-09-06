import {
  DEFAULT_LIST_DAY_OF_WEEK,
  type SpecialFrameHour,
} from "@/services/special-frame-hour-service";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import { FieldLabel } from "../ui/field";
import { getDayOfWeekText } from "@/utils/utils";
import { Button } from "../Button";
import getTextWithLanguage from "@/helpers/language";
import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onSave: (dayOfWeek: number[]) => void;
  initDayOfWeeks?: number[];
};

export default function DialogChooseDayOfWeek({
  open,
  onOpenChange,
  onClose,
  onSave,
  initDayOfWeeks,
}: Props) {
  const listDayRef = useRef<number[]>([]);

  useEffect(() => {
    // if mode edit
    if (initDayOfWeeks) {
      listDayRef.current = [...initDayOfWeeks];
      return;
    }
  }, [initDayOfWeeks]);

  function handleCheckedChange(checked: boolean, day: number) {
    let set = new Set<number>(listDayRef.current);
    if (checked) {
      set.add(day);
    } else {
      set.delete(day);
    }

    const nextData = Array.from(set);
    nextData.sort();
    listDayRef.current = nextData;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose day of week</DialogTitle>
        </DialogHeader>
        <div className="p-2 flex flex-col gap-2">
          {DEFAULT_LIST_DAY_OF_WEEK.map((day) => (
            <div key={day} className="flex items-center gap-2">
              {initDayOfWeeks ? (
                <input
                  type="checkbox"
                  id={`special-frame-hour-day-${day}`}
                  className={"size-4.5"}
                  defaultChecked={initDayOfWeeks.includes(day)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    handleCheckedChange(checked, day);
                  }}
                />
              ) : (
                <Checkbox
                  id={`special-frame-hour-day-${day}`}
                  className={"size-4.5"}
                  defaultChecked={true}
                  onCheckedChange={(checked) => {
                    handleCheckedChange(checked, day);
                  }}
                />
              )}
              <FieldLabel
                htmlFor={`special-frame-hour-day-${day}`}
                className="flex flex-col items-start"
              >
                {getDayOfWeekText({ day })}
              </FieldLabel>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            text={getTextWithLanguage({
              vi: "Hủy",
              en: "Cancel",
            })}
            variant="secondary"
            onClick={onClose}
            className="rounded-sm"
          />
          <Button
            text={getTextWithLanguage({
              vi: "Lưu",
              en: "Save",
            })}
            onClick={() => onSave(listDayRef.current)}
            className="rounded-sm"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
