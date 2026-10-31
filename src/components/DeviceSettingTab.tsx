import { useLanguage } from "@/hooks/useLanguage";
import getTextWithLanguage from "@/helpers/language";
import { Button } from "./Button";
import { Field, FieldDescription, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { useParams } from "react-router";
import React, {
  useEffect,
  useRef,
  useState,
  type InputHTMLAttributes,
} from "react";
import deviceService from "@/services/device-service";
import Loading from "./Loading";
import DialogSyncDevieSetting from "./dialogs/DialogSyncDeviceSetting";
import { handleExceptionGlobal } from "@/utils/exception";
import type {
  CommentWalkConfig,
  DeviceSetting,
  PostConfig,
} from "@/types/types";
import { cn } from "@/lib/utils";
import { splitString } from "@/utils/utils";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useFeatureFlag } from "@/contexts/FeatureContext";
import toastHepler from "@/helpers/toast-helper";

function LabelSection({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("py-2 border-b border-gray-300", className)}>
      <h2 className="text-lg font-medium">{title}</h2>
    </div>
  );
}

export default function DeviceSettingTab() {
  useLanguage();
  const { getFeatureEnabled } = useFeatureFlag();

  const [deviceSetting, setDeviceSetting] = useState<DeviceSetting | null>(
    null,
  );
  const [postConfig, setPostConfig] = useState<PostConfig | null>(null);
  const [commentWalkConfig, setCommentWalkConfig] =
    useState<CommentWalkConfig | null>(null);

  const [openDialogSyncDevice, setOpenDialogSyncDevice] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const inputMaxGroupPerBatchRef = useRef<HTMLInputElement>(null);
  const inputStrictlyTitleMatchGroupsRef = useRef<HTMLTextAreaElement>(null);
  const inputTimeBreakWhenSpammedRef = useRef<HTMLInputElement>(null);

  const formTimeDelayRef = useRef<HTMLFormElement>(null);
  const formTimeDelayCommentWalkConfigRef = useRef<HTMLFormElement>(null);
  const formCommentWalkConfigRef = useRef<HTMLFormElement>(null);

  const params = useParams<{ deviceId: string }>();
  const deviceId = params.deviceId;

  useEffect(() => {
    if (!deviceId) return;
    const fn = async () => {
      setLoading(true);
      try {
        const data = await deviceService.getDeviceSetting(deviceId);
        setDeviceSetting(data);
        setPostConfig(data.post_config);
        setCommentWalkConfig(data.comment_walk_config);
      } catch (error) {
        toastHepler({
          message: getTextWithLanguage({
            en: "Failed to get device setting",
            vi: "Lỗi khi lấy cài đặt thiết bị",
          }),
          type: "error",
        });
        setError(error?.message || error);
      } finally {
        setLoading(false);
      }
    };
    fn();
  }, [deviceId]);

  const handleUpdateDeviceSetting = async <K extends keyof DeviceSetting>(
    key: K,
    value: DeviceSetting[K],
  ) => {
    try {
      return await deviceService.updateDeviceSetting({
        key,
        value,
        device_id: deviceId,
      });
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to update device setting",
          vi: "Lỗi cập nhật cài đặt thiết bị",
        }),
      );
    }
  };

  function toastUpdatePostConfig() {
    toastHepler({
      message: getTextWithLanguage({
        en: "Update post config successfully",
        vi: "Cập nhật cài đặt bài đăng thành công",
      }),
      type: "success",
    });
  }

  function toastUpdateDeviceSetting() {
    toastHepler({
      message: getTextWithLanguage({
        en: "Update device setting successfully",
        vi: "Cập nhật cài đặt thiết bị thành công",
      }),
      type: "success",
    });
  }

  function toastUpdateCommentWalkConfig() {
    toastHepler({
      message: getTextWithLanguage({
        en: "Update comment walk config successfully",
        vi: "Cập nhật cài đặt bình luận dạo thành công",
      }),
      type: "success",
    });
  }

  const handleUpdatePostConfig = async <K extends keyof PostConfig>(
    key: K,
    value: PostConfig[K],
  ) => {
    try {
      return await deviceService.updatePostConfig({
        key,
        value,
        device_id: deviceId,
      });
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to update post config",
          vi: "Lỗi cập nhật cài đặt bài đăng",
        }),
      );
    }
  };

  const hanldeUpdateCommentWalkConfig = async <
    K extends keyof CommentWalkConfig,
  >(
    key: K,
    value: CommentWalkConfig[K],
  ) => {
    try {
      return await deviceService.updateCommentWalkConfig({
        key,
        value,
        device_id: deviceId,
      });
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to update comment walk config",
          vi: "Lỗi cập nhật cài đặt bình luận dạo",
        }),
      );
      return false;
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

      const promiseArray: Promise<boolean>[] = [];

      for (const key in payload) {
        if (payload[key]) {
          promiseArray.push(
            handleUpdatePostConfig(key as keyof PostConfig, payload[key]),
          );
        }
      }
      await Promise.all(promiseArray);
      toastHepler({
        message: getTextWithLanguage({
          en: "Update time delay successfully",
          vi: "Cập nhật thời gian nghỉ thành công",
        }),
        type: "success",
      });
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to update time delay",
          vi: "Lỗi cập nhật thời gian nghỉ",
        }),
      );
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
      setPostConfig(res.post_config);
      setCommentWalkConfig(res.comment_walk_config);
      setOpenDialogSyncDevice(false);
      toastHepler({
        message: getTextWithLanguage({
          en: "Sync device setting successfully, please reload page",
          vi: "Đồng bộ cài đặt thiết bị thành công, vui lòng tải lại trang để xem danh sách đã đồng bộ",
        }),
        type: "success",
      });
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to sync device setting",
          vi: "Lỗi đồng bộ cài đặt thiết bị",
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  const hanleSaveTimeDelayCommentWalk = async () => {
    try {
      const form = formTimeDelayCommentWalkConfigRef.current;
      if (!form) {
        return;
      }

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

      const promiseArray: Promise<boolean>[] = [];

      for (const key in payload) {
        if (payload[key]) {
          promiseArray.push(
            hanldeUpdateCommentWalkConfig(
              key as keyof CommentWalkConfig,
              payload[key],
            ),
          );
        }
      }

      await Promise.all(promiseArray);
      toastHepler({
        message: getTextWithLanguage({
          en: "Update time delay comment walk successfully",
          vi: "Cập nhật thời gian nghỉ bình luận dạo thành công",
        }),
        type: "success",
      });
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to update time delay comment walk",
          vi: "Lỗi cập nhật thời gian nghỉ bình luận dạo",
        }),
      );
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
        {getTextWithLanguage({
          en: "Something went wrong. Please try again later!",
          vi: "Đã xảy ra lỗi, vui lòng thử lại sau!",
        })}
      </div>
    );

  return (
    <div className="pr-4 w-full h-full overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-xl font-bold">
          {getTextWithLanguage({
            en: "Device Setting",
            vi: "Cài đặt thiết bị",
          })}
        </h2>
      </div>
      <div className="flex justify-end">
        <Button
          text={getTextWithLanguage({
            en: "Sync Device setting",
            vi: "Đồng bộ cài đặt thiết bị",
          })}
          variant="primary"
          size="md"
          className="rounded-sm"
          onClick={() => setOpenDialogSyncDevice(true)}
        />
      </div>
      <div className="flex flex-col gap-6 mb-6">
        <FieldComponent
          id="max-group-per-batch"
          label={getTextWithLanguage({
            vi: "Số nhóm tối đa mỗi đợt",
            en: "Max number of groups per batch",
          })}
          placeholder={getTextWithLanguage({ en: "Ex: 20", vi: "VD: 20" })}
          inputOptions={{
            min: 1,
            max: 100,
            defaultValue: deviceSetting?.post_config.max_group_per_batch,
          }}
          ref={inputMaxGroupPerBatchRef}
          onClickBtnSave={async () => {
            try {
              if (!inputMaxGroupPerBatchRef.current) return;
              const value = inputMaxGroupPerBatchRef.current.value;
              if (!value || !value.trim()) return;
              const valueNumber = Number(value);
              const ok = await handleUpdatePostConfig(
                "max_group_per_batch",
                valueNumber,
              );
              if (ok) {
                toastUpdatePostConfig();
              }
            } catch (error) {
              handleExceptionGlobal(
                error,
                getTextWithLanguage({
                  en: "Failed to update max group per batch",
                  vi: "Lỗi cập nhật số nhóm tối đa mỗi đợt",
                }),
              );
            }
          }}
        />

        <FieldComponent
          id="strictly-title-match-group"
          label={getTextWithLanguage({
            vi: "Từ khóa thứ hai cho việc lọc nhóm nghiêm ngặt",
            en: "Second keyword for strict group filtering",
          })}
          typeField="textarea"
          placeholder={getTextWithLanguage({
            vi: "Nhập cách nhau bằng dấu ','",
            en: "Enter keywords separated by commas",
          })}
          defaultValue={deviceSetting?.strictly_title_match_groups?.join(", ")}
          ref={inputStrictlyTitleMatchGroupsRef}
          onClickBtnSave={async () => {
            if (!inputStrictlyTitleMatchGroupsRef.current) return;
            const value = inputStrictlyTitleMatchGroupsRef.current.value;
            if (!value || !value.trim()) return;
            const valueArray = value.split(",").map((item) => item.trim());
            const ok = await handleUpdateDeviceSetting(
              "strictly_title_match_groups",
              valueArray,
            );
            if (ok) {
              toastUpdateDeviceSetting();
            }
          }}
        />

        <FieldComponent
          id="time-break-when-spammed"
          label={getTextWithLanguage({
            vi: "Thời gian nghỉ khi bị spam (ngày)",
            en: "Pause after a spam warning (days)",
          })}
          placeholder={getTextWithLanguage({ en: "Ex: 10", vi: "VD: 10" })}
          inputOptions={{
            min: 1,
            max: 60,
            defaultValue: deviceSetting?.time_break_when_spammed,
          }}
          ref={inputTimeBreakWhenSpammedRef}
          onClickBtnSave={async () => {
            if (!inputTimeBreakWhenSpammedRef.current) return;
            const value = inputTimeBreakWhenSpammedRef.current.value;
            if (!value || !value.trim()) return;
            const valueNumber = Number(value);
            const success = await handleUpdateDeviceSetting(
              "time_break_when_spammed",
              valueNumber,
            );
            if (success) {
              toastUpdateDeviceSetting();
            }
          }}
        />
      </div>
      <LabelSection
        title={getTextWithLanguage({
          vi: "Cài đặt nhanh",
          en: "Quick settings",
        })}
      />
      <div className="flex flex-col gap-4 mt-6 ml-6">
        <FieldComponent
          id="is_fix_steal_focus"
          label={getTextWithLanguage({
            en: "Fix steal focus",
            vi: "Tránh nhảy cửa sổ",
          })}
          typeField="checkbox"
          defaultValue={deviceSetting?.is_fix_steal_focus}
          onChange={(checked?: boolean) =>
            handleUpdateDeviceSetting("is_fix_steal_focus", checked)
          }
        />

        {getFeatureEnabled("fix_steal_all_focus") && (
          <FieldComponent
            id="is_fix_steal_all_focus"
            label={getTextWithLanguage({
              en: "Fix steal all focus",
              vi: "Tránh nhảy cửa sổ hoàn toàn",
            })}
            typeField="checkbox"
            defaultValue={deviceSetting?.is_fix_steal_all_focus}
            onChange={(checked?: boolean) =>
              handleUpdateDeviceSetting("is_fix_steal_all_focus", checked)
            }
          />
        )}

        {getFeatureEnabled("random_break_batch") && (
          <FieldComponent
            id="is_random_break_batch"
            label={getTextWithLanguage({
              en: "Random break batch",
              vi: "Nghỉ ngẫu nhiên giữa các đợt",
            })}
            typeField="checkbox"
            defaultValue={deviceSetting?.is_random_break_batch}
            onChange={(checked?: boolean) =>
              handleUpdateDeviceSetting("is_random_break_batch", checked)
            }
          />
        )}

        {getFeatureEnabled("random_time_task") && (
          <FieldComponent
            id="is_random_time_task"
            label={getTextWithLanguage({
              en: "Random time task",
              vi: "Thực hiện các tác vụ với thời gian ngẫu nhiên",
            })}
            typeField="checkbox"
            defaultValue={deviceSetting?.is_random_time_task}
            onChange={(checked?: boolean) =>
              handleUpdateDeviceSetting("is_random_time_task", checked)
            }
          />
        )}

        <FieldComponent
          id="is_shuffle_group_need_post"
          label={getTextWithLanguage({
            en: "Shuffle group need post",
            vi: "Trộn nhóm cần đăng",
          })}
          typeField="checkbox"
          defaultValue={deviceSetting?.post_config.is_shuffle_group_need_post}
          onChange={(checked?: boolean) =>
            handleUpdatePostConfig("is_shuffle_group_need_post", checked)
          }
        />

        {getFeatureEnabled("special_frame_hours") && (
          <FieldComponent
            id="is_special_frame_hours"
            label={getTextWithLanguage({
              en: "Special frame hours",
              vi: "Khung giờ đặc biệt",
            })}
            typeField="checkbox"
            defaultValue={deviceSetting?.is_special_frame_hours}
            onChange={(checked?: boolean) =>
              handleUpdateDeviceSetting("is_special_frame_hours", checked)
            }
          />
        )}

        <FieldComponent
          id="is_scheduler"
          label={getTextWithLanguage({ en: "Scheduler", vi: "Lịch chạy" })}
          typeField="checkbox"
          defaultValue={deviceSetting?.is_scheduler}
          onChange={(checked?: boolean) =>
            handleUpdateDeviceSetting("is_scheduler", checked)
          }
        />

        <FieldComponent
          id="is_comment_when_post"
          label={getTextWithLanguage({
            en: "Comment when post",
            vi: "Bình luận sau khi đăng bài",
          })}
          typeField="checkbox"
          defaultValue={deviceSetting?.is_comment_when_post}
          onChange={(checked?: boolean) =>
            handleUpdateDeviceSetting("is_comment_when_post", checked)
          }
        />

        <FieldComponent
          id="is_interact_batch"
          label={getTextWithLanguage({
            en: "Interact before post",
            vi: "Tương tác trước khi đăng bài",
          })}
          typeField="checkbox"
          defaultValue={deviceSetting?.is_interact_batch}
          onChange={(checked?: boolean) =>
            handleUpdateDeviceSetting("is_interact_batch", checked)
          }
        />

        {getFeatureEnabled("comment_walk") && (
          <FieldComponent
            id="is_comment_walk"
            label={getTextWithLanguage({
              en: "Comment walk",
              vi: "Bình luận dạo",
            })}
            typeField="checkbox"
            defaultValue={deviceSetting?.comment_walk_config.is_comment_walk}
            onChange={(checked?: boolean) =>
              hanldeUpdateCommentWalkConfig("is_comment_walk", checked)
            }
          />
        )}

        <FieldComponent
          id="is_remote"
          label={getTextWithLanguage({ en: "Remote", vi: "Điều khiển từ xa" })}
          typeField="checkbox"
          defaultValue={deviceSetting?.is_remote_control}
          onChange={(checked?: boolean) =>
            handleUpdateDeviceSetting("is_remote_control", checked)
          }
        />
      </div>

      <LabelSection
        title={getTextWithLanguage({
          vi: "Thời gian trễ khi đăng bài",
          en: "Posting delays",
        })}
        className="mt-6"
      />
      <form
        ref={formTimeDelayRef}
        className="ml-6 mt-4 max-w-86 flex flex-col gap-4"
      >
        <FieldComponent
          id="time_delay_click_to_post"
          label={getTextWithLanguage({
            en: "Delay time click to open dialog post (s)",
            vi: "Thời gian chờ mở hộp thoại đăng bài (giây)",
          })}
          name="name_time_delay_click_to_post"
          typeField="text"
          typeInput="number"
          defaultValue={deviceSetting.post_config.time_delay_click_to_post}
          showBtnSave={false}
          className="max-w-full"
        />

        <FieldComponent
          id="time_delay_fill_content"
          label={getTextWithLanguage({
            en: "Delay time fill content (s)",
            vi: "Thời gian chờ nhập nội dung (giây)",
          })}
          name="name_time_delay_fill_content"
          typeField="text"
          typeInput="number"
          defaultValue={deviceSetting.post_config.time_delay_fill_content}
          showBtnSave={false}
          className="max-w-full"
        />

        <FieldComponent
          id="time_delay_click_file"
          label={getTextWithLanguage({
            en: "Delay time click to select file (s)",
            vi: "Thời gian chờ chọn tệp (giây)",
          })}
          name="name_time_delay_click_file"
          typeField="text"
          typeInput="number"
          defaultValue={deviceSetting.post_config.time_delay_fill_file}
          showBtnSave={false}
          className="max-w-full"
        />

        <FieldComponent
          id="time_delay_click_post"
          label={getTextWithLanguage({
            en: "Delay time click to post (s)",
            vi: "Thời gian chờ nhấn đăng bài (giây)",
          })}
          name="name_time_delay_click_post"
          typeField="text"
          typeInput="number"
          defaultValue={deviceSetting.post_config.time_delay_post}
          showBtnSave={false}
          className="max-w-full"
        />

        <FieldComponent
          id="time_delay_open_new_tab"
          label={getTextWithLanguage({
            en: "Delay time open new tab (s)",
            vi: "Thời gian chờ mở thẻ mới (giây)",
          })}
          name="name_time_delay_open_new_tab"
          typeField="text"
          typeInput="number"
          defaultValue={deviceSetting.post_config.time_delay_open_new_tab}
          showBtnSave={false}
          className="max-w-full"
        />

        <div className="flex justify-end">
          <Button
            text={getTextWithLanguage({
              vi: "Lưu cài đặt thời gian trễ",
              en: "Save posting delays",
            })}
            variant="primary"
            className="rounded-sm"
            size="md"
            onClick={handleSaveTimeDelay}
          />
        </div>
      </form>

      {getFeatureEnabled("comment_walk") && (
        <div>
          <LabelSection
            title={getTextWithLanguage({
              vi: "Cài đặt bình luận dạo",
              en: "Comment walk settings",
            })}
            className="mt-6"
          />

          <form
            ref={formCommentWalkConfigRef}
            className="flex flex-col gap-8 mt-6 ml-6"
          >
            <FieldComponent
              id="is_interact_before_comment_walk"
              label={getTextWithLanguage({
                vi: "Tương tác trước khi bình luận",
                en: "Interact before comment walk",
              })}
              name="is_interact_before_comment_walk"
              typeField="checkbox"
              value={commentWalkConfig?.is_interact_before_comment_walk}
              controlled={true}
              onChange={async (checked?: boolean) => {
                try {
                  const success = await hanldeUpdateCommentWalkConfig(
                    "is_interact_before_comment_walk",
                    checked,
                  );
                  if (success) {
                    setCommentWalkConfig({
                      ...commentWalkConfig!,
                      is_interact_before_comment_walk: checked,
                    });
                    toastUpdateCommentWalkConfig();
                  }
                } catch (error) {
                  handleExceptionGlobal(
                    error,
                    getTextWithLanguage({
                      en: "Failed to update interact before comment walk",
                      vi: "Lỗi khi cập nhật tương tác trước khi bình luận",
                    }),
                  );
                }
              }}
            />

            <FieldComponent
              id="is_skip_post_not_in_group"
              label={getTextWithLanguage({
                vi: "Bỏ qua bài viết không ở trong nhóm",
                en: "Skip posts not in group",
              })}
              name="is_skip_post_not_in_group"
              typeField="checkbox"
              value={commentWalkConfig?.is_skip_post_not_in_group}
              controlled={true}
              onChange={async (checked?: boolean) => {
                try {
                  const success = await hanldeUpdateCommentWalkConfig(
                    "is_skip_post_not_in_group",
                    checked,
                  );
                  if (success) {
                    setCommentWalkConfig({
                      ...commentWalkConfig!,
                      is_skip_post_not_in_group: checked,
                    });
                    toastUpdateCommentWalkConfig();
                  }
                } catch (error) {
                  handleExceptionGlobal(
                    error,
                    getTextWithLanguage({
                      en: "Failed to update skip post not in group",
                      vi: "Lỗi khi cập nhật bỏ qua bài viết không ở trong nhóm",
                    }),
                  );
                }
              }}
            />

            <FieldComponent
              id="is_combine_keywords_title_group"
              label={getTextWithLanguage({
                vi: "Kết hợp từ khóa tiêu đề nhóm",
                en: "Combine keywords title group",
              })}
              name="is_combine_keywords_title_group"
              typeField="checkbox"
              controlled={true}
              value={commentWalkConfig?.is_combine_keywords_title_group}
              onChange={async (checked?: boolean) => {
                try {
                  const success = await hanldeUpdateCommentWalkConfig(
                    "is_combine_keywords_title_group",
                    checked,
                  );
                  if (success) {
                    setCommentWalkConfig({
                      ...commentWalkConfig!,
                      is_combine_keywords_title_group: checked,
                    });
                    toastUpdateCommentWalkConfig();
                  }
                } catch (error) {
                  handleExceptionGlobal(
                    error,
                    getTextWithLanguage({
                      en: "Failed to update combine keywords title group",
                      vi: "Lỗi khi cập nhật kết hợp từ khóa tiêu đề nhóm",
                    }),
                  );
                }
              }}
            />

            <FieldComponent
              id="is_ai_help_comment_walk"
              label={getTextWithLanguage({
                vi: "Sử dụng AI hỗ trợ",
                en: "Use AI assistance",
              })}
              typeField="checkbox"
              controlled
              value={commentWalkConfig.is_ai_help_comment_walk}
              onChange={async (checked?: boolean) => {
                try {
                  const success = await hanldeUpdateCommentWalkConfig(
                    "is_ai_help_comment_walk",
                    checked,
                  );

                  if (success) {
                    if (checked) {
                      await Promise.all([
                        hanldeUpdateCommentWalkConfig(
                          "is_combine_keywords_title_group",
                          true,
                        ),
                        hanldeUpdateCommentWalkConfig(
                          "is_skip_post_not_in_group",
                          true,
                        ),
                      ]);

                      setCommentWalkConfig({
                        ...commentWalkConfig!,
                        is_combine_keywords_title_group: true,
                        is_skip_post_not_in_group: true,
                        is_ai_help_comment_walk: checked,
                      });
                    } else {
                      setCommentWalkConfig({
                        ...commentWalkConfig!,
                        is_ai_help_comment_walk: checked,
                      });
                    }
                    toastUpdateCommentWalkConfig();
                  }
                } catch (error) {
                  handleExceptionGlobal(
                    error,
                    getTextWithLanguage({
                      en: "Failed to update AI help comment walk",
                      vi: "Lỗi khi cập nhật AI hỗ trợ bình luận",
                    }),
                  );
                }
              }}
            />

            <div className="flex gap-8 items-center">
              <div className="max-w-60 w-full">
                <Label className="font-normal my-2">
                  {getTextWithLanguage({
                    vi: "Chọn khu vực bình luận",
                    en: "Select comment area",
                  })}
                </Label>
                <Select
                  value={commentWalkConfig.comment_walk_area}
                  onValueChange={async (val) => {
                    try {
                      const success = await hanldeUpdateCommentWalkConfig(
                        "comment_walk_area",
                        val,
                      );

                      if (success) {
                        setCommentWalkConfig({
                          ...commentWalkConfig!,
                          comment_walk_area: val,
                        });
                        toastUpdateCommentWalkConfig();
                      }
                    } catch (error) {
                      handleExceptionGlobal(
                        error,
                        getTextWithLanguage({
                          en: "Failed to update comment walk area",
                          vi: "Lỗi khi cập nhật khu vực bình luận",
                        }),
                      );
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={getTextWithLanguage({
                        vi: "Chọn khu vực bình luận",
                        en: "Select comment area",
                      })}
                    >
                      {deviceService.getLabelCommentWalkArea(
                        commentWalkConfig.comment_walk_area,
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {deviceService.getListCommentWalkArea().map((area) => (
                      <SelectItem key={area} value={area}>
                        {deviceService.getLabelCommentWalkArea(area)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="max-w-60 w-full">
                <Label className="font-normal my-2">
                  {getTextWithLanguage({
                    vi: "Chọn tốc độ bình luận",
                    en: "Select comment speed",
                  })}
                </Label>
                <Select
                  value={commentWalkConfig.comment_walk_speed}
                  onValueChange={async (val) => {
                    try {
                      const success = await hanldeUpdateCommentWalkConfig(
                        "comment_walk_speed",
                        val,
                      );

                      if (success) {
                        setCommentWalkConfig({
                          ...commentWalkConfig!,
                          comment_walk_speed: val,
                        });
                        toastUpdateCommentWalkConfig();
                      }
                    } catch (error) {
                      handleExceptionGlobal(
                        error,
                        getTextWithLanguage({
                          en: "Failed to update comment walk speed",
                          vi: "Lỗi khi cập nhật tốc độ bình luận",
                        }),
                      );
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={getTextWithLanguage({
                        vi: "Chọn tốc độ bình luận",
                        en: "Select comment speed",
                      })}
                    >
                      {deviceService.getLabelCommentWalkSpeed(
                        commentWalkConfig.comment_walk_speed,
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {deviceService.getListCommentWalkSpeed().map((speed) => (
                      <SelectItem key={speed} value={speed}>
                        {deviceService.getLabelCommentWalkSpeed(speed)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <FieldComponent
              id="max-comment-walk-per-batch"
              label={getTextWithLanguage({
                vi: "Số bình luận tối đa mỗi đợt",
                en: "Max number of comments per batch",
              })}
              placeholder={getTextWithLanguage({ en: "Ex: 20", vi: "VD: 20" })}
              inputOptions={{
                min: 1,
                max: 100,
                defaultValue: commentWalkConfig?.max_comment_walk_per_batch,
              }}
              onClickBtnSave={async (value) => {
                if (value && value.toString().trim().length) {
                  const success = await hanldeUpdateCommentWalkConfig(
                    "max_comment_walk_per_batch",
                    Number(value),
                  );
                  if (success) {
                    toastUpdateCommentWalkConfig();
                  }
                }
              }}
            />

            <FieldComponent
              id="keywords-certain-choice-comment-walk"
              label={getTextWithLanguage({
                vi: "Từ khóa chắc chắn chọn khi xuất hiện (chỉ dành cho khu vực trang chủ) (cách nhau bằng dấu phẩy ',')",
                en: "Always-match keywords (home feed only, comma-separated)",
              })}
              placeholder={getTextWithLanguage({
                en: "Ex: keyword 1, keyword 2, keyword 3",
                vi: "VD: từ khóa 1, từ khóa 2, từ khóa 3",
              })}
              typeField="textarea"
              defaultValue={deviceSetting?.comment_walk_config.keywords_certain_choice_comment_walk.join(
                ", ",
              )}
              onClickBtnSave={async (value) => {
                if (value && value.toString().trim().length) {
                  const success = await hanldeUpdateCommentWalkConfig(
                    "keywords_certain_choice_comment_walk",
                    splitString(value.toString()),
                  );
                  if (success) {
                    toastUpdateCommentWalkConfig();
                  }
                }
              }}
            />

            <FieldComponent
              id="match-rate-value-content-query-includes-common-comment-walk"
              label={getTextWithLanguage({
                vi: "Tỷ lệ khớp từ khóa trong nội dung (Khi bình luận dạo):",
                en: "Required keyword match rate for comment walk",
              })}
              placeholder={getTextWithLanguage({ en: "Ex: 2", vi: "VD: 2" })}
              defaultValue={
                deviceSetting?.comment_walk_config
                  .match_rate_value_content_query_includes_common_comment_walk
              }
              onClickBtnSave={async (value) => {
                if (value && value.toString().trim().length) {
                  const success = await hanldeUpdateCommentWalkConfig(
                    "match_rate_value_content_query_includes_common_comment_walk",
                    Number(value),
                  );
                  if (success) {
                    toastUpdateCommentWalkConfig();
                  }
                }
              }}
            />

            <FieldComponent
              id="content-query-includes-common-comment-walk"
              label={getTextWithLanguage({
                vi: "Các từ khóa có trong nội dung bình luận dạo (cách nhau bằng dấu phẩy ','):",
                en: "Required keywords for comment walk (comma-separated)",
              })}
              placeholder={getTextWithLanguage({
                en: "Ex: keyword 1, keyword 2, keyword 3",
                vi: "VD: từ khóa 1, từ khóa 2, từ khóa 3",
              })}
              typeField="textarea"
              defaultValue={deviceSetting?.comment_walk_config.content_query_includes_common_comment_walk.join(
                ", ",
              )}
              onClickBtnSave={async (value) => {
                if (value && value.toString().trim().length) {
                  const success = await hanldeUpdateCommentWalkConfig(
                    "content_query_includes_common_comment_walk",
                    splitString(value.toString()),
                  );
                  if (success) {
                    toastUpdateCommentWalkConfig();
                  }
                }
              }}
            />
            <FieldComponent
              id="content-query-excludes-common-comment-walk"
              label={getTextWithLanguage({
                vi: "Các từ khóa loại trừ trong nội dung bình luận dạo (cách nhau bằng dấu phẩy ','):",
                en: "Excluded keywords for comment walk (comma-separated)",
              })}
              placeholder={getTextWithLanguage({
                en: "Ex: keyword 1, keyword 2, keyword 3",
                vi: "VD: từ khóa 1, từ khóa 2, từ khóa 3",
              })}
              typeField="textarea"
              defaultValue={deviceSetting?.comment_walk_config.content_query_excludes_common_comment_walk.join(
                ", ",
              )}
              onClickBtnSave={async (value) => {
                if (value && value.toString().trim().length) {
                  const success = await hanldeUpdateCommentWalkConfig(
                    "content_query_excludes_common_comment_walk",
                    splitString(value.toString()),
                  );
                  if (success) {
                    toastUpdateCommentWalkConfig();
                  }
                }
              }}
            />
          </form>

          <LabelSection
            title={getTextWithLanguage({
              vi: "Cài đặt thời gian trễ khi bình luận dạo",
              en: "Comment walk delays",
            })}
            className="mt-6"
          />
          <form
            ref={formTimeDelayCommentWalkConfigRef}
            className="ml-6 mt-4 max-w-86 flex flex-col gap-4"
          >
            <FieldComponent
              id="time-delay-fill-content-comment-walk-min"
              label={getTextWithLanguage({
                vi: "Thời gian nhập nội dung min (s) [min, max] (Bắt buộc):",
                en: "Minimum content entry time (seconds, required)",
              })}
              name="time_delay_fill_content_comment_walk_min"
              typeField="text"
              typeInput="number"
              defaultValue={
                deviceSetting.comment_walk_config
                  .time_delay_fill_content_comment_walk_min
              }
              showBtnSave={false}
              className="max-w-full"
            />

            <FieldComponent
              id="time-delay-fill-content-comment-walk-max"
              label={getTextWithLanguage({
                vi: "Thời gian nhập nội dung max (s) [min, max] (Bắt buộc):",
                en: "Maximum content entry time (seconds, required)",
              })}
              name="time_delay_fill_content_comment_walk_max"
              typeField="text"
              typeInput="number"
              defaultValue={
                deviceSetting.comment_walk_config
                  .time_delay_fill_content_comment_walk_max
              }
              showBtnSave={false}
              className="max-w-full"
            />

            <FieldComponent
              id="time-delay-fill-file-comment-walk"
              label={getTextWithLanguage({
                vi: "Thời gian nhập file (s):",
                en: "Attachment entry delay (seconds):",
              })}
              name="time_delay_fill_file_comment_walk"
              typeField="text"
              typeInput="number"
              defaultValue={
                deviceSetting.comment_walk_config
                  .time_delay_fill_file_comment_walk
              }
              showBtnSave={false}
              className="max-w-full"
            />

            <FieldComponent
              id="time-delay-submit-comment-walk"
              label={getTextWithLanguage({
                vi: "Thời gian gửi bình luận (giây):",
                en: "Submit delay (seconds):",
              })}
              name="time_delay_submit_comment_walk"
              typeField="text"
              typeInput="number"
              defaultValue={
                deviceSetting.comment_walk_config.time_delay_submit_comment_walk
              }
              showBtnSave={false}
              className="max-w-full"
            />

            <div className="flex justify-end">
              <Button
                text={getTextWithLanguage({
                  vi: "Lưu cài đặt bình luận dạo",
                  en: "Save comment walk settings",
                })}
                variant="primary"
                className="rounded-sm"
                size="md"
                onClick={hanleSaveTimeDelayCommentWalk}
              />
            </div>
          </form>
        </div>
      )}

      <DialogSyncDevieSetting
        open={openDialogSyncDevice}
        onOpenChange={setOpenDialogSyncDevice}
        onSyncDevice={handleSyncDeviceSetting}
      />
    </div>
  );
}

type FieldProps = {
  id: string;
  name?: string;
  label?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue?: any;
  ref?: React.RefObject<HTMLElement>;
  onChange?: (value?: boolean | string | number) => void;
  typeField?: "text" | "textarea" | "checkbox";
  typeInput?: "text" | "number";
  showBtnSave?: boolean;
  btnSaveText?: string;
  onClickBtnSave?: (value?: string | number) => void;
  placeholder?: string;
  inputOptions?: InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>;
  className?: string;
  value?: boolean | string | number;
  controlled?: boolean;
};

function FieldComponent(props: FieldProps) {
  useLanguage();
  const {
    id,
    name,
    label,
    defaultValue,
    ref,
    onChange,
    typeField = "text",
    typeInput = "number",
    showBtnSave = true,
    btnSaveText = getTextWithLanguage({ en: "Save", vi: "Lưu" }),
    onClickBtnSave,
    placeholder = "",
    inputOptions,
    className,
    value,
    controlled,
  } = props;

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  if (typeField === "textarea") {
    return (
      <Field>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <Textarea
          id={id}
          placeholder={placeholder}
          defaultValue={defaultValue}
          ref={(r) => {
            if (ref) {
              ref.current = r;
            }
            inputRef.current = r as HTMLTextAreaElement;
          }}
          name={name}
          onChange={(e) => {
            const value = e.target.value;
            onChange?.(value as string);
          }}
          {...(inputOptions as InputHTMLAttributes<HTMLTextAreaElement>)}
        />
        <FieldDescription className="flex items-center justify-end">
          {showBtnSave && (
            <Button
              text={btnSaveText}
              variant="primary"
              className="rounded-sm"
              size="md"
              onClick={() => {
                onClickBtnSave?.(inputRef.current?.value);
              }}
            />
          )}
        </FieldDescription>
      </Field>
    );
  }

  if (typeField === "checkbox") {
    return controlled ? (
      <Field orientation="horizontal">
        <Checkbox
          id={id}
          className={"size-4.5"}
          checked={(value as boolean) || false}
          onCheckedChange={onChange}
          name={name}
          ref={(r) => {
            if (ref) {
              ref.current = r;
            }
            inputRef.current = r as HTMLInputElement;
          }}
        />
        <FieldLabel htmlFor={id} className="text-base font-medium">
          {label}
        </FieldLabel>
      </Field>
    ) : (
      <Field orientation="horizontal">
        <Checkbox
          id={id}
          className={"size-4.5"}
          defaultChecked={defaultValue}
          onCheckedChange={onChange}
          name={name}
          ref={(r) => {
            if (ref) {
              ref.current = r;
            }
            inputRef.current = r as HTMLInputElement;
          }}
        />
        <FieldLabel htmlFor={id} className="text-base font-medium">
          {label}
        </FieldLabel>
      </Field>
    );
  }

  return (
    <Field className={className ? className : "max-w-80"}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="flex items-center gap-2">
        <Input
          id={id}
          name={name}
          type={typeInput}
          placeholder={placeholder}
          defaultValue={defaultValue}
          ref={(r) => {
            if (ref) {
              ref.current = r;
            }
            inputRef.current = r as HTMLInputElement;
          }}
          onChange={(e) => {
            const value = e.target.value;
            onChange?.(value as string);
          }}
          {...inputOptions}
        />
        {showBtnSave && (
          <Button
            variant="primary"
            text={btnSaveText}
            className="rounded-sm"
            size="md"
            onClick={() => {
              onClickBtnSave?.(inputRef.current?.value);
            }}
          />
        )}
      </div>
    </Field>
  );
}
