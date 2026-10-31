import { useLanguage } from "@/hooks/useLanguage";
import getTextWithLanguage from "@/helpers/language";
import type {
  ComponentRenderFn,
  DialogTriggerState,
  HTMLProps,
} from "@base-ui/react";
import { Button } from "../Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface DialogConfirmProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  type?: "trigger" | "state";
  trigger?:
    | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
    | ComponentRenderFn<HTMLProps, DialogTriggerState>;
  okText?: string;
  cancelText?: string;
  renderOkButton?: React.ReactNode;
  renderCancelButton?: React.ReactNode;
}

export default function DialogConfirm({
  title = getTextWithLanguage({ en: "Are you sure?", vi: "Bạn có chắc chắn?" }),
  description = getTextWithLanguage({
    en: "This action cannot be undone.",
    vi: "Không thể hoàn tác thao tác này.",
  }),
  onConfirm,
  onCancel,
  open,
  onOpenChange,
  type = "state",
  trigger,
  okText = getTextWithLanguage({ en: "Continue", vi: "Tiếp tục" }),
  cancelText = getTextWithLanguage({ en: "Cancel", vi: "Hủy" }),
  renderOkButton,
  renderCancelButton,
}: DialogConfirmProps) {
  useLanguage();
  if (!renderOkButton) {
    renderOkButton = <Button onClick={onConfirm}>{okText}</Button>;
  }

  if (!renderCancelButton) {
    renderCancelButton = (
      <Button variant="secondary" onClick={onCancel}>
        {cancelText}
      </Button>
    );
  }

  if (type === "trigger") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger render={trigger} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="flex w-full items-center justify-end gap-2">
            <DialogClose
              render={
                renderCancelButton as React.ReactElement<HTMLProps<unknown>>
              }
            />
            <DialogClose
              render={renderOkButton as React.ReactElement<HTMLProps<unknown>>}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex w-full items-center justify-end gap-2">
          {renderCancelButton}
          {renderOkButton}
        </div>
      </DialogContent>
    </Dialog>
  );
}
