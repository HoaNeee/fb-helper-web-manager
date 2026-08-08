import {
  getSchedulerTypeText,
  SCHEDULER_TYPE_LIST,
} from "@/services/scheduler-service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";
import { type SchedulerType } from "@/services/scheduler-service";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import Button from "./Button";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { X } from "lucide-react";

export default function SchedulerTab() {
  const [openDialogViewScheduler, setOpenDialogViewScheduler] = useState(false);
  const [schedulerType, setSchedulerType] =
    useState<SchedulerType>("DAILY_HOURS");

  function renderSchedulerDetail() {
    if (schedulerType !== "DAILY_HOURS" && schedulerType !== "FRAME_HOURS") {
      return (
        <div className="mt-4 ml-6">
          <Field>
            <FieldLabel className="font-normal" htmlFor="time-value">
              Enter time value for{" "}
              {getSchedulerTypeText(schedulerType).toLowerCase()}
            </FieldLabel>
            <Input placeholder="Ex: 1,2,3" id="time-value" />
          </Field>
          <div className="flex justify-end mt-3">
            <Button text="Save" className="rounded-sm" />
          </div>
        </div>
      );
    }
    if (schedulerType === "DAILY_HOURS") {
      return (
        <div className="mt-4 ml-6 flex justify-end">
          <Button text="Reset Daily Hours" />
        </div>
      );
    }
  }

  return (
    <>
      <div className="w-full h-full p-4 flex flex-col gap-3">
        <h2 className="font-medium text-lg">Scheduler for device</h2>
        <div>
          <Button
            text="View Scheduler list"
            size="md"
            onClick={() => setOpenDialogViewScheduler(true)}
          />
        </div>
        <div className="w-[320px]">
          <Label className="font-normal my-2">Select scheduler type</Label>
          <Select
            value={schedulerType}
            onValueChange={(value) => {
              setSchedulerType(value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select scheduler type">
                {getSchedulerTypeText(schedulerType)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {SCHEDULER_TYPE_LIST.map((item) => {
                return (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {renderSchedulerDetail()}
        </div>
      </div>
      <Dialog
        open={openDialogViewScheduler}
        onOpenChange={setOpenDialogViewScheduler}
      >
        <DialogContent className={"h-100"}>
          <DialogHeader>
            <DialogTitle>Scheduler time list</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 items-center flex-1 overflow-y-auto">
            {Array.from({ length: 40 }).map((_, idx) => {
              return (
                <div key={idx} className="flex gap-2 items-center">
                  <p className="font-medium">{idx}:00</p>
                  <button className="cursor-pointer hover:text-red-600 transition-colors flex justify-center items-center">
                    <X size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
