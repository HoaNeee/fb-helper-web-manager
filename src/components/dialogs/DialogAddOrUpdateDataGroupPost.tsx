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
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [dataGroupPost]);

  const getMaxPriority = async () => {
    try {
      setLoading(true);
      const res = await dataGroupPostService.getMaxPriority();
      setPriority(res + 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // only get max priority when dialog mode is add
    if (dialog_mode === "add") {
      getMaxPriority();
    }
  }, [dialog_mode]);

  useEffect(() => {
    if ((dialog_mode === "edit" && !dataGroupPost) || dialog_mode === "add") {
      return;
    }

    setListContent(dataGroupPost?.contents || []);
    setPriority(dataGroupPost?.priority || 0);
    if (dataGroupPost?.files) {
      handleInitFile();
    }
  }, [dialog_mode, dataGroupPost, handleInitFile]);

  const handleOnSave = useCallback(async () => {
    const form = formRef.current;
    if (!form) return;

    try {
      const formData = new FormData(form);

      const title = formData.get("data-group-post-title-input") as string;
      const name = formData.get("data-group-post-name-input") as string;
      let priority = formData.get("data-group-post-priority-input") as string;

      if (!title || !title.trim()) {
        handleError("Title is required");
        return;
      }

      let payload = {
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
      console.log(error);
    }
  }, [listContent, onSave, dialog_mode, dataGroupPost]);

  function handleError(msg: string) {
    setErrorMessage(msg);
    errorRef.current?.scrollIntoView({ block: "start" });
  }

  if (!dataGroupPost && dialog_mode === "edit") return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={"min-w-130 h-[93vh] flex flex-col"}>
          {loading && <Loading type="cover" />}
          <DialogHeader>
            <DialogTitle>Edit Data Group Post</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto p-2 flex-1">
            <form ref={formRef} className="flex flex-col gap-4">
              <Field>
                <FieldLabel htmlFor="data-group-post-title">
                  Enter title:
                </FieldLabel>
                <Input
                  defaultValue={dataGroupPost?.title || ""}
                  id="data-group-post-title"
                  onChange={() => handleError("")}
                  name="data-group-post-title-input"
                  placeholder="Ex: cau giay, lang,..."
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="data-group-post-name">
                  Enter name:
                </FieldLabel>
                <Input
                  defaultValue={dataGroupPost?.name || ""}
                  id="data-group-post-name"
                  name="data-group-post-name-input"
                  placeholder="Enter name of data"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="data-group-post-priority">
                  Enter priority:
                </FieldLabel>
                <div className="">
                  <Input
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    id="data-group-post-priority"
                    name="data-group-post-priority-input"
                    type="number"
                    placeholder="Enter priority"
                  />
                  <div className="flex justify-end mt-2">
                    <Button text="Default Priority" onClick={getMaxPriority} />
                  </div>
                </div>
              </Field>
              <div className="w-full">
                <Label className="mb-4">
                  Manager Content: {listContent.length} contents{" "}
                </Label>
                <Button
                  size="xs"
                  text="Show contents"
                  className="rounded-sm"
                  onClick={() => setOpenDialogContents(true)}
                />
              </div>
              <Field>
                <FieldLabel htmlFor="data-group-post-files">
                  Choose File:
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
              Cancel
            </Button>
            <Button size="md" type="submit" onClick={handleOnSave}>
              Save
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
