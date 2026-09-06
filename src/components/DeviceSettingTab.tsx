import getTextWithLanguage from "@/helpers/language";
import { Button } from "./Button";
import { Field, FieldDescription, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import deviceService, { type DeviceSetting } from "@/services/device-service";
import Loading from "./Loading";
import DialogSyncDevieSetting from "./dialogs/DialogSyncDeviceSetting";
import { handleExceptionGlobal } from "@/utils/exception";

export default function DeviceSettingTab() {
  const [deviceSetting, setDeviceSetting] = useState<DeviceSetting | null>(
    null,
  );

  const [openDialogSyncDevice, setOpenDialogSyncDevice] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const inputMaxGroupPerBatchRef = useRef<HTMLInputElement>(null);
  const inputStrictlyTitleMatchGroupsRef = useRef<HTMLTextAreaElement>(null);

  const formTimeDelayRef = useRef<HTMLFormElement>(null);

  const params = useParams<{ deviceId: string }>();
  const deviceId = params.deviceId;

  useEffect(() => {
    const fn = async () => {
      setLoading(true);
      try {
        const data = await deviceService.getDeviceSetting(params.deviceId);
        setDeviceSetting(data);
      } catch (error) {
        setError(error?.message || error);
      } finally {
        setLoading(false);
      }
    };
    fn();
  }, []);

  const handleUpdateDeviceSetting = async <K extends keyof DeviceSetting>(
    key: K,
    value: DeviceSetting[K],
  ) => {
    try {
      await deviceService.updateDeviceSetting({
        key,
        value,
        device_id: deviceId,
      });
    } catch (error) {
      handleExceptionGlobal(error);
    }
  };

  const handleSaveTimeDelay = async () => {
    try {
      if (!formTimeDelayRef.current) return;
      const form = formTimeDelayRef.current;
      const formData = new FormData(form);

      const payload = {};

      let flagError = false;

      formData.forEach((value, key) => {
        const newKey = key.replace("name_", "");
        if (!value || !value.toString().trim()) {
          flagError = true;
          return;
        }
        payload[newKey] = Number(value);
      });

      for (const key in payload) {
        if (payload[key]) {
          await handleUpdateDeviceSetting(key as any, payload[key]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSyncDeviceSetting = async (target_device_id: string) => {
    try {
      setLoading(true);
      const res = await deviceService.syncDeviceSetting(
        deviceId,
        target_device_id,
      );
      setDeviceSetting(res);
      setOpenDialogSyncDevice(false);
    } catch (error) {
      handleExceptionGlobal(error);
    } finally {
      setLoading(false);
    }
  };

  if (error)
    return (
      <div className="flex items-center justify-center h-full w-full">
        {error}
      </div>
    );

  if (loading) return <Loading type="page" />;

  if (!deviceSetting)
    return (
      <div className="flex items-center justify-center h-full w-full">
        Đã xảy ra lỗi, vui lòng thử lại sau!
      </div>
    );

  return (
    <div className="py-2 px-4">
      <div className="flex justify-end">
        <Button
          text="Sync Device setting"
          variant="primary"
          size="md"
          className="rounded-sm"
          onClick={() => setOpenDialogSyncDevice(true)}
        />
      </div>
      <div className="flex flex-col gap-6">
        <Field className="max-w-80">
          <FieldLabel htmlFor="max-group-per-batch">
            {getTextWithLanguage({
              vi: "Số nhóm tối đa mỗi đợt",
              en: "Max number of groups per batch",
            })}
          </FieldLabel>
          <div className="flex items-center gap-2">
            <Input
              id="max-group-per-batch"
              type="number"
              placeholder="Ex: 20"
              min={1}
              max={100}
              defaultValue={deviceSetting?.max_group_per_batch}
              ref={inputMaxGroupPerBatchRef}
            />
            <Button
              variant="primary"
              text="Save"
              className="rounded-sm"
              size="md"
              onClick={async () => {
                try {
                  if (!inputMaxGroupPerBatchRef.current) return;
                  const value = inputMaxGroupPerBatchRef.current.value;
                  if (!value || !value.trim()) return;
                  const valueNumber = Number(value);
                  handleUpdateDeviceSetting("max_group_per_batch", valueNumber);
                } catch (error) {
                  handleExceptionGlobal(error);
                }
              }}
            />
          </div>
        </Field>
        <Field>
          <FieldLabel htmlFor="strictly-title-match-group">
            {getTextWithLanguage({
              vi: "Từ khóa thứ hai cho việc lọc nhóm nghiêm ngặt:",
              en: "Second keyword for strict group filtering:",
            })}
          </FieldLabel>
          <Textarea
            id="strictly-title-match-groups"
            placeholder={getTextWithLanguage({
              vi: "Nhập cách nhau bằng dấu ','",
              en: "Enter each line separated by ','",
            })}
            defaultValue={deviceSetting?.strictly_title_match_groups?.join(
              ", ",
            )}
            ref={inputStrictlyTitleMatchGroupsRef}
          />
          <FieldDescription className="flex items-center justify-end">
            <Button
              text="Save"
              variant="primary"
              className="rounded-sm"
              size="md"
              onClick={async () => {
                if (!inputStrictlyTitleMatchGroupsRef.current) return;
                const value = inputStrictlyTitleMatchGroupsRef.current.value;
                if (!value || !value.trim()) return;
                const valueArray = value.split(",").map((item) => item.trim());
                handleUpdateDeviceSetting(
                  "strictly_title_match_groups",
                  valueArray,
                );
              }}
            />
          </FieldDescription>
        </Field>
      </div>
      <div className="border-b py-2">
        <h2 className="text-lg font-medium">
          {getTextWithLanguage({
            vi: "Cài đặt nhanh",
            en: "Quick settings",
          })}
        </h2>
      </div>
      <div className="flex flex-col gap-4 mt-6 ml-6">
        <Field orientation="horizontal">
          <Checkbox
            id="is_fix_steal_focus"
            className={"size-4.5"}
            defaultChecked={deviceSetting?.is_fix_steal_focus}
            onCheckedChange={(checked) =>
              handleUpdateDeviceSetting("is_fix_steal_focus", checked)
            }
          />
          <FieldLabel
            htmlFor="is_fix_steal_focus"
            className="text-base font-medium"
          >
            Fix steal focus
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="is_fix_steal_all_focus"
            className={"size-4.5"}
            defaultChecked={deviceSetting?.is_fix_steal_all_focus}
            onCheckedChange={(checked) =>
              handleUpdateDeviceSetting("is_fix_steal_all_focus", checked)
            }
          />
          <FieldLabel
            htmlFor="is_fix_steal_all_focus"
            className="text-base font-medium"
          >
            Fix steal all focus
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="is_random_break_batch"
            className={"size-4.5"}
            defaultChecked={deviceSetting.is_random_break_batch}
            onCheckedChange={(checked) =>
              handleUpdateDeviceSetting("is_random_break_batch", checked)
            }
          />
          <FieldLabel
            htmlFor="is_random_break_batch"
            className="text-base font-medium"
          >
            Random break batch
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="is_random_time_post"
            className={"size-4.5"}
            defaultChecked={deviceSetting.is_random_time_post}
            onCheckedChange={(checked) =>
              handleUpdateDeviceSetting("is_random_time_post", checked)
            }
          />
          <FieldLabel
            htmlFor="is_random_time_post"
            className="text-base font-medium"
          >
            Random time post
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="is_shuffle_group_need_post"
            className={"size-4.5"}
            defaultChecked={deviceSetting.is_shuffle_group_need_post}
            onCheckedChange={(checked) =>
              handleUpdateDeviceSetting("is_shuffle_group_need_post", checked)
            }
          />
          <FieldLabel
            htmlFor="is_shuffle_group_need_post"
            className="text-base font-medium"
          >
            Shuffle group need post
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="is_special_frame_hours"
            className={"size-4.5"}
            defaultChecked={deviceSetting.is_special_frame_hours}
            onCheckedChange={(checked) =>
              handleUpdateDeviceSetting("is_special_frame_hours", checked)
            }
          />
          <FieldLabel
            htmlFor="is_special_frame_hours"
            className="text-base font-medium"
          >
            Special frame hours
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="is_scheduler"
            className={"size-4.5"}
            defaultChecked={deviceSetting.is_scheduler}
            onCheckedChange={(checked) =>
              handleUpdateDeviceSetting("is_scheduler", checked)
            }
          />
          <FieldLabel htmlFor="is_scheduler" className="text-base font-medium">
            Scheduler
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="is_comment_when_post"
            className={"size-4.5"}
            defaultChecked={deviceSetting.is_comment_when_post}
            onCheckedChange={(checked) =>
              handleUpdateDeviceSetting("is_comment_when_post", checked)
            }
          />
          <FieldLabel
            htmlFor="is_comment_when_post"
            className="text-base font-medium"
          >
            Comment when post
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="is_interact_batch"
            className={"size-4.5"}
            defaultChecked={deviceSetting.is_interact_batch}
            onCheckedChange={(checked) =>
              handleUpdateDeviceSetting("is_interact_batch", checked)
            }
          />
          <FieldLabel
            htmlFor="is_interact_batch"
            className="text-base font-medium"
          >
            Interact before post
          </FieldLabel>
        </Field>

        <Field orientation="horizontal">
          <Checkbox
            id="is_remote"
            className={"size-4.5"}
            defaultChecked={deviceSetting.is_remote}
            onCheckedChange={(checked) =>
              handleUpdateDeviceSetting("is_remote", checked)
            }
          />
          <FieldLabel htmlFor="is_remote" className="text-base font-medium">
            Remote
          </FieldLabel>
        </Field>
      </div>
      <div className="border-b py-2 mt-6">
        <h2 className="text-lg font-medium">
          {getTextWithLanguage({
            vi: "Thời gian trễ khi đăng bài",
            en: "Delay time when post",
          })}
        </h2>
      </div>
      <form
        ref={formTimeDelayRef}
        className="ml-6 mt-4 max-w-86 flex flex-col gap-4"
      >
        <Field>
          <FieldLabel>
            {getTextWithLanguage({
              vi: "Thời gian trễ khi click vào nút hiển thị hộp thoại đăng bài (giây)",
              en: "Delay time click to open dialog post (s)",
            })}
          </FieldLabel>
          <div className="flex items-center gap-2">
            <Input
              id="time_delay_click_to_post"
              name="name_time_delay_click_to_post"
              type="number"
              min={0}
              defaultValue={deviceSetting.time_delay_click_to_post}
            />
          </div>
        </Field>
        <Field>
          <FieldLabel>
            {getTextWithLanguage({
              vi: "Thời gian trễ khi điền nội dung (giây)",
              en: "Delay time fill content (s)",
            })}
          </FieldLabel>
          <div className="flex items-center gap-2">
            <Input
              id="time_delay_fill_content"
              name="name_time_delay_fill_content"
              type="number"
              min={0}
              defaultValue={deviceSetting.time_delay_fill_content}
            />
          </div>
        </Field>
        <Field>
          <FieldLabel>
            {getTextWithLanguage({
              vi: "Thời gian trễ khi click vào nút chọn tệp (giây)",
              en: "Delay time click to select file (s)",
            })}
          </FieldLabel>
          <div className="flex items-center gap-2">
            <Input
              id="time_delay_click_file"
              name="name_time_delay_click_file"
              type="number"
              min={0}
              defaultValue={deviceSetting.time_delay_fill_file}
            />
          </div>
        </Field>
        <Field>
          <FieldLabel>
            {getTextWithLanguage({
              vi: "Thời gian trễ khi click vào nút đăng bài (giây)",
              en: "Delay time click to post (s)",
            })}
          </FieldLabel>
          <div className="flex items-center gap-2">
            <Input
              id="time_delay_click_post"
              name="name_time_delay_click_post"
              type="number"
              min={0}
              defaultValue={deviceSetting.time_delay_post}
            />
          </div>
        </Field>
        <Field>
          <FieldLabel>
            {getTextWithLanguage({
              vi: "Thời gian trễ khi mở tab mới (giây)",
              en: "Delay time open new tab (s)",
            })}
          </FieldLabel>
          <div className="flex items-center gap-2">
            <Input
              id="time_delay_open_new_tab"
              name="name_time_delay_open_new_tab"
              type="number"
              min={0}
              defaultValue={deviceSetting.time_delay_open_new_tab}
            />
          </div>
        </Field>
        <div className="flex justify-end">
          <Button
            text={getTextWithLanguage({
              vi: "Lưu cài đặt thời gian trễ",
              en: "Save delay time setting",
            })}
            variant="primary"
            className="rounded-sm"
            size="md"
            onClick={handleSaveTimeDelay}
          />
        </div>
      </form>

      <DialogSyncDevieSetting
        open={openDialogSyncDevice}
        onOpenChange={setOpenDialogSyncDevice}
        onSyncDevice={handleSyncDeviceSetting}
      />
    </div>
  );
}
