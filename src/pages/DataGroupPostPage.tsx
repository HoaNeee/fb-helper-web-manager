import { useLanguage } from "@/hooks/useLanguage";
import getTextWithLanguage from "@/helpers/language";
import { Button } from "@/components/Button";
import DialogAddOrUpdateDataGroupPost from "@/components/dialogs/DialogAddOrUpdateDataGroupPost";
import DialogConfirm from "@/components/dialogs/DialogConfirm";
import Loading from "@/components/Loading";
import {
  handleExportDataGroupPost,
  handleImportDataGroupPost,
} from "@/helpers/data-group-post";
import {
  dataGroupPostService,
  DEFAULT_LIST_DATA_GROUP_POST,
  type DataGroupPost,
} from "@/services/data-group-post-service";
import { CustomError, handleExceptionGlobal } from "@/utils/exception";
import { useCallback, useEffect, useState } from "react";
import { Users } from "lucide-react";
import toastHepler from "@/helpers/toast-helper";

export default function DataGroupPostPage() {
  useLanguage();
  const [dataGroupPosts, setDataGroupPosts] = useState<
    Partial<DataGroupPost>[]
  >(DEFAULT_LIST_DATA_GROUP_POST);
  const [openDialogViewDetail, setOpenDialogViewDetail] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [dataGroupPostSeleted, setDataGroupPostSeleted] =
    useState<Partial<DataGroupPost>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fn() {
      try {
        setLoading(true);
        const res = await dataGroupPostService.getAllDataGroupPostByUser();
        setDataGroupPosts(res);
      } catch (error) {
        handleExceptionGlobal(
          error,
          getTextWithLanguage({
            en: "Failed to load data",
            vi: "Lỗi tải dữ liệu",
          }),
        );
      } finally {
        setLoading(false);
      }
    }
    fn();
  }, []);

  const handleOnsubmit = useCallback(
    (mode: "edit" | "add", payload: Partial<DataGroupPost>) => {
      if (mode === "add") {
        toastHepler({
          message: getTextWithLanguage({
            en: "Add Data Group Post successfully",
            vi: "Thêm dữ liệu bài đăng nhóm thành công",
          }),
          type: "success",
        });
        setDataGroupPosts((prev) => [...prev, payload]);
        setOpenAdd(false);
        return;
      }

      const id = payload?.id;

      const newList = dataGroupPosts.map((dgp) => {
        if (dgp.id === id) {
          return payload;
        }
        return dgp;
      });

      setDataGroupPosts(newList);

      toastHepler({
        message: getTextWithLanguage({
          en: "Update Data Group Post successfully",
          vi: "Cập nhật dữ liệu bài đăng nhóm thành công",
        }),
        type: "success",
      });
      setOpenDialogViewDetail(false);
    },
    [dataGroupPosts],
  );

  const handleDelete = async (id: string) => {
    try {
      setActionLoading(true);
      await dataGroupPostService.deleteDataGroupPost(id);
      setDataGroupPosts((prev) => prev.filter((dgp) => dgp.id !== id));
      toastHepler({
        message: getTextWithLanguage({
          en: "Delete Data Group Post successfully",
          vi: "Xóa dữ liệu bài đăng nhóm thành công",
        }),
        type: "success",
      });
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to delete data group post",
          vi: "Lỗi xóa dữ liệu bài đăng nhóm",
        }),
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearAll = async () => {
    try {
      setActionLoading(true);
      await dataGroupPostService.clearAllDataGroupPost();
      setDataGroupPosts([]);
      toastHepler({
        message: getTextWithLanguage({
          en: "Clear All Data Group Post successfully",
          vi: "Xóa toàn bộ dữ liệu bài đăng nhóm thành công",
        }),
        type: "success",
      });
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to clear all data group post",
          vi: "Lỗi xóa toàn bộ dữ liệu bài đăng nhóm",
        }),
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleImport = async () => {
    try {
      setActionLoading(true);
      await handleImportDataGroupPost((data) => {
        if (Array.isArray(data)) {
          setDataGroupPosts((prev) => [...prev, ...data]);
          toastHepler({
            message: getTextWithLanguage({
              en: "Import Data Group Post successfully",
              vi: "Nhập dữ liệu bài đăng nhóm thành công",
            }),
            type: "success",
          });
        } else {
          handleExceptionGlobal(
            data.error as CustomError,
            getTextWithLanguage({
              en: "Failed to import data group post",
              vi: "Lỗi nhập dữ liệu bài đăng nhóm",
            }),
          );
        }
        setActionLoading(false);
      });
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to import data group post",
          vi: "Lỗi nhập dữ liệu bài đăng nhóm",
        }),
      );
      setActionLoading(false);
    }
  };

  async function handleUpdateStatusAll(
    data_group_post_id: string,
    is_active: boolean,
  ) {
    try {
      setActionLoading(true);
      await dataGroupPostService.updateStatusAllDevice(
        data_group_post_id,
        is_active,
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
          vi: "Lỗi cập nhật trạng thái tất cả thiết bị",
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
      <div className="overflow-hidden flex flex-col w-full h-full">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
            <Users className="text-blue-500" size={24} />
            {getTextWithLanguage({
              en: "Data Group Post",
              vi: "Dữ liệu bài đăng nhóm",
            })}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            {getTextWithLanguage({
              en: "Manage group post data for your devices.",
              vi: "Quản lý dữ liệu nhóm nhập đăng cho các thiết bị.",
            })}
          </p>
        </div>
        <div className="flex flex-col py-2 gap-3 overflow-hidden min-h-0 flex-1">
          <div className="mb-3 flex items-center gap-3 flex-wrap">
            <Button
              size="md"
              type="submit"
              onClick={() => {
                setOpenAdd(true);
              }}
            >
              {getTextWithLanguage({
                en: "Add Data Group Post",
                vi: "Thêm dữ liệu bài đăng nhóm",
              })}
            </Button>
            <Button size="md" onClick={handleImport}>
              {getTextWithLanguage({ en: "Import Data", vi: "Nhập dữ liệu" })}
            </Button>
            <Button
              size="md"
              onClick={() =>
                handleExportDataGroupPost(dataGroupPosts as DataGroupPost[])
              }
              disabled={!dataGroupPosts.length}
            >
              {getTextWithLanguage({ en: "Export Data", vi: "Xuất dữ liệu" })}
            </Button>
            <DialogConfirm
              trigger={
                <Button size="md" disabled={!dataGroupPosts.length}>
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
          <div className="flex flex-col gap-4 overflow-y-auto min-h-0 flex-1 pr-2">
            {dataGroupPosts.length ? (
              dataGroupPosts.map((dgp) => {
                return (
                  <div
                    key={dgp.id}
                    className="flex flex-col items-stretch sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 border-l-4 border-l-(--bg-btn-primary) rounded-lg hover:shadow-sm hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200"
                  >
                    <p className="text-sm font-medium text-slate-800 dark:text-zinc-100 truncate flex-1">
                      {dgp.name ||
                        dgp.title ||
                        getTextWithLanguage({
                          en: "Unknown Name",
                          vi: "Không có tên",
                        })}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                      <Button
                        variant="primary"
                        size="xs"
                        onClick={() => {
                          setOpenDialogViewDetail(true);
                          setDataGroupPostSeleted(dgp);
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
                        onConfirm={() => handleUpdateStatusAll(dgp?.id, true)}
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
                        onConfirm={() => handleUpdateStatusAll(dgp?.id, false)}
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
                          en: "Delete data group post",
                          vi: "Xóa dữ liệu bài đăng nhóm",
                        })}
                        description={getTextWithLanguage({
                          en: "Are you sure you want to delete this data group post?",
                          vi: "Bạn có chắc muốn xóa dữ liệu bài đăng nhóm này?",
                        })}
                        onConfirm={() => handleDelete(dgp?.id)}
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

      <DialogAddOrUpdateDataGroupPost
        open={openDialogViewDetail}
        onOpenChange={(open) => {
          if (!open) {
            setDataGroupPostSeleted(undefined);
          }
          setOpenDialogViewDetail(open);
        }}
        onSave={(payload) => handleOnsubmit("edit", payload)}
        dataGroupPost={dataGroupPostSeleted}
        dialog_mode="edit"
      />

      <DialogAddOrUpdateDataGroupPost
        open={openAdd}
        onOpenChange={setOpenAdd}
        onSave={(payload) => handleOnsubmit("add", payload)}
        dialog_mode="add"
      />
    </>
  );
}
