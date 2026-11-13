import { useLanguage } from "@/hooks/useLanguage";
import getTextWithLanguage from "@/helpers/language";
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
import toastHepler from "@/helpers/toast-helper";

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
  onActionAll: (item: SpecialFrameHour, isActiveAll: boolean) => void;
};

function SpecialFrameHourItem({
  item,
  onClickEditDates,
  onClickEditSpecialFrameHour,
  mode,
  onCheckedChange,
  checked,
  onDelete,
  onActionAll,
}: PropsItem) {
  useLanguage();
  return (
    <>
      <div className="p-3 border border-gray-300 rounded-md gap-4 flex flex-col w-full relative">
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
              <div className="flex flex-wrap gap-x-4 gap-y-2 items-center text-sm">
                <p>
                  {getTextWithLanguage({
                    en: "Start time:",
                    vi: "Giờ bắt đầu:",
                  })}{" "}
                  {item.start_time}:00
                </p>
                <p>
                  {getTextWithLanguage({
                    en: "End time:",
                    vi: "Giờ kết thúc:",
                  })}{" "}
                  {item.end_time}:00
                </p>
                <p>
                  {getTextWithLanguage({
                    en: "Max group:",
                    vi: "Số nhóm tối đa:",
                  })}{" "}
                  {item.max_group}
                </p>
              </div>
              <p>
                {getTextWithLanguage({
                  en: "Apply dates:",
                  vi: "Ngày áp dụng:",
                })}{" "}
                {item.apply_dates
                  .map((d) => getDayOfWeekText({ day: d }))
                  .join(", ")}
              </p>
            </div>
          </Label>
        </div>
        <div
          className={`flex flex-wrap gap-2 items-center ${mode === "device" && "ml-8"}`}
        >
          <Button
            text={getTextWithLanguage({ en: "Edit", vi: "Chỉnh sửa" })}
            className="rounded-sm"
            onClick={() => onClickEditSpecialFrameHour(item)}
          />
          <Button
            text={getTextWithLanguage({
              en: "Edit Date",
              vi: "Chỉnh sửa ngày",
            })}
            className="rounded-sm"
            onClick={() => onClickEditDates(item)}
          />
          <DialogConfirm
            type="trigger"
            title={getTextWithLanguage({
              en: "Delete special frame hour",
              vi: "Xóa khung giờ đặc biệt",
            })}
            description={getTextWithLanguage({
              en: "Are you sure you want to delete this special frame hour?",
              vi: "Bạn có chắc muốn xóa khung giờ đặc biệt này?",
            })}
            trigger={
              <Button
                text={getTextWithLanguage({
                  en: "Delete",
                  vi: "Xóa",
                })}
                variant="danger"
                className="rounded-sm"
              />
            }
            onConfirm={() => onDelete?.(item.id)}
          />
        </div>
        {mode === "page" && (
          <div className="flex flex-wrap items-center gap-2">
            <DialogConfirm
              type="trigger"
              title={getTextWithLanguage({
                en: "Activate all device",
                vi: "Kích hoạt trên mọi thiết bị",
              })}
              description={getTextWithLanguage({
                en: "Are you sure you want to activate all special frame hour?",
                vi: "Bạn có chắc muốn kích hoạt tất cả khung giờ đặc biệt?",
              })}
              trigger={
                <Button
                  text={getTextWithLanguage({
                    en: "Activate all device",
                    vi: "Kích hoạt trên mọi thiết bị",
                  })}
                  variant="success"
                  outline
                  className="rounded-sm"
                />
              }
              onConfirm={() => onActionAll(item, true)}
            />
            <DialogConfirm
              type="trigger"
              title={getTextWithLanguage({
                en: "Disable all device",
                vi: "Tắt trên mọi thiết bị",
              })}
              description={getTextWithLanguage({
                en: "Are you sure you want to disable all special frame hour?",
                vi: "Bạn có chắc muốn tắt tất cả khung giờ đặc biệt?",
              })}
              trigger={
                <Button
                  text={getTextWithLanguage({
                    en: "Disable all device",
                    vi: "Tắt trên mọi thiết bị",
                  })}
                  variant="danger"
                  outline
                  className="rounded-sm"
                />
              }
              onConfirm={() => onActionAll(item, false)}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default function SpecialFrameHourTabComponent({ mode }: Props) {
  useLanguage();
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
        handleExceptionGlobal(
          error,
          getTextWithLanguage({
            en: "Failed to get list special frame hour",
            vi: "Lỗi khi lấy danh sách khung giờ đặc biệt",
          }),
        );
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
      toastHepler({
        message: getTextWithLanguage({
          en: "Update special frame hour successfully",
          vi: "Cập nhật khung giờ đặc biệt thành công",
        }),
        type: "success",
      });
      handleCloseDialogEdit();
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to update special frame hour",
          vi: "Lỗi khi cập nhật khung giờ đặc biệt",
        }),
      );
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
      toastHepler({
        message: getTextWithLanguage({
          en: "Add new special frame hour successfully",
          vi: "Thêm khung giờ đặc biệt mới thành công",
        }),
        type: "success",
      });
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to add new special frame hour",
          vi: "Lỗi khi thêm khung giờ đặc biệt mới",
        }),
      );
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
      toastHepler({
        message: getTextWithLanguage({
          en: "Update day of week successfully",
          vi: "Cập nhật ngày trong tuần thành công",
        }),
        type: "success",
      });
      handleCloseDialogChooseDay();
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to update day of week",
          vi: "Lỗi khi cập nhật ngày trong tuần",
        }),
      );
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
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to update status",
          vi: "Lỗi khi cập nhật trạng thái",
        }),
      );
    }
  }

  async function handleDeleteSpecialFrameHour(id: number) {
    try {
      setActionLoading(true);
      await specialFrameHourService.deleteSpecialFrameHour(id);
      setSpecialFrameHours((prev) => prev.filter((item) => item.id !== id));
      toastHepler({
        message: getTextWithLanguage({
          en: "Delete special frame hour successfully",
          vi: "Xóa khung giờ đặc biệt thành công",
        }),
        type: "success",
      });
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to delete special frame hour",
          vi: "Lỗi khi xóa khung giờ đặc biệt",
        }),
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleUpdateStatusAllDevice(
    item: SpecialFrameHour,
    isActiveAll: boolean,
  ) {
    try {
      setActionLoading(true);
      await specialFrameHourService.updateCheckedAllDevice(
        item.id,
        isActiveAll,
      );
      toastHepler({
        message: getTextWithLanguage({
          en: "Update status all device successfully",
          vi: "Cập nhật trạng thái tất cả thiết bị thành công",
        }),
        type: "success",
      });
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to update status all device",
          vi: "Lỗi khi cập nhật trạng thái tất cả thiết bị",
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
      <div className="w-full min-h-0 h-full py-3 sm:px-5 flex flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            text={getTextWithLanguage({
              en: "Add frame hour",
              vi: "Thêm khung giờ",
            })}
            className="rounded-sm"
            onClick={() => setOpenDialogAdd(true)}
          />
          <DialogConfirm
            type="trigger"
            title={getTextWithLanguage({
              en: "Delete all special frame hour",
              vi: "Xóa toàn bộ khung giờ đặc biệt",
            })}
            description={getTextWithLanguage({
              en: "Are you sure you want to delete all special frame hour?",
              vi: "Bạn có chắc muốn xóa toàn bộ khung giờ đặc biệt?",
            })}
            trigger={
              <Button
                text={getTextWithLanguage({
                  en: "Clear all",
                  vi: "Xóa tất cả",
                })}
                className="rounded-sm"
                disabled={actionLoading || specialFrameHours.length === 0}
              />
            }
            onConfirm={async () => {
              try {
                setActionLoading(true);
                await specialFrameHourService.clearAllSpecialFrameHour();
                setSpecialFrameHours([]);
                toastHepler({
                  message: getTextWithLanguage({
                    en: "Delete all special frame hour successfully",
                    vi: "Xóa toàn bộ khung giờ đặc biệt thành công",
                  }),
                  type: "success",
                });
              } catch (error) {
                handleExceptionGlobal(
                  error,
                  getTextWithLanguage({
                    en: "Failed to clear all special frame hour",
                    vi: "Lỗi khi xóa toàn bộ khung giờ đặc biệt",
                  }),
                );
              } finally {
                setActionLoading(false);
              }
            }}
          />
        </div>
        <div className="flex flex-col gap-4 mt-4 flex-1 min-h-0 overflow-y-auto">
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
                onActionAll={handleUpdateStatusAllDevice}
              />
            ))
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <span>
                {getTextWithLanguage({ en: "No data", vi: "Không có dữ liệu" })}
              </span>
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
