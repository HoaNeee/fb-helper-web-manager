import { useLanguage } from "@/hooks/useLanguage";
import getTextWithLanguage from "@/helpers/language";
import {
  DEFAULT_LIST_DAY_OF_WEEK,
  type SpecialFrameHour,
} from "@/services/special-frame-hour-service";
import { Button } from "../Button";
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
import { handleExceptionGlobal } from "@/utils/exception";

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
  useLanguage();
  const [openDialogChooseDay, setOpenDialogChooseDay] = useState(false);
  const [listDayOfWeek, setListDayOfWeek] = useState<number[]>([
    ...DEFAULT_LIST_DAY_OF_WEEK,
  ]);

  const formRef = useRef<HTMLFormElement>(null);

  // useEffect(() => {
  //   if (mode === "add") {
  //     setListDayOfWeek([...DEFAULT_LIST_DAY_OF_WEEK]);
  //   }
  // }, [mode]);

  async function handleSaveSpecialFrameHour() {
    if (!formRef.current) {
      return;
    }
    try {
      const form = formRef.current;

      const formData = new FormData(form);

      const data = {
        start_time: Number(formData.get(`start_time`)),
        end_time: Number(formData.get(`end_time`)),
        max_group: Number(formData.get(`max_group`)),
      };

      let payload = {
        ...data,
      } as Partial<SpecialFrameHour>;

      if (specialFrameHour) {
        payload = {
          ...specialFrameHour,
          ...data,
        };
      }

      if (mode === "add") {
        payload.apply_dates = listDayOfWeek;

        onSave(payload);
        setListDayOfWeek([...DEFAULT_LIST_DAY_OF_WEEK]);
      } else {
        onSave(payload);
      }
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Unable to save data. Please try again!",
          vi: "Không thể lưu dữ liệu. Vui lòng thử lại!",
        }),
      );
    }
  }

  if (mode === "edit" && !specialFrameHour) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {getTextWithLanguage({
                en: "Add or update",
                vi: "Thêm hoặc cập nhật",
              })}
            </DialogTitle>
          </DialogHeader>
          <div className="">
            <form ref={formRef} className="flex flex-col gap-4 py-4 px-6">
              <Field>
                <FieldLabel htmlFor={`${mode}-start-time`}>
                  {getTextWithLanguage({ en: "Start time", vi: "Giờ bắt đầu" })}
                </FieldLabel>
                <Input
                  type="number"
                  id={`${mode}-start-time`}
                  defaultValue={
                    mode === "edit" ? specialFrameHour?.start_time : undefined
                  }
                  placeholder={getTextWithLanguage({
                    en: "Ex: 1,2,3...",
                    vi: "VD: 1,2,3...",
                  })}
                  name="start_time"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={`${mode}-end-time`}>
                  {getTextWithLanguage({
                    en: "End time",
                    vi: "Giờ kết thúc",
                  })}
                </FieldLabel>
                <Input
                  type="number"
                  id={`${mode}-end-time`}
                  placeholder={getTextWithLanguage({
                    en: "Ex: 2,3,4...",
                    vi: "VD: 2,3,4...",
                  })}
                  defaultValue={
                    mode === "edit" ? specialFrameHour?.end_time : undefined
                  }
                  name="end_time"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={`${mode}-max-group`}>
                  {getTextWithLanguage({
                    en: "Max group",
                    vi: "Số nhóm tối đa",
                  })}
                </FieldLabel>
                <Input
                  type="number"
                  id={`${mode}-max-group`}
                  placeholder={getTextWithLanguage({
                    en: "Ex: 10,20,30...",
                    vi: "VD: 10,20,30...",
                  })}
                  defaultValue={
                    mode === "edit" ? specialFrameHour?.max_group : undefined
                  }
                  name="max_group"
                />
              </Field>

              {mode === "add" ? (
                <div className="flex flex-col gap-2">
                  <p>
                    {getTextWithLanguage({
                      en: "Day of week",
                      vi: "Ngày trong tuần",
                    })}
                  </p>
                  <div className="border min-h-14 border-gray-300 rounded-md bg-muted/20 p-2 text-xs">
                    {listDayOfWeek.length === 0
                      ? getTextWithLanguage({
                          en: "No day of week selected",
                          vi: "Chưa chọn ngày trong tuần",
                        })
                      : listDayOfWeek
                          .map((day) => getDayOfWeekText({ day }))
                          .join(", ")}
                  </div>
                  <div>
                    <Button
                      size="sm"
                      text={getTextWithLanguage({
                        en: "Change day of week",
                        vi: "Đổi ngày trong tuần",
                      })}
                      className="rounded-sm"
                      onClick={() => setOpenDialogChooseDay(true)}
                    />
                  </div>
                </div>
              ) : null}
            </form>
          </div>
          <DialogFooter>
            <Button
              text={getTextWithLanguage({
                en: "Cancel",
                vi: "Hủy",
              })}
              variant="secondary"
              onClick={onClose}
            />
            <Button
              text={getTextWithLanguage({ en: "Save", vi: "Lưu" })}
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
