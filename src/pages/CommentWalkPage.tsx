import { useLanguage } from "@/hooks/useLanguage";
import getTextWithLanguage from "@/helpers/language";
import { Button } from "@/components/Button";
import DialogAddOrUpdateCommentWalk from "@/components/dialogs/DialogAddOrUpdateCommentWalk";
import DialogConfirm from "@/components/dialogs/DialogConfirm";
import Loading from "@/components/Loading";
import {
  handleExportCommentWalk,
  handleImportCommentWalk,
} from "@/helpers/comment-walk";
import { commentWalkService } from "@/services/comment-walk-service";
import type { CommentWalk } from "@/types/types";
import { CustomError, handleExceptionGlobal } from "@/utils/exception";
import { useCallback, useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import toastHepler from "@/helpers/toast-helper";

export default function CommentWalkPage() {
  useLanguage();
  const [listCommentWalk, setListCommentWalk] = useState<
    Partial<CommentWalk>[]
  >([]);
  const [openDialogViewDetail, setOpenDialogViewDetail] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [commentWalkSelected, setCommentWalkSelected] =
    useState<Partial<CommentWalk>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fn() {
      try {
        setLoading(true);
        const res = await commentWalkService.getAllCommentWalkByUser();
        if (res && res.length > 0) {
          setListCommentWalk(res);
        }
      } catch (error) {
        handleExceptionGlobal(
          error,
          getTextWithLanguage({
            en: "Failed to load comment walk",
            vi: "Lỗi tải bình luận dạo",
          }),
        );
      } finally {
        setLoading(false);
      }
    }
    fn();
  }, []);

  const handleOnsubmit = useCallback(
    (mode: "edit" | "add", payload: Partial<CommentWalk>) => {
      if (mode === "add") {
        toastHepler({
          message: getTextWithLanguage({
            en: "Comment walk added successfully",
            vi: "Thêm bình luận dạo thành công",
          }),
          type: "success",
        });
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

      toastHepler({
        message: getTextWithLanguage({
          en: "Comment walk updated successfully",
          vi: "Cập nhật bình luận dạo thành công",
        }),
        type: "success",
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
          en: "Comment walk deleted successfully",
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
          en: "Comment walk cleared successfully",
          vi: "Xóa bình luận dạo thành công",
        }),
        type: "success",
      });
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to clear comment walk",
          vi: "Lỗi xóa bình luận dạo",
        }),
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleImport = async () => {
    try {
      setActionLoading(true);
      await handleImportCommentWalk((data) => {
        if (Array.isArray(data)) {
          if (data && data.length > 0) {
            setListCommentWalk((prev) => [...prev, ...data]);
            toastHepler({
              message: getTextWithLanguage({
                en: "Comment walk imported successfully",
                vi: "Nhập bình luận dạo thành công",
              }),
              type: "success",
            });
          }
        } else if (data.error) {
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

  async function handleUpdateStatusAll(
    comment_walk_id?: string,
    is_active: boolean = false,
  ) {
    if (!comment_walk_id) return;
    try {
      setActionLoading(true);
      await commentWalkService.updateStatusAllDevice(
        comment_walk_id,
        is_active,
      );
      toastHepler({
        message: getTextWithLanguage({
          en: "Comment walk updated successfully",
          vi: "Cập nhật bình luận dạo thành công",
        }),
        type: "success",
      });
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to update comment walk",
          vi: "Lỗi cập nhật bình luận dạo",
        }),
      );
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return <Loading type="dialog" />;
  }

  return (
    <>
      {actionLoading && <Loading type="dialog" />}
      <div className="w-full h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
            <MessageSquare className="text-blue-500" size={24} />
            {getTextWithLanguage({ en: "Comment Walk", vi: "Bình luận dạo" })}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            {getTextWithLanguage({
              en: "Manage comment walk data for your accounts.",
              vi: "Quản lý dữ liệu bình luận dạo cho các tài khoản.",
            })}
          </p>
        </div>
        <div className="flex flex-col py-2 gap-3 overflow-hidden flex-1">
          <div className="mb-3 flex items-center gap-3 flex-wrap">
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
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto flex-1 pr-2">
            {listCommentWalk.length ? (
              listCommentWalk.map((cm) => {
                return (
                  <div
                    key={cm.id}
                    className="flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 border-l-4 border-l-(--bg-btn-primary) rounded-lg hover:shadow-sm hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200 pb-4 flex-wrap"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-zinc-100 truncate">
                        {cm.name ||
                          getTextWithLanguage({
                            en: "Unknown Name",
                            vi: "Không có tên",
                          })}
                      </p>
                      {cm.title_query_searchs && (
                        <p className="text-xs text-slate-400 dark:text-zinc-500 truncate mt-0.5">
                          {getTextWithLanguage({
                            en: "Query:",
                            vi: "Từ khóa:",
                          })}
                          {cm.title_query_searchs.join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        variant="primary"
                        size="xs"
                        onClick={() => {
                          setOpenDialogViewDetail(true);
                          setCommentWalkSelected(cm);
                        }}
                        text={getTextWithLanguage({ en: "View", vi: "Xem" })}
                      />

                      <DialogConfirm
                        type="trigger"
                        trigger={
                          <Button
                            text={getTextWithLanguage({
                              en: "Enable all",
                              vi: "Bật tất cả",
                            })}
                            size="xs"
                            variant="success"
                            outline
                          />
                        }
                        title={getTextWithLanguage({
                          en: "Check all devices",
                          vi: "Bật cho tất cả thiết bị",
                        })}
                        description={getTextWithLanguage({
                          en: "Are you sure you want to check all devices?",
                          vi: "Bạn có chắc muốn bật cho tất cả thiết bị?",
                        })}
                        onConfirm={() => handleUpdateStatusAll(cm?.id, true)}
                      />
                      <DialogConfirm
                        type="trigger"
                        trigger={
                          <Button
                            text={getTextWithLanguage({
                              en: "Disable all",
                              vi: "Tắt tất cả",
                            })}
                            size="xs"
                            variant="secondary"
                            outline
                          />
                        }
                        title={getTextWithLanguage({
                          en: "Uncheck all devices",
                          vi: "Tắt cho tất cả thiết bị",
                        })}
                        description={getTextWithLanguage({
                          en: "Are you sure you want to uncheck all devices?",
                          vi: "Bạn có chắc muốn tắt cho tất cả thiết bị?",
                        })}
                        onConfirm={() => handleUpdateStatusAll(cm?.id, false)}
                      />
                      <DialogConfirm
                        type="trigger"
                        trigger={
                          <Button
                            variant="danger"
                            outline
                            size="xs"
                            text={getTextWithLanguage({
                              en: "Delete",
                              vi: "Xóa",
                            })}
                          />
                        }
                        title={getTextWithLanguage({
                          en: "Delete comment walk",
                          vi: "Xóa dữ liệu bình luận dạo",
                        })}
                        description={getTextWithLanguage({
                          en: "Are you sure you want to delete this comment walk data?",
                          vi: "Bạn có chắc muốn xóa dữ liệu bình luận dạo này?",
                        })}
                        onConfirm={() => handleDelete(cm?.id)}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-full flex items-center justify-center h-full">
                <p>
                  {getTextWithLanguage({
                    en: "No data",
                    vi: "Không có dữ liệu",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <DialogAddOrUpdateCommentWalk
        open={openDialogViewDetail}
        onOpenChange={(open) => {
          if (!open) {
            setCommentWalkSelected(undefined);
          }
          setOpenDialogViewDetail(open);
        }}
        onSave={(payload) => handleOnsubmit("edit", payload)}
        commentWalk={commentWalkSelected}
        dialog_mode="edit"
      />

      <DialogAddOrUpdateCommentWalk
        open={openAdd}
        onOpenChange={setOpenAdd}
        onSave={(payload) => handleOnsubmit("add", payload)}
        dialog_mode="add"
      />
    </>
  );
}
