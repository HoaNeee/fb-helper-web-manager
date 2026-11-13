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
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../Button";
import { Textarea } from "../ui/textarea";
import { genID } from "@/utils/utils";

type CommentItem = {
  id: string;
  value: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChangeListContents: (contents: string[]) => void;
  initContents?: string[];
};

export default function DialogContentCommentWalk({
  open,
  onOpenChange,
  onChangeListContents,
  initContents,
}: Props) {
  useLanguage();
  const [listComments, setListComments] = useState<CommentItem[]>([
    { id: genID(), value: "" },
  ]);

  useEffect(() => {
    if (open) {
      if (initContents && initContents.length > 0) {
        const newList = initContents.map((content) => ({
          id: genID(),
          value: content,
        }));
        setListComments(newList);
      } else {
        setListComments([{ id: genID(), value: "" }]);
      }
    }
  }, [open, initContents]);

  const handleUpdateItem = (id: string, value: string) => {
    setListComments((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, value } : item,
      );
      return updated;
    });
  };

  const handleAddItem = () => {
    setListComments((prev) => {
      const updated = [...prev, { id: genID(), value: "" }];
      return updated;
    });
  };

  const handleDeleteItem = (id: string) => {
    setListComments((prev) => {
      if (prev.length <= 1) {
        const reset = [{ id: genID(), value: "" }];
        return reset;
      }
      const updated = prev.filter((item) => item.id !== id);
      return updated;
    });
  };

  const handleDone = () => {
    onChangeListContents(listComments.map((item) => item.value));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-0 sm:max-w-xl max-h-[85dvh] flex flex-col">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="text-lg font-semibold">
            {getTextWithLanguage({ en: `Manage comment contents (${listComments.length})`, vi: `Quản lý nội dung bình luận (${listComments.length})` })}</DialogTitle>
        </DialogHeader>

        <div className="p-1 sm:p-4 min-h-0 flex-1 overflow-y-auto space-y-4">
          <div className="flex flex-col gap-3">
            {listComments.map((comment, idx) => {
              return (
                <div
                  key={comment.id}
                  className="p-3 border border-slate-200 dark:border-zinc-800 rounded-lg bg-slate-50/50 dark:bg-zinc-900/50"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                      {getTextWithLanguage({ en: "Content #", vi: "Nội dung #" })}{idx + 1}
                    </span>
                    {listComments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(comment.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors rounded hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        title={getTextWithLanguage({ en: "Remove this content", vi: "Xóa nội dung này" })}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                  <Textarea
                    value={comment.value}
                    onChange={(e) =>
                      handleUpdateItem(comment.id, e.target.value)
                    }
                    placeholder={getTextWithLanguage({
                      en: "Enter comment content...",
                      vi: "Nhập nội dung bình luận...",
                    })}
                    rows={3}
                    className="w-full bg-white dark:bg-zinc-950"
                  />
                </div>
              );
            })}
          </div>

          <div className="pt-1">
            <Button
              size="sm"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 border-dashed hover:border-solid"
              onClick={handleAddItem}
            >
              <Plus size={16} />
              <span>{getTextWithLanguage({
                en: "Add new comment content",
                vi: "Thêm nội dung bình luận mới",
              })}</span>
            </Button>
          </div>
        </div>

        <DialogFooter className="p-3 border-t flex justify-end gap-2 bg-slate-50/50 dark:bg-zinc-950/50">
          <Button
            variant="secondary"
            size="md"
            onClick={() => onOpenChange(false)}
          >
            {getTextWithLanguage({ en: "Cancel", vi: "Hủy" })}</Button>
          <Button size="md" onClick={handleDone}>
            {getTextWithLanguage({ en: `Done (${listComments.length})`, vi: `Xong (${listComments.length})` })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
