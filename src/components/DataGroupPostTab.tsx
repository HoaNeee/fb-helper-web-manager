import { useLanguage } from "@/hooks/useLanguage";
import getTextWithLanguage from "@/helpers/language";
import {
  dataGroupPostService,
  DEFAULT_LIST_DATA_GROUP_POST,
  type DataGroupPost,
} from "@/services/data-group-post-service";
import { Eye, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./Button";
import DialogAddOrUpdateDataGroupPost from "./dialogs/DialogAddOrUpdateDataGroupPost";
import { Checkbox } from "./ui/checkbox";
import { Field, FieldLabel } from "./ui/field";
import Loading from "./Loading";
import DialogConfirm from "./dialogs/DialogConfirm";
import {
  handleExportDataGroupPost,
  handleImportDataGroupPost,
} from "@/helpers/data-group-post";
import { useParams } from "react-router";
import DialogSyncDevieSetting from "./dialogs/DialogSyncDeviceSetting";
import { CustomError, handleExceptionGlobal } from "@/utils/exception";
import toastHepler from "@/helpers/toast-helper";

export default function DataGroupPostTab() {
  useLanguage();
  const [dataGroupPosts, setDataGroupPosts] = useState<
    Partial<DataGroupPost>[]
  >(DEFAULT_LIST_DATA_GROUP_POST);
  const [openDialogViewDetail, setOpenDialogViewDetail] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [loadingSync, setLoadingSync] = useState(false);
  const [openDialogSync, setOpenDialogSync] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [dataGroupPostSeleted, setDataGroupPostSeleted] =
    useState<Partial<DataGroupPost>>();

  const params = useParams<{ deviceId: string }>();
  const deviceId = params.deviceId;

  useEffect(() => {
    async function fn() {
      try {
        setLoading(true);
        const res = await dataGroupPostService.getAllDataGroupPostByDevice(
          params.deviceId,
        );
        setDataGroupPosts(res);
        setError(null);
      } catch (error) {
        handleExceptionGlobal(
          error,
          getTextWithLanguage({
            en: "Failed to get data group post",
            vi: "Lỗi lấy dữ liệu bài đăng nhóm",
          }),
        );
        setError(error.message || error);
      } finally {
        setLoading(false);
      }
    }
    fn();
  }, [params.deviceId]);

  const handleOnsubmit = useCallback(
    (mode: "edit" | "add", payload: Partial<DataGroupPost>) => {
      if (mode === "add") {
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
          en: "Delete data group post successfully",
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
          en: "Clear all data group post successfully",
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
              en: "Import data group post successfully",
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
      setActionLoading(false);
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to import data group post",
          vi: "Lỗi nhập dữ liệu bài đăng nhóm",
        }),
      );
    }
  };

  const handleCheckedChange = async (
    data_group_post_id: string,
    checked: boolean,
  ) => {
    try {
      const sucess = await dataGroupPostService.updateChecked(
        data_group_post_id,
        deviceId,
        checked,
      );
      if (sucess) {
        //do some thing or no
      }
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to update data group post",
          vi: "Lỗi cập nhật dữ liệu bài đăng nhóm",
        }),
      );
    }
  };

  async function handleSyncDevice(target_device_id: string) {
    try {
      setLoading(true);
      const res = await dataGroupPostService.syncDeviceDataGroupPost(
        deviceId,
        target_device_id,
      );
      console.log(res);
      setOpenDialogSync(false);
      toastHepler({
        message: getTextWithLanguage({
          en: "Sync data group post successfully, please reload page",
          vi: "Đồng bộ dữ liệu bài đăng nhóm thành công, vui lòng tải lại trang để xem danh sách đã đồng bộ",
        }),
        type: "success",
      });
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to sync data group post",
          vi: "Lỗi đồng bộ dữ liệu bài đăng nhóm",
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
      <div className="flex flex-col py-4 px-6 gap-3 overflow-hidden h-full">
        {actionLoading && <Loading type="dialog" />}
        <div className="mb-4">
          <h2 className="text-xl font-bold">
            {getTextWithLanguage({
              en: "Data Group Post",
              vi: "Dữ liệu bài đăng nhóm",
            })}
          </h2>
        </div>
        <div className="mb-3 flex items-center gap-3">
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
          <Button
            size="md"
            onClick={() => {
              setOpenDialogSync(true);
            }}
          >
            {getTextWithLanguage({
              en: "Sync Data Group Post",
              vi: "Đồng bộ dữ liệu bài đăng nhóm",
            })}
          </Button>
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto h-full">
          {dataGroupPosts.length ? (
            dataGroupPosts.map((dgp) => {
              return (
                <div key={dgp.id} className="flex items-center gap-2">
                  <Field orientation="horizontal" className="w-auto">
                    <Checkbox
                      className={"size-4.5"}
                      defaultChecked={dgp.is_active}
                      onCheckedChange={(e) => {
                        handleCheckedChange(dgp.id, e);
                      }}
                    />
                    <FieldLabel className="text-base font-medium">
                      {dgp.name || dgp.title}
                    </FieldLabel>
                  </Field>
                  <div className="flex gap-1 items-center">
                    <Button
                      variant="outline"
                      size="xs"
                      className="rounded-md"
                      onClick={() => {
                        setOpenDialogViewDetail(true);
                        setDataGroupPostSeleted(dgp);
                      }}
                    >
                      <Eye size={16} />
                    </Button>
                    <DialogConfirm
                      type="trigger"
                      trigger={
                        <Button
                          variant="outline"
                          size="xs"
                          className="rounded-md hover:text-destructive"
                        >
                          <Trash2 size={16} />
                        </Button>
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
            <div className="flex justify-center h-full">
              {getTextWithLanguage({
                en: "No data",
                vi: "Không có dữ liệu",
              })}
            </div>
          )}
        </div>
      </div>

      {dataGroupPostSeleted && (
        <DialogAddOrUpdateDataGroupPost
          open={openDialogViewDetail}
          onOpenChange={(o) => {
            if (!o) {
              setDataGroupPostSeleted(undefined);
            }
            setOpenDialogViewDetail(o);
          }}
          onSave={(payload) => handleOnsubmit("edit", payload)}
          dataGroupPost={dataGroupPostSeleted}
          dialog_mode="edit"
        />
      )}

      <DialogAddOrUpdateDataGroupPost
        open={openAdd}
        onOpenChange={setOpenAdd}
        onSave={(payload) => handleOnsubmit("add", payload)}
        dialog_mode="add"
      />
      <DialogSyncDevieSetting
        open={openDialogSync}
        onOpenChange={setOpenDialogSync}
        onSyncDevice={handleSyncDevice}
      />
    </>
  );
}
