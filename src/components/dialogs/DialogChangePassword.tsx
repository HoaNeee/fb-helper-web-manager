import { useRef, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import getTextWithLanguage from "@/helpers/language";
import toastHepler from "@/helpers/toast-helper";
import userService from "@/services/user-service";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Field, FieldLabel } from "../ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Z_INDEX } from "@/constants/constants";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function DialogChangePassword({ open, onOpenChange }: Props) {
  useLanguage();
  const text = getTextWithLanguage;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const fields = [
    {
      name: "oldPass",
      label: text({ en: "Current password", vi: "Mật khẩu cũ" }),
      autoComplete: "current-password",
    },
    {
      name: "newPass",
      label: text({ en: "New password", vi: "Mật khẩu mới" }),
      autoComplete: "new-password",
    },
    {
      name: "confirm",
      label: text({ en: "Confirm new password", vi: "Xác nhận mật khẩu mới" }),
      autoComplete: "new-password",
    },
  ];

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const data = new FormData(event.currentTarget);
    const oldPass = String(data.get("oldPass") ?? "");
    const newPass = String(data.get("newPass") ?? "");
    if (newPass !== data.get("confirm")) {
      setError(
        text({
          en: "Passwords do not match.",
          vi: "Mật khẩu xác nhận không khớp.",
        }),
      );
      return;
    }
    if (oldPass === newPass) {
      setError(
        text({
          en: "Choose a password different from your current password.",
          vi: "Mật khẩu mới phải khác mật khẩu cũ.",
        }),
      );
      return;
    }
    submitting.current = true;
    setSaving(true);
    setError("");
    try {
      await userService.changePassword({
        old_password: oldPass,
        new_password: newPass,
      });
      toastHepler({
        type: "success",
        message: text({
          en: "Password changed successfully.",
          vi: "Đổi mật khẩu thành công.",
        }),
      });
      onOpenChange(false);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : text({
              en: "Unable to change password.",
              vi: "Không thể đổi mật khẩu.",
            }),
      );
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!submitting.current) onOpenChange(nextOpen);
      }}
    >
      <DialogContent
        className={`sm:max-w-sm max-h-[90dvh] overflow-y-auto`}
        showCloseButton={!saving}
      >
        <DialogHeader>
          <DialogTitle>
            {text({ en: "Change password", vi: "Đổi mật khẩu" })}
          </DialogTitle>
          <DialogDescription>
            {text({
              en: "Enter your current password and choose a new password.",
              vi: "Nhập mật khẩu cũ và đặt mật khẩu mới.",
            })}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          aria-busy={saving}
        >
          <fieldset disabled={saving} className="flex min-w-0 flex-col gap-3">
            {fields.map(({ name, label, autoComplete }) => (
              <Field key={name}>
                <FieldLabel htmlFor={`change-password-${name}`}>
                  {label}
                </FieldLabel>
                <Input
                  id={`change-password-${name}`}
                  name={name}
                  type="password"
                  autoComplete={autoComplete}
                  required
                />
              </Field>
            ))}
          </fieldset>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              disabled={saving}
              onClick={() => onOpenChange(false)}
            >
              {text({ en: "Cancel", vi: "Hủy" })}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving
                ? text({ en: "Saving…", vi: "Đang lưu…" })
                : text({ en: "Save", vi: "Lưu" })}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
