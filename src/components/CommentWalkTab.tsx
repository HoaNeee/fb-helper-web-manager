import { useLanguage } from "@/hooks/useLanguage";
import getTextWithLanguage from "@/helpers/language";
import {
  commentWalkService,
  DEFAULT_LIST_COMMENT_WALK,
} from "@/services/comment-walk-service";
import type { CommentWalk } from "@/types/types";
import { Eye, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./Button";
import DialogAddOrUpdateCommentWalk from "./dialogs/DialogAddOrUpdateCommentWalk";
import { Checkbox } from "./ui/checkbox";
import { FieldLabel } from "./ui/field";
import Loading from "./Loading";
import DialogConfirm from "./dialogs/DialogConfirm";
import {
  handleExportCommentWalk,
  handleImportCommentWalk,
} from "@/helpers/comment-walk";
import { useParams } from "react-router";
import DialogSyncDeviceSetting from "./dialogs/DialogSyncDeviceSetting";
import { CustomError, handleExceptionGlobal } from "@/utils/exception";
import toastHepler from "@/helpers/toast-helper";

export default function CommentWalkTab() {
  useLanguage();
  const [listCommentWalk, setListCommentWalk] = useState<
    Partial<CommentWalk>[]
  >([]);
  const [openDialogViewDetail, setOpenDialogViewDetail] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [openDialogSync, setOpenDialogSync] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [commentWalkSelected, setCommentWalkSelected] =
    useState<Partial<CommentWalk>>();

  const params = useParams<{ deviceId: string }>();
  const deviceId = params.deviceId;

  useEffect(() => {
    async function fn() {
      if (!deviceId) return;
      try {
        setLoading(true);
        const res =
          await commentWalkService.getAllCommentWalkByDevice(deviceId);
        if (res && res.length > 0) {
          setListCommentWalk(res);
        }
      } catch (error) {
        handleExceptionGlobal(
          error,
          getTextWithLanguage({
            en: "Failed to get comment walk",
            vi: "Lỗi lấy bình luận dạo",
          }),
        );
        setError(error.message || error);
      } finally {
        setLoading(false);
      }
    }
    fn();
  }, [deviceId]);

  const handleOnsubmit = useCallback(
    (mode: "edit" | "add", payload: Partial<CommentWalk>) => {
      if (mode === "add") {
        setListCommentWalk((prev) => [...prev, payload]);
        setOpenAdd(false);
        return;
      }

      const id = payload?.id;

      const newList = listCommentWalk.map((cw) => {
        if (cw.id === id) {
          return payload;
        }
        return cw;
      });

      setListCommentWalk(newList);
      setOpenDialogViewDetail(false);
    },
    [listCommentWalk],
  );

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      setActionLoading(true);
      await commentWalkService.deleteCommentWalk(id);
      setListCommentWalk((prev) => prev.filter((cw) => cw.id !== id));
      toastHepler({
        message: getTextWithLanguage({
          en: "Delete comment walk successfully",
          vi: "Xóa bình luận dạo thành công",
        }),
        type: "success",
      });
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to delete comment walk",
          vi: "Lỗi xóa bình luận dạo",
        }),
      );
      setListCommentWalk((prev) => prev.filter((cw) => cw.id !== id));
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearAll = async () => {
    try {
      setActionLoading(true);
      await commentWalkService.clearAllCommentWalk();
      setListCommentWalk([]);
      toastHepler({
        message: getTextWithLanguage({
          en: "Clear all comment walk successfully",
          vi: "Xóa toàn bộ bình luận dạo thành công",
        }),
        type: "success",
      });
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to clear all comment walk",
          vi: "Lỗi xóa toàn bộ bình luận dạo",
        }),
      );
      setListCommentWalk([]);
    } finally {
      setActionLoading(false);
    }
  };

  const handleImport = async () => {
    try {
      setActionLoading(true);
      await handleImportCommentWalk((data) => {
        if (Array.isArray(data)) {
          if (data.length > 0) {
            setListCommentWalk((prev) => [...prev, ...data]);
            toastHepler({
              message: getTextWithLanguage({
                en: "Import comment walk successfully",
                vi: "Nhập bình luận dạo thành công",
              }),
              type: "success",
            });
          }
        } else {
          handleExceptionGlobal(
            data.error as CustomError,
            getTextWithLanguage({
              en: "Failed to import comment walk",
              vi: "Lỗi nhập bình luận dạo",
            }),
          );
        }
        setActionLoading(false);
      });
    } catch (error) {
      setActionLoading(false);
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to import comment walk",
          vi: "Lỗi nhập bình luận dạo",
        }),
      );
    }
  };

  const handleCheckedChange = async (
    comment_walk_id?: string,
    checked: boolean = false,
  ) => {
    if (!comment_walk_id || !deviceId) return;
    try {
      await commentWalkService.updateChecked(
        comment_walk_id,
        deviceId,
        checked,
      );
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to update checked comment walk",
          vi: "Lỗi cập nhật bình luận dạo",
        }),
      );
    }
  };

  async function handleSyncDevice(target_device_id: string) {
    if (!deviceId) return;
    try {
      setLoading(true);
      const res = await commentWalkService.syncDeviceCommentWalk(
        deviceId,
        target_device_id,
      );
      console.log(res);
      toastHepler({
        message: getTextWithLanguage({
          en: "Sync comment walk successfully, please reload page to apply",
          vi: "Đồng bộ bình luận dạo thành công, hãy tải lại trang để có thể áp dụng",
        }),
        type: "success",
      });
      setOpenDialogSync(false);
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to sync comment walk",
          vi: "Lỗi đồng bộ bình luận dạo",
        }),
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading type="page" />;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <>
      <div className="flex flex-col py-2 sm:py-4 sm:px-6 gap-3 overflow-hidden min-h-0 h-full">
        {actionLoading && <Loading type="dialog" />}
        <div className="mb-4">
          <h2 className="text-xl font-bold">
            {getTextWithLanguage({
              en: "Comment Walk",
              vi: "Bình luận dạo",
            })}
          </h2>
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <Button
            size="md"
            type="submit"
            onClick={() => {
              setOpenAdd(true);
            }}
          >
            {getTextWithLanguage({
              en: "Add Comment Walk",
              vi: "Thêm dữ liệu bình luận dạo",
            })}
          </Button>
          <Button size="md" onClick={handleImport}>
            {getTextWithLanguage({ en: "Import Data", vi: "Nhập dữ liệu" })}
          </Button>
          <Button
            size="md"
            onClick={() =>
              handleExportCommentWalk(listCommentWalk as CommentWalk[])
            }
            disabled={!listCommentWalk.length}
          >
            {getTextWithLanguage({ en: "Export Data", vi: "Xuất dữ liệu" })}
          </Button>
          <DialogConfirm
            trigger={
              <Button size="md" disabled={!listCommentWalk.length}>
                {getTextWithLanguage({
                  en: "Clear All Data",
                  vi: "Xóa toàn bộ dữ liệu",
                })}
              </Button>
            }
            type="trigger"
            onConfirm={handleClearAll}
            title={getTextWithLanguage({
              en: "Clear All Data",
              vi: "Xóa toàn bộ dữ liệu",
            })}
            description={getTextWithLanguage({
              en: "Are you sure you want to clear all data?",
              vi: "Bạn có chắc muốn xóa toàn bộ dữ liệu?",
            })}
          />
          <Button size="md" onClick={() => setOpenDialogSync(true)}>
            {getTextWithLanguage({
              en: "Sync Comment Walk",
              vi: "Đồng bộ dữ liệu bình luận dạo",
            })}
          </Button>
        </div>
        <div className="flex flex-col gap-2 overflow-y-auto min-h-0 flex-1">
          {listCommentWalk.length ? (
            listCommentWalk.map((cw) => {
              return (
                <div
                  key={cw.id}
                  className="flex flex-wrap items-center gap-3 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg hover:shadow-sm transition-all duration-200"
                >
                  <Checkbox
                    className="size-4 shrink-0"
                    defaultChecked={cw.is_active}
                    onCheckedChange={(e) =>
                      handleCheckedChange(cw.id, Boolean(e))
                    }
                    id={cw.id}
                  />
                  <FieldLabel
                    htmlFor={cw.id}
                    className="text-sm font-medium flex-1 truncate cursor-pointer"
                  >
                    {cw.name ||
                      getTextWithLanguage({
                        en: "Unknown Name",
                        vi: "Không có tên",
                      })}
                  </FieldLabel>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        setOpenDialogViewDetail(true);
                        setCommentWalkSelected(cw);
                      }}
                    >
                      <Eye size={14} />
                    </Button>
                    <DialogConfirm
                      type="trigger"
                      trigger={
                        <Button
                          variant="outline"
                          size="xs"
                          className="hover:text-red-500 hover:border-red-300"
                        >
                          <Trash2 size={14} />
                        </Button>
                      }
                      title={getTextWithLanguage({
                        en: "Delete comment walk",
                        vi: "Xóa dữ liệu bình luận dạo",
                      })}
                      description={getTextWithLanguage({
                        en: "Are you sure you want to delete this comment walk data?",
                        vi: "Bạn có chắc muốn xóa dữ liệu bình luận dạo này?",
                      })}
                      onConfirm={() => handleDelete(cw?.id)}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex justify-center items-center h-32 text-sm text-slate-400">
              {getTextWithLanguage({ en: "No data", vi: "Không có dữ liệu" })}
            </div>
          )}
        </div>
      </div>

      {commentWalkSelected && (
        <DialogAddOrUpdateCommentWalk
          open={openDialogViewDetail}
          onOpenChange={(o) => {
            if (!o) {
              setCommentWalkSelected(undefined);
            }
            setOpenDialogViewDetail(o);
          }}
          onSave={(payload) => handleOnsubmit("edit", payload)}
          commentWalk={commentWalkSelected}
          dialog_mode="edit"
        />
      )}

      <DialogAddOrUpdateCommentWalk
        open={openAdd}
        onOpenChange={setOpenAdd}
        onSave={(payload) => handleOnsubmit("add", payload)}
        dialog_mode="add"
      />
      <DialogSyncDeviceSetting
        open={openDialogSync}
        onOpenChange={setOpenDialogSync}
        onSyncDevice={handleSyncDevice}
      />
    </>
  );
}
