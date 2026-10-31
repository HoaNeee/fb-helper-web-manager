import { useEffect, useRef, useState } from "react";
import { Camera, Trash2, UserRound, KeyRound } from "lucide-react";
import fileService from "@/services/file-service";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import DialogChangePassword from "./DialogChangePassword";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/hooks/useLanguage";
import getTextWithLanguage from "@/helpers/language";
import toastHepler from "@/helpers/toast-helper";
import userService, {
  type User,
  type UpdateUserPayload,
} from "@/services/user-service";
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

type Props = {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function DialogEditProfile({ user, open, onOpenChange }: Props) {
  useLanguage();
  const { updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState(user.avatar ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!avatarFile) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const submitting = useRef(false);

  const text = getTextWithLanguage;

  const fields = [
    {
      name: "name",
      label: text({ en: "Full name", vi: "Họ và tên" }),
      type: "text",
      autoComplete: "name",
    },
    {
      name: "username",
      label: text({ en: "Username", vi: "Tên đăng nhập" }),
      type: "text",
      autoComplete: "username",
    },
    {
      name: "email",
      label: text({ en: "Email", vi: "Email" }),
      type: "email",
      autoComplete: "email",
    },
  ] as const;

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting.current) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload: UpdateUserPayload = {};
    for (const { name } of fields) {
      const value = String(data.get(name) ?? "").trim();
      if ((name === "username" || name === "email") && !value) {
        setError(
          text({
            en: "Username and email cannot be empty.",
            vi: "Tên đăng nhập và email không được để trống.",
          }),
        );
        return;
      }
      if (value !== (user[name] ?? "")) payload[name] = value;
    }

    if (!avatarFile && avatar !== (user.avatar ?? "")) payload.avatar = avatar;

    if (!Object.keys(payload).length && !avatarFile) {
      onOpenChange(false);
      return;
    }

    submitting.current = true;
    setSaving(true);
    setError("");
    try {
      if (avatarFile) {
        const urls = await fileService.uploadFiles([avatarFile]);
        if (!urls[0])
          throw new Error(
            text({
              en: "Unable to upload avatar.",
              vi: "Không thể tải ảnh đại diện lên.",
            }),
          );
        payload.avatar = urls[0];
      }
      const updated = await userService.updateMe(payload);
      // Never store the newly entered password in the shared profile state.
      const profile = {
        ...user,
        ...payload,
        ...updated,
        password: user.password,
      };
      updateUser(profile);
      toastHepler({
        type: "success",
        message: text({
          en: "Profile updated successfully.",
          vi: "Cập nhật hồ sơ thành công.",
        }),
      });
      onOpenChange(false);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : text({
              en: "Unable to update profile. Please try again.",
              vi: "Không thể cập nhật hồ sơ. Vui lòng thử lại.",
            }),
      );
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!submitting.current && !changePasswordOpen)
            onOpenChange(nextOpen);
        }}
      >
        <DialogContent
          className="sm:max-w-sm max-h-[90dvh] overflow-y-auto"
          showCloseButton={!saving}
        >
          <DialogHeader>
            <DialogTitle>
              {text({ en: "Edit profile", vi: "Chỉnh sửa hồ sơ" })}
            </DialogTitle>
            <DialogDescription>
              {text({
                en: "Update your personal information below.",
                vi: "Cập nhật thông tin cá nhân của bạn bên dưới.",
              })}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            aria-busy={saving}
          >
            <fieldset disabled={saving} className="flex min-w-0 flex-col gap-4">
              <div className="relative mx-auto my-1 w-20">
                <Avatar className="size-20">
                  <AvatarImage
                    src={preview || avatar}
                    alt={user.name || user.username}
                  />
                  <AvatarFallback>
                    <UserRound className="size-8" />
                  </AvatarFallback>
                </Avatar>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  aria-label={text({
                    en: "Choose avatar",
                    vi: "Chọn ảnh đại diện",
                  })}
                  onChange={(event) => {
                    const file = event.target.files?.[0];

                    event.target.value = "";
                    if (!file) return;

                    if (!file.type.startsWith("image/")) {
                      setError(
                        text({
                          en: "Please select an image.",
                          vi: "Vui lòng chọn tệp ảnh.",
                        }),
                      );
                      return;
                    }
                    setError("");

                    const newFile = new File([file], "avt" + "_" + file.name, {
                      type: file.type,
                      lastModified: file.lastModified,
                      ...file,
                    });

                    setAvatarFile(newFile);
                  }}
                />
                <Button
                  type="button"
                  size="icon-xs"
                  className="absolute -right-1 bottom-0 rounded-full ring-2 ring-popover"
                  title={text({ en: "Change avatar", vi: "Thay ảnh đại diện" })}
                  aria-label={text({
                    en: "Change avatar",
                    vi: "Thay ảnh đại diện",
                  })}
                  onClick={() => fileInput.current?.click()}
                >
                  <Camera />
                </Button>
                {(avatar || avatarFile) && (
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="secondary"
                    className="absolute -left-1 bottom-0 rounded-full ring-2 ring-popover"
                    title={text({
                      en: "Remove avatar",
                      vi: "Xóa ảnh đại diện",
                    })}
                    aria-label={text({
                      en: "Remove avatar",
                      vi: "Xóa ảnh đại diện",
                    })}
                    onClick={() => {
                      setAvatarFile(null);
                      setAvatar("");
                    }}
                  >
                    <Trash2 />
                  </Button>
                )}
              </div>
              {fields.map(({ name, label, type, autoComplete }) => (
                <Field key={name}>
                  <FieldLabel htmlFor={`profile-${name}`}>{label}</FieldLabel>
                  <Input
                    id={`profile-${name}`}
                    name={name}
                    type={type}
                    autoComplete={autoComplete}
                    defaultValue={user[name] ?? ""}
                    required={name === "username" || name === "email"}
                  />
                </Field>
              ))}
              <Button
                type="button"
                variant="outline"
                className="self-start"
                onClick={() => setChangePasswordOpen(true)}
              >
                <KeyRound />
                {text({ en: "Change password", vi: "Đổi mật khẩu" })}
              </Button>
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
      {changePasswordOpen && (
        <DialogChangePassword
          open={changePasswordOpen}
          onOpenChange={setChangePasswordOpen}
        />
      )}
    </>
  );
}
