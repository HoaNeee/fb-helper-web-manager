import { useLanguage } from "@/hooks/useLanguage";
import getTextWithLanguage from "@/helpers/language";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { Label } from "../ui/label";
import DialogManagerContentsDataGroupPost from "./DialogManagerContents";
import {
  dataGroupPostService,
  type DataGroupPost,
} from "@/services/data-group-post-service";
import { genID, parseBlobToFile, parseUrlToBlob } from "@/utils/utils";
import Loading from "../Loading";
import fileService from "@/services/file-service";
import { handleExceptionGlobal } from "@/utils/exception";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: Partial<DataGroupPost>) => void;
  dataGroupPost?: Partial<DataGroupPost>;
  dialog_mode: "edit" | "add";
};

const DEFAULT_LIST_CONTENTS = ["<p></p>"];

export default function DialogAddOrUpdateDataGroupPost({
  open,
  onOpenChange,
  onSave,
  dataGroupPost,
  dialog_mode,
}: Props) {
  useLanguage();
  const [openDialogContents, setOpenDialogContents] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [listContent, setListContent] = useState<string[]>(
    dataGroupPost?.contents || [],
  );
  const [listFileUrl, setListFileUrl] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState<number>(0);

  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const changeFileFlagRef = useRef<boolean>(false);

  const handleInitFile = useCallback(async () => {
    try {
      setLoading(true);
      const dataTransfer = new DataTransfer();

      setListFileUrl(dataGroupPost.files);
      for await (const url of dataGroupPost.files) {
        const blob = await parseUrlToBlob(url);
        dataTransfer.items.add(parseBlobToFile(blob));
      }

      if (inputFileRef.current) {
        inputFileRef.current.files = dataTransfer.files;
      }
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to load file",
          vi: "Lỗi khi tải tệp",
        }),
      );
    } finally {
      setLoading(false);
    }
  }, [dataGroupPost?.files]);

  const getMaxPriority = async () => {
    try {
      setLoading(true);
      const res = await dataGroupPostService.getMaxPriority();
      setPriority(res + 1);
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to get max priority",
          vi: "Lỗi khi lấy mức độ ưu tiên cao nhất",
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const handleOpenChange = async (o: boolean) => {
      if (ignore) return;
      ignore = true;
      if (!o) {
        setListContent([]);
        setListFileUrl([]);
        setPriority(0);
      } else {
        if (dialog_mode === "add") await getMaxPriority();
        if (dialog_mode === "edit" && dataGroupPost) {
          setListContent(dataGroupPost?.contents || []);
          setPriority(dataGroupPost?.priority || 0);
          if (dataGroupPost?.files) {
            await handleInitFile();
          }
        }
      }
    };

    if (open) {
      handleOpenChange(open);
    }

    return () => {
      ignore = false;
    };
  }, [open, dialog_mode, handleInitFile, dataGroupPost]);

  const handleOnSave = useCallback(async () => {
    const form = formRef.current;
    if (!form) return;

    try {
      const formData = new FormData(form);

      const title = formData.get("data-group-post-title-input") as string;
      const name = formData.get("data-group-post-name-input") as string;
      const priority = formData.get("data-group-post-priority-input") as string;

      if (!title || !title.trim()) {
        handleError(
          getTextWithLanguage({
            en: "Title is required",
            vi: "Vui lòng nhập tiêu đề",
          }),
        );
        return;
      }

      const payload = {
        title,
        name,
        priority: Number(priority || 0),
        contents: listContent,
      };

      if (changeFileFlagRef.current) {
        const inp = form.elements.namedItem(
          "data-group-post-files-input",
        ) as HTMLInputElement;
        const files = inp?.files;
        const res = await fileService.uploadFiles(Array.from(files));
        payload["files"] = res;
        //do some thing here
        changeFileFlagRef.current = false;
      }

      if (dialog_mode === "edit") {
        const newPayload = {
          ...dataGroupPost,
          ...payload,
        };
        const res = await dataGroupPostService.updateDataGroupPost(
          dataGroupPost.id,
          newPayload,
        );
        onSave(res);
      }
      if (dialog_mode === "add") {
        payload["id"] = genID();

        const res = await dataGroupPostService.addNewDataGroupPost(payload);

        form.reset();
        setListContent(DEFAULT_LIST_CONTENTS);
        setListFileUrl([]);
        onSave(res);
      }
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to save data",
          vi: "Lỗi khi lưu dữ liệu",
        }),
      );
    }
  }, [listContent, onSave, dialog_mode, dataGroupPost]);

  function handleError(msg: string) {
    setErrorMessage(msg);
    errorRef.current?.scrollIntoView({ block: "start" });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={"min-w-0 sm:max-w-xl h-[93dvh] flex flex-col"}>
          {loading && <Loading type="cover" />}
          <DialogHeader>
            <DialogTitle>
              {getTextWithLanguage({
                en: "Edit Data Group Post",
                vi: "Chỉnh sửa dữ liệu bài đăng nhóm",
              })}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto min-h-0 p-2 flex-1">
            <form ref={formRef} className="flex flex-col gap-4">
              <Field>
                <FieldLabel htmlFor="data-group-post-title">
                  {getTextWithLanguage({
                    en: "Enter title:",
                    vi: "Nhập tiêu đề:",
                  })}
                </FieldLabel>
                <Input
                  defaultValue={dataGroupPost?.title || ""}
                  id="data-group-post-title"
                  onChange={() => handleError("")}
                  name="data-group-post-title-input"
                  placeholder={getTextWithLanguage({
                    en: "Ex: cau giay, lang,...",
                    vi: "VD: cầu giấy, láng,...",
                  })}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="data-group-post-name">
                  {getTextWithLanguage({ en: "Enter name:", vi: "Nhập tên:" })}
                </FieldLabel>
                <Input
                  defaultValue={dataGroupPost?.name || ""}
                  id="data-group-post-name"
                  name="data-group-post-name-input"
                  placeholder={getTextWithLanguage({
                    en: "Enter name of data",
                    vi: "Nhập tên dữ liệu",
                  })}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="data-group-post-priority">
                  {getTextWithLanguage({
                    en: "Enter priority:",
                    vi: "Nhập độ ưu tiên:",
                  })}
                </FieldLabel>
                <div className="">
                  <Input
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    id="data-group-post-priority"
                    name="data-group-post-priority-input"
                    type="number"
                    placeholder={getTextWithLanguage({
                      en: "Enter priority",
                      vi: "Nhập độ ưu tiên",
                    })}
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      text={getTextWithLanguage({
                        en: "Default Priority",
                        vi: "Độ ưu tiên mặc định",
                      })}
                      onClick={getMaxPriority}
                    />
                  </div>
                </div>
              </Field>
              <div className="w-full">
                <Label className="mb-4">
                  {getTextWithLanguage({
                    en: "Manage contents:",
                    vi: "Quản lý nội dung:",
                  })}
                  {listContent.length}{" "}
                  {getTextWithLanguage({ en: "contents", vi: "nội dung" })}{" "}
                </Label>
                <Button
                  size="xs"
                  text={getTextWithLanguage({
                    en: "Show contents",
                    vi: "Xem nội dung",
                  })}
                  className="rounded-sm"
                  onClick={() => setOpenDialogContents(true)}
                />
              </div>
              <Field>
                <FieldLabel htmlFor="data-group-post-files">
                  {getTextWithLanguage({ en: "Choose File:", vi: "Chọn tệp:" })}
                </FieldLabel>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="cursor-pointer"
                  id="data-group-post-files"
                  name="data-group-post-files-input"
                  ref={inputFileRef}
                  onChange={(e) => {
                    const files = e.target.files;
                    if (!files) return;
                    const urls = Array.from(files).map((file) =>
                      URL.createObjectURL(file),
                    );
                    setListFileUrl(urls);
                    changeFileFlagRef.current = true;
                  }}
                />
                <div>
                  <div className="flex gap-1 flex-wrap">
                    {listFileUrl.map((url, idx) => {
                      return (
                        <div className="h-20 w-20 bg-gray-100" key={idx}>
                          <img
                            src={url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Field>
            </form>
            <div ref={errorRef} className="text-red-500 mt-3 font-medium">
              {errorMessage}
            </div>
          </div>
          <DialogFooter className="py-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              {getTextWithLanguage({ en: "Cancel", vi: "Hủy" })}
            </Button>
            <Button size="md" type="submit" onClick={handleOnSave}>
              {getTextWithLanguage({ en: "Save", vi: "Lưu" })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DialogManagerContentsDataGroupPost
        open={openDialogContents}
        onOpenChange={setOpenDialogContents}
        onChangeListContents={(contents) => {
          setListContent(contents);
        }}
        initContents={listContent}
      />
    </>
  );
}
