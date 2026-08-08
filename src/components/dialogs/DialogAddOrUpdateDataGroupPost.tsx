import { useCallback, useEffect, useRef, useState } from "react";
import Button from "../Button";
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
import { type DataGroupPost } from "@/services/data-group-post-service";
import { genID } from "@/utils/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: Partial<DataGroupPost>) => void;
  dataGroupPost?: Partial<DataGroupPost>;
  dialog_mode: "edit" | "add";
};

const DEFAULT_LIST_CONTENTS = ["<p></p>"];

export default function DialogViewDetailDataGroupPost({
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

  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dialog_mode === "add") {
      setListContent(DEFAULT_LIST_CONTENTS);
    } else {
      setListContent(dataGroupPost?.contents || []);
    }
  }, [dialog_mode, dataGroupPost]);

  const handleOnSave = useCallback(() => {
    const form = formRef.current;
    if (!form) return;

    const title = (
      form.elements.namedItem("data-group-post-title") as HTMLInputElement
    )?.value;
    const name = (
      form.elements.namedItem("data-group-post-name") as HTMLInputElement
    )?.value;
    let priority = (
      form.elements.namedItem("data-group-post-priority") as HTMLInputElement
    )?.value;
    const files = (
      form.elements.namedItem("data-group-post-files") as HTMLInputElement
    )?.files;

    if (!title || !title.trim()) {
      handleError("Title is required");
      return;
    }

    let payload = {
      title,
      name,
      priority: Number(priority || 0),
      files: [],
      contents: listContent,
    };

    if (dialog_mode === "edit") {
      payload = {
        ...dataGroupPost,
        ...payload,
      };
    }
    if (dialog_mode === "add") {
      payload["id"] = genID();
      form.reset();
      setListContent(DEFAULT_LIST_CONTENTS);
    }

    onSave(payload);
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
                  defaultValue={dataGroupPost?.title}
                  id="data-group-post-title"
                  onChange={() => handleError("")}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="data-group-post-name">
                  Enter name:
                </FieldLabel>
                <Input
                  defaultValue={dataGroupPost?.name}
                  id="data-group-post-name"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="data-group-post-priority">
                  Enter priority:
                </FieldLabel>
                <Input
                  defaultValue={dataGroupPost?.priority}
                  id="data-group-post-priority"
                />
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
                />
                {/* <div>
                  <div className="flex gap-1 flex-wrap">
                    {Array.from({ length: 7 }).map((_, idx) => {
                      return (
                        <div className="h-20 w-20 bg-blue-200" key={idx}>
                          image
                        </div>
                      );
                    })}
                  </div>
                </div> */}
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
