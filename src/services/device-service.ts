import getTextWithLanguage from "@/helpers/language";
import type {
  CommentWalkConfig,
  Device,
  DeviceSetting,
  PostConfig,
} from "@/types/types";
import { get, patch, post } from "@/utils/api-request";

const deviceService = {
  async getAllDeviceByUser(): Promise<Array<Device>> {
    try {
      const res = await get("/devices");
      return res.data as Array<Device>;
    } catch (error) {
      throw error;
    }
  },

  async getDeviceSetting(device_id: string) {
    try {
      const res = await get(`/devices/settings/${device_id}`);
      return res.data as DeviceSetting;
    } catch (error) {
      throw error;
    }
  },

  async updateDeviceSetting<K extends keyof DeviceSetting>({
    key,
    value,
    device_id,
  }: {
    key: K;
    value: DeviceSetting[K];
    device_id: string;
  }) {
    try {
      await patch("/devices/settings", {
        [key]: value,
        device_id,
      });
      return true;
    } catch (error) {
      throw error;
    }
  },

  async updatePostConfig<K extends keyof PostConfig>({
    key,
    value,
    device_id,
  }: {
    key: K;
    value: PostConfig[K];
    device_id: string;
  }) {
    try {
      await patch("/devices/settings/post-config", {
        [key]: value,
        device_id,
      });
      return true;
    } catch (error) {
      throw error;
    }
  },

  async updateCommentWalkConfig<K extends keyof CommentWalkConfig>({
    key,
    value,
    device_id,
  }: {
    key: K;
    value: CommentWalkConfig[K];
    device_id: string;
  }) {
    try {
      await patch("/devices/settings/comment-walk-config", {
        [key]: value,
        device_id,
      });
      return true;
    } catch (error) {
      throw error;
    }
  },

  async syncDeviceSetting(current_device_id: string, target_device_id: string) {
    try {
      const res = await post("/devices/sync-device-setting", {
        current_device_id,
        target_device_id,
      });

      return res.data as DeviceSetting;
    } catch (error) {
      throw error;
    }
  },

  getListCommentWalkArea() {
    return ["HOME_PAGE", "SEARCH_PAGE", "RANDOM"];
  },

  getListCommentWalkSpeed() {
    return ["LOW", "NORMAL", "FAST"];
  },

  getLabelCommentWalkSpeed(speed: string) {
    switch (speed) {
      case "NORMAL":
        return getTextWithLanguage({
          vi: "Bình thường",
          en: "Normal",
        });
      case "FAST":
        return getTextWithLanguage({
          vi: "Nhanh",
          en: "Fast",
        });
      case "LOW":
        return getTextWithLanguage({
          vi: "Chậm",
          en: "Slow",
        });
      default:
        return "";
    }
  },

  getLabelCommentWalkArea(area: string) {
    switch (area) {
      case "HOME_PAGE":
        return getTextWithLanguage({
          vi: "Trang chủ",
          en: "Home page",
        });
      case "SEARCH_PAGE":
        return getTextWithLanguage({
          vi: "Trang tìm kiếm",
          en: "Search page",
        });
      case "RANDOM":
        return getTextWithLanguage({
          vi: "Ngẫu nhiên",
          en: "Random",
        });
      default:
        return "";
    }
  },
};

export default deviceService;
