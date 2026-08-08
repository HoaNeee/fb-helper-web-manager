import { get } from "@/utils/api-request";

type DeviceStatus = "ONLINE" | "OFFLINE" | "SPAMMED" | "RUNNING";

export interface Device {
  id: string;
  device_name: string;
  device_type: string;
  status: DeviceStatus;
  created_at: string;
}

export interface DeviceSetting {
  device_id: string;
  is_fix_steal_focus: boolean;
  is_fix_steal_all_focus: boolean;
  is_random_break_batch: boolean;
  is_random_time_post: boolean;
  is_shuffle_group_need_post: boolean;
  is_special_frame_hours: boolean;
  is_scheduler: boolean;
  max_group_per_batch: number;
  strictly_title_match_groups: string[];
  is_spammed: boolean;
  is_comment_when_post: boolean;
  is_interact_batch: boolean;
  time_delay_click_to_post: number;
  time_delay_fill_content: number;
  time_delay_fill_file: number;
  time_delay_post: number;
  time_delay_open_new_tab: number;
  last_time_post: number;
}

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
};

export default deviceService;
