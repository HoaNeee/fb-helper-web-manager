import getTextWithLanguage from "@/helpers/language";
import {
  createSchedulerDailyHours,
  getScheduerWithType,
  getSchedulerTypeText,
  SCHEDULER_TYPE_LIST,
} from "@/helpers/scheduler";
import { useLanguage } from "@/hooks/useLanguage";
import {
  schedulerService,
  type SchedulerDetail,
  type SchedulerTime,
  type SchedulerType,
} from "@/services/scheduler-service";
import { handleExceptionGlobal } from "@/utils/exception";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Button } from "./Button";
import Loading from "./Loading";
import { Dialog, DialogContent } from "./ui/dialog";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import toastHepler from "@/helpers/toast-helper";

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
  useLanguage();
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
      toastHepler({
        message: getTextWithLanguage({
          en: "Delete time successfully",
          vi: "Xóa giờ chạy thành công",
        }),
        type: "success",
      });
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to delete time",
          vi: "Lỗi khi xóa giờ chạy",
        }),
      );
    }
  }

  const textEmpty =
    schedulerType === "EVERY_MINUTES" || schedulerType === "EVERY_HOURS"
      ? getTextWithLanguage({
          en: "This schedule does not use a time list",
          vi: "Loại lịch này không có danh sách giờ chạy",
        })
      : getTextWithLanguage({
          en: "No scheduler time list",
          vi: "Chưa có giờ chạy trong lịch",
        });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={"h-100"}>
        <div className="flex flex-col gap-2 h-full pt-2 overflow-hidden">
          <h3 className="text-lg font-medium text-center">
            {getTextWithLanguage({
              en: "Scheduler time list",
              vi: "Danh sách giờ chạy",
            })}
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
  useLanguage();
  const [openDialogViewScheduler, setOpenDialogViewScheduler] = useState(false);
  const [schedulerType, setSchedulerType] =
    useState<SchedulerType>("DAILY_HOURS");
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
        const type = res.scheduler_type;
        setSchedulerType(type);

        let details = (await schedulerService.getSchedulerDetail(
          type,
          deviceId,
        )) as Partial<SchedulerDetail>;

        if (!details && type === "DAILY_HOURS") {
          details = { scheduler_time_list: createSchedulerDailyHours() };
        }

        // sync derived state ngay sau khi fetch
        if (details?.scheduler_time_value) {
          setInputValue(details.scheduler_time_value);
        }
        if (details?.scheduler_time_list) {
          setSchedulerTimeList(details.scheduler_time_list);
        } else if (type === "DAILY_HOURS") {
          setSchedulerTimeList(createSchedulerDailyHours());
        }
      } catch (error) {
        handleExceptionGlobal(
          error,
          getTextWithLanguage({
            en: "Failed to fetch scheduler",
            vi: "Lỗi khi tải lịch chạy",
          }),
        );
      } finally {
        setLoading(false);
      }
    }
    fn();
  }, [deviceId]);

  function renderSchedulerDetail() {
    if (schedulerType !== "DAILY_HOURS" && schedulerType !== "FRAME_HOURS") {
      return (
        <div className="mt-4 ml-6">
          <Field>
            <FieldLabel className="font-normal" htmlFor="time-value">
              {getTextWithLanguage({
                en: "Enter time value for",
                vi: "Nhập thời gian cho",
              })}{" "}
              {getSchedulerTypeText(schedulerType).toLowerCase()}
            </FieldLabel>
            <Input
              placeholder={getTextWithLanguage({
                en: "Ex: 1,2,3",
                vi: "VD: 1,2,3",
              })}
              id="time-value"
              value={inputValue}
              onChange={(e) => setInputValue(Number(e.target.value))}
              type="number"
            />
          </Field>
          <div className="flex justify-end mt-3">
            <Button
              text={getTextWithLanguage({ en: "Save", vi: "Lưu" })}
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
          <Button
            text={getTextWithLanguage({
              en: "Reset Daily Hours",
              vi: "Đặt lại giờ chạy hằng ngày",
            })}
            onClick={resetDailyHour}
          />
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
        setSchedulerTimeList(details.scheduler_time_list);
        setInputValue(details.scheduler_time_value);
      }
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to change scheduler type",
          vi: "Lỗi khi thay đổi loại lịch chạy",
        }),
      );
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
        toastHepler({
          message: getTextWithLanguage({
            en: "Save scheduler successfully",
            vi: "Lưu lịch chạy thành công",
          }),
          type: "success",
        });
        setSchedulerTimeList(newScheduler);
      }
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to save scheduler",
          vi: "Lỗi khi lưu lịch chạy",
        }),
      );
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
        toastHepler({
          message: getTextWithLanguage({
            en: "Reset scheduler successfully",
            vi: "Reset lịch chạy thành công",
          }),
          type: "success",
        });
        setSchedulerTimeList(newScheduler);
      }
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to reset scheduler",
          vi: "Lỗi khi reset lịch chạy",
        }),
      );
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
      <div className="w-full min-h-full p-0 sm:p-4 flex flex-col gap-3">
        <h2 className="font-medium text-lg">
          {getTextWithLanguage({
            en: "Scheduler for device",
            vi: "Lịch chạy của thiết bị",
          })}
        </h2>
        <div>
          <Button
            text={getTextWithLanguage({
              en: "View Scheduler list",
              vi: "Xem danh sách giờ chạy",
            })}
            size="md"
            onClick={() => setOpenDialogViewScheduler(true)}
          />
        </div>
        <div className="w-full max-w-[320px]">
          <Label className="font-normal my-2">
            {getTextWithLanguage({
              en: "Select scheduler type",
              vi: "Chọn loại lịch chạy",
            })}
          </Label>
          <Select value={schedulerType} onValueChange={handleChangeType}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={getTextWithLanguage({
                  en: "Select scheduler type",
                  vi: "Chọn loại lịch chạy",
                })}
              >
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
