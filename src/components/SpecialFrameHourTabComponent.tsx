import {
  LIST_SPECIAL_FRAME_HOUR_DEFAULT,
  specialFrameHourService,
  type SpecialFrameHour,
} from "@/services/special-frame-hour-service";
import { useEffect, useState } from "react";
import { Button } from "./Button";
import DialogAddOrUpdateSpecialFrameHour from "./dialogs/DialogAddOrUpdateSpecialFrameHour";
import DialogChooseDayOfWeek from "./dialogs/DialogChooseDayOfWeek";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { getDayOfWeekText } from "@/utils/utils";
import { useParams } from "react-router";
import { handleExceptionGlobal } from "@/utils/exception";
import DialogConfirm from "./dialogs/DialogConfirm";
import Loading from "./Loading";

type Props = {
  mode?: "device" | "page";
};

const LIST_DATA = LIST_SPECIAL_FRAME_HOUR_DEFAULT;

type PropsItem = {
  item: SpecialFrameHour;
  onClickEditDates: (item: SpecialFrameHour) => void;
  onClickEditSpecialFrameHour: (item: SpecialFrameHour) => void;
  mode?: "device" | "page";
  onCheckedChange?: (value: boolean) => void;
  checked?: boolean;
  onDelete?: (id: number) => void;
};

function SpecialFrameHourItem({
  item,
  onClickEditDates,
  onClickEditSpecialFrameHour,
  mode,
  onCheckedChange,
  checked,
  onDelete,
}: PropsItem) {
  return (
    <>
      <div className="p-3 border rounded-md gap-4 flex flex-col w-full">
        <div className="flex gap-4 items-center">
          {mode === "device" ? (
            <Checkbox
              checked={checked || false}
              className={"size-5"}
              onCheckedChange={onCheckedChange}
            />
          ) : null}
          <Label className="flex flex-col items-start">
            <div className="flex flex-col gap-1 mb-1 font-normal">
              <div className="flex gap-4 items-center text-sm">
                <p>Start time: {item.start_time}:00</p>
                <p>End time: {item.end_time}:00</p>
                <p>Max group: {item.max_group}</p>
              </div>
              <p>
                Apply dates:{" "}
                {item.apply_dates
                  .map((d) => getDayOfWeekText({ day: d }))
                  .join(", ")}
              </p>
            </div>
          </Label>
        </div>
        <div
          className={`flex gap-2 items-center ${mode === "device" && "ml-8"}`}
        >
          <Button
            text="Edit"
            className="rounded-sm"
            onClick={() => onClickEditSpecialFrameHour(item)}
          />
          <Button
            text="Edit Date"
            className="rounded-sm"
            onClick={() => onClickEditDates(item)}
          />
          <DialogConfirm
            type="trigger"
            title="Delete special frame hour"
            description="Are you sure you want to delete this special frame hour?"
            trigger={
              <Button text="Delete" variant="danger" className="rounded-sm" />
            }
            onConfirm={() => onDelete?.(item.id)}
          />
        </div>
      </div>
    </>
  );
}

export default function SpecialFrameHourTabComponent({ mode }: Props) {
  const [specialFrameHours, setSpecialFrameHours] = useState(LIST_DATA);
  const [openDialogChooseDay, setOpenDialogChooseDay] = useState(false);
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [specialFrameSelected, setSpecialFrameSelected] = useState<
    SpecialFrameHour | undefined
  >(undefined);

  const params = useParams<{ deviceId: string }>();
  const deviceId = params.deviceId;

  useEffect(() => {
    const fn = async () => {
      try {
        setLoading(true);
        if (mode === "device") {
          if (!deviceId) return;
          const list =
            await specialFrameHourService.getListSpecialFrameHourByDevice(
              deviceId,
            );
          setSpecialFrameHours(list);
        } else {
          const list =
            await specialFrameHourService.getListSpecialFrameHourByUser();
          setSpecialFrameHours(list);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fn();
  }, [mode]);

  function handleCloseDialogChooseDay() {
    setOpenDialogChooseDay(false);
    setSpecialFrameSelected(undefined);
  }

  function handleOpenChangeDialogChooseDay(open: boolean) {
    if (!open) {
      handleCloseDialogChooseDay();
    } else {
      setOpenDialogChooseDay(open);
    }
  }

  function handleClickEditDates(item: SpecialFrameHour) {
    setSpecialFrameSelected(item);
    setOpenDialogChooseDay(true);
  }

  function handleClickEditSpecialFrameHour(item: SpecialFrameHour) {
    setSpecialFrameSelected(item);
    setOpenDialogEdit(true);
  }

  function handleCloseDialogEdit() {
    setOpenDialogEdit(false);
    setSpecialFrameSelected(undefined);
  }

  function handleOpenChangeDialogEdit(open: boolean) {
    if (!open) {
      handleCloseDialogEdit();
    } else {
      setOpenDialogEdit(open);
    }
  }

  async function handleSaveSpecialFrameHour(
    newSpecialFrameHour: Partial<SpecialFrameHour>,
  ) {
    if (!specialFrameSelected) {
      return;
    }
    try {
      setActionLoading(true);
      const data = {
        ...specialFrameSelected,
        ...newSpecialFrameHour,
      };

      await specialFrameHourService.updateSpecialFrameHour(
        specialFrameSelected.id,
        data,
      );

      setSpecialFrameHours((prev) =>
        prev.map((item) => (item.id === data.id ? data : item)),
      );
      handleCloseDialogEdit();
    } catch (error) {
      handleExceptionGlobal(error);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleAddNewSpecialFrameHour(payload: SpecialFrameHour) {
    try {
      setActionLoading(true);
      const res = await specialFrameHourService.addNewSpecialFrameHour(
        payload,
        deviceId,
      );
      setSpecialFrameHours((prev) => [...prev, { ...res, is_active: true }]);
      setOpenDialogAdd(false);
    } catch (error) {
      handleExceptionGlobal(error);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleUpdateDayOfWeek(dayOfWeek: number[]) {
    if (!specialFrameSelected) {
      return;
    }

    try {
      setActionLoading(true);
      const data = {
        ...specialFrameSelected,
        apply_dates: dayOfWeek,
      };
      await specialFrameHourService.updateSpecialFrameHour(
        specialFrameSelected.id,
        data,
      );
      setSpecialFrameHours((prev) =>
        prev.map((item) => (item.id === data.id ? data : item)),
      );
      handleCloseDialogChooseDay();
    } catch (error) {
      handleExceptionGlobal(error);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCheckedChange(id: number, checked: boolean) {
    try {
      await specialFrameHourService.updateChecked(id, checked, deviceId);
      setSpecialFrameHours((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_active: checked } : item,
        ),
      );
    } catch (error) {
      handleExceptionGlobal(error);
    }
  }

  async function handleDeleteSpecialFrameHour(id: number) {
    try {
      setActionLoading(true);
      await specialFrameHourService.deleteSpecialFrameHour(id);
      setSpecialFrameHours((prev) => prev.filter((item) => item.id !== id));
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
      <div className="w-full h-full py-3 px-5 flex flex-col">
        <div className="flex items-center gap-2">
          <Button
            text="Add frame hour"
            className="rounded-sm"
            onClick={() => setOpenDialogAdd(true)}
          />
          <DialogConfirm
            type="trigger"
            title="Delete all special frame hour"
            description="Are you sure you want to delete all special frame hour?"
            trigger={
              <Button
                text="Clear all"
                className="rounded-sm"
                disabled={actionLoading || specialFrameHours.length === 0}
              />
            }
            onConfirm={async () => {
              try {
                setActionLoading(true);
                await specialFrameHourService.clearAllSpecialFrameHour();
                setSpecialFrameHours([]);
              } catch (error) {
                handleExceptionGlobal(error);
              } finally {
                setActionLoading(false);
              }
            }}
          />
        </div>
        <div className="flex flex-col gap-4 mt-4 flex-1 overflow-y-scroll">
          {specialFrameHours.length ? (
            specialFrameHours.map((item, idx) => (
              <SpecialFrameHourItem
                key={idx}
                item={item}
                onClickEditDates={handleClickEditDates}
                onClickEditSpecialFrameHour={handleClickEditSpecialFrameHour}
                mode={mode}
                onCheckedChange={(checked) =>
                  handleCheckedChange(item.id, checked)
                }
                checked={item.is_active}
                onDelete={handleDeleteSpecialFrameHour}
              />
            ))
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <span>Không có dữ liệu</span>
            </div>
          )}
        </div>
      </div>
      {specialFrameSelected && (
        <DialogChooseDayOfWeek
          open={openDialogChooseDay}
          onOpenChange={handleOpenChangeDialogChooseDay}
          onClose={handleCloseDialogChooseDay}
          onSave={handleUpdateDayOfWeek}
          initDayOfWeeks={specialFrameSelected?.apply_dates || []}
        />
      )}

      <DialogAddOrUpdateSpecialFrameHour
        open={openDialogEdit}
        onOpenChange={handleOpenChangeDialogEdit}
        onClose={handleCloseDialogEdit}
        onSave={handleSaveSpecialFrameHour}
        specialFrameHour={specialFrameSelected}
        mode="edit"
      />

      <DialogAddOrUpdateSpecialFrameHour
        open={openDialogAdd}
        onOpenChange={setOpenDialogAdd}
        onClose={() => setOpenDialogAdd(false)}
        onSave={handleAddNewSpecialFrameHour}
        mode="add"
      />
    </>
  );
}
