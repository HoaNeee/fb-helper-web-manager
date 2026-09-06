import {
  schedulerService,
  type SchedulerDetail,
  type SchedulerTime,
} from "@/services/scheduler-service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useEffect, useRef, useState } from "react";
import { type SchedulerType } from "@/services/scheduler-service";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./Button";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { X } from "lucide-react";
import { useParams } from "react-router";
import {
  createSchedulerDailyHours,
  getScheduerWithType,
  getSchedulerTypeText,
  SCHEDULER_TYPE_LIST,
} from "@/helpers/scheduler";
import { handleExceptionGlobal } from "@/utils/exception";
import Loading from "./Loading";

function DialogSchedulerTimeList({
  list,
  open,
  onOpenChange,
  schedulerType,
  schedulerTimeValue,
  deviceId,
}: {
  list?: SchedulerTime[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedulerType?: SchedulerType;
  schedulerTimeValue?: number;
  deviceId: string;
}) {
  const [listTime, setListTime] = useState<SchedulerTime[]>(list || []);

  useEffect(() => {
    setListTime(list || []);
  }, [list]);

  async function handleDeleteTime(time: SchedulerTime) {
    try {
      const newSchedulerTimeList = listTime.filter(
        (t) => t.h !== time.h || t.m !== time.m,
      );

      const payload = {
        scheduler_type: schedulerType,
        scheduler_time_list: newSchedulerTimeList,
      } as SchedulerDetail;

      if (schedulerType !== "DAILY_HOURS") {
        payload.scheduler_time_value = schedulerTimeValue || 1;
      }

      await schedulerService.updateSchedulerDetail(deviceId, payload);
      setListTime(newSchedulerTimeList);
    } catch (error) {
      handleExceptionGlobal(error);
    }
  }

  const textEmpty =
    schedulerType === "EVERY_MINUTES" || schedulerType === "EVERY_HOURS"
      ? "This scheduler not have list time"
      : "No scheduler time list";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={"h-100"}>
        <div className="flex flex-col gap-2 h-full pt-2 overflow-hidden">
          <h3 className="text-lg font-medium text-center">
            Scheduler time list
          </h3>
          <div className="flex flex-col gap-2 flex-1 overflow-y-auto items-center">
            {listTime.length > 0 ? (
              listTime.map((item, idx) => {
                return (
                  <div key={idx} className="flex gap-2 items-center">
                    <p className="font-medium">
                      {String(item.h).padStart(2, "0")}:
                      {String(item.m).padStart(2, "0")}
                    </p>
                    <button className="cursor-pointer hover:text-red-600 transition-colors flex justify-center items-center">
                      <X size={16} onClick={() => handleDeleteTime(item)} />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col gap-2 items-center py-4 justify-center">
                <p className="font-medium text-gray-400">{textEmpty}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function SchedulerTab() {
  const [openDialogViewScheduler, setOpenDialogViewScheduler] = useState(false);
  const [schedulerType, setSchedulerType] =
    useState<SchedulerType>("DAILY_HOURS");
  const [schedulerDetail, setSchedulerDetail] =
    useState<Partial<SchedulerDetail>>();
  const [inputValue, setInputValue] = useState<number>(0);
  const [schedulerTimeList, setSchedulerTimeList] = useState<SchedulerTime[]>(
    [],
  );

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const params = useParams<{ deviceId: string }>();
  const deviceId = params.deviceId;

  useEffect(() => {
    if (!deviceId) return;

    async function fn() {
      try {
        setLoading(true);
        const res = await schedulerService.getSchedulerByDevice(deviceId);
        setSchedulerType(res.scheduler_type);
        let details = (await schedulerService.getSchedulerDetail(
          res.scheduler_type,
          deviceId,
        )) as Partial<SchedulerDetail>;
        if (!details) {
          if (res.scheduler_type === "DAILY_HOURS") {
            details = {
              scheduler_time_list: createSchedulerDailyHours(),
            };
          }
        }
        setSchedulerDetail(details);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fn();
  }, []);

  useEffect(() => {
    if (schedulerDetail) {
      if (schedulerDetail.scheduler_time_value) {
        setInputValue(schedulerDetail.scheduler_time_value);
      }
      if (schedulerDetail.scheduler_time_list) {
        setSchedulerTimeList(schedulerDetail.scheduler_time_list);
      } else {
        if (schedulerType === "DAILY_HOURS") {
          setSchedulerTimeList(createSchedulerDailyHours());
        }
      }
    }
  }, [schedulerDetail]);

  function renderSchedulerDetail() {
    if (schedulerType !== "DAILY_HOURS" && schedulerType !== "FRAME_HOURS") {
      return (
        <div className="mt-4 ml-6">
          <Field>
            <FieldLabel className="font-normal" htmlFor="time-value">
              Enter time value for{" "}
              {getSchedulerTypeText(schedulerType).toLowerCase()}
            </FieldLabel>
            <Input
              placeholder="Ex: 1,2,3"
              id="time-value"
              value={inputValue}
              onChange={(e) => setInputValue(Number(e.target.value))}
              type="number"
            />
          </Field>
          <div className="flex justify-end mt-3">
            <Button
              text="Save"
              className="rounded-sm"
              onClick={saveSchedulerDetail}
            />
          </div>
        </div>
      );
    }
    if (schedulerType === "DAILY_HOURS") {
      return (
        <div className="mt-4 ml-6 flex justify-end">
          <Button text="Reset Daily Hours" onClick={resetDailyHour} />
        </div>
      );
    }
  }

  async function handleChangeType(type: string) {
    try {
      if (type === schedulerType) return;
      const details = await schedulerService.updateTypeScheduler(
        deviceId,
        type as SchedulerType,
      );
      setSchedulerType(type as SchedulerType);
      if (details) {
        setSchedulerDetail(details);
      }
    } catch (error) {
      handleExceptionGlobal(error);
    }
  }

  async function saveSchedulerDetail() {
    try {
      setActionLoading(true);
      const newScheduler = getScheduerWithType(schedulerType, inputValue);
      const res = await schedulerService.updateSchedulerDetail(deviceId, {
        scheduler_type: schedulerType,
        scheduler_time_list: newScheduler,
        scheduler_time_value: inputValue,
      });
      if (res) {
        setSchedulerTimeList(newScheduler);
      }
    } catch (error) {
      handleExceptionGlobal(error);
    } finally {
      setActionLoading(false);
    }
  }

  async function resetDailyHour() {
    try {
      setActionLoading(true);
      const newScheduler = createSchedulerDailyHours();
      const res = await schedulerService.updateSchedulerDetail(deviceId, {
        scheduler_type: schedulerType,
        scheduler_time_value: inputValue,
        scheduler_time_list: newScheduler,
      });
      if (res) {
        setSchedulerTimeList(newScheduler);
      }
    } catch (error) {
      handleExceptionGlobal(error);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return <Loading type="page" />;
  }

  return (
    <>
      {actionLoading && <Loading type="dialog" />}
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
          <Select value={schedulerType} onValueChange={handleChangeType}>
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
      <DialogSchedulerTimeList
        list={schedulerTimeList}
        open={openDialogViewScheduler}
        onOpenChange={setOpenDialogViewScheduler}
        schedulerTimeValue={inputValue}
        schedulerType={schedulerType}
        deviceId={deviceId}
      />
    </>
  );
}
