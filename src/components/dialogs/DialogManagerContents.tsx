import { useLanguage } from "@/hooks/useLanguage";
import getTextWithLanguage from "@/helpers/language";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import ReactQuillNew from "react-quill-new";
import { X } from "lucide-react";
import { Button } from "../Button";
import { genID } from "@/utils/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChangeListContents: (contents: string[]) => void;
  initContents?: string[];
};

export default function DialogManagerContentsDataGroupPost({
  open,
  onOpenChange,
  onChangeListContents,
  initContents,
}: Props) {
  useLanguage();
  const [listQuill, setListQuill] = useState<ReactQuillNew[]>([
    new ReactQuillNew({ id: genID(), value: "" }),
  ]);

  useEffect(() => {
    if (initContents) {
      const newList = initContents.map((content) => {
        return new ReactQuillNew({ id: genID(), value: content });
      });
      setListQuill(newList);
    }
  }, [initContents]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getTextWithLanguage({
            en: "Manage post contents",
            vi: "Quản lý nội dung bài đăng này",
          })}</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
            {listQuill.map((quill, idx) => {
              return (
                <div className="relative" key={idx}>
                  {listQuill.length > 1 ? (
                    <div className="absolute top-1 right-1">
                      <X
                        size={16}
                        className="cursor-pointer hover:text-rose-500"
                        onClick={() => {
                          const newList = listQuill.filter(
                            (ql) => ql.props.id !== quill.props.id,
                          );
                          setListQuill(newList);
                          onChangeListContents(
                            newList.map((q) => q.value as string),
                          );
                        }}
                      />
                    </div>
                  ) : null}
                  <ReactQuillNew
                    value={quill.value}
                    onChange={(val) => {
                      listQuill[idx].value = val;
                      setListQuill(listQuill);
                      onChangeListContents(
                        listQuill.map((q) => q.value as string),
                      );
                    }}
                    id={quill.props.id}
                  />
                </div>
              );
            })}
          </div>
          <Button
            size="xs"
            text={getTextWithLanguage({ en: "Add new content", vi: "Thêm nội dung mới" })}
            className="mt-2 rounded-sm"
            onClick={() => {
              const newList = [...listQuill];
              newList.push(new ReactQuillNew({ id: genID(), value: "" }));
              setListQuill(newList);
              onChangeListContents(newList.map((q) => q.value as string));
            }}
          />
        </div>
        <DialogFooter className="p-2">
          <Button
            size="md"
            type="submit"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            {getTextWithLanguage({ en: "Done", vi: "Xong" })}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
