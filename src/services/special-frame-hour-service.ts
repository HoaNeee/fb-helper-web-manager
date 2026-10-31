import { del, get, patch, post } from "@/utils/api-request";

export type SpecialFrameHour = {
  id: number;
  start_time: number;
  end_time: number;
  max_group: number;
  is_active?: boolean;
  apply_dates: number[];
};

const DEFAULT_LIST_DAY_OF_WEEK = [0, 1, 2, 3, 4, 5, 6];

const LIST_SPECIAL_FRAME_HOUR_DEFAULT: SpecialFrameHour[] = [
  {
    id: 1,
    start_time: 1,
    end_time: 3,
    max_group: 1,
    is_active: false,
    apply_dates: [1, 2, 3],
  },
  {
    id: 2,
    start_time: 3,
    end_time: 5,
    max_group: 2,
    is_active: true,
    apply_dates: [0, 1, 2, 3, 4, 5, 6],
  },
];

const specialFrameHourService = {
  async getListSpecialFrameHourByUser() {
    try {
      const res = await get(`/special-frame-hours`);
      return res.data as SpecialFrameHour[];
    } catch (error) {
      throw error;
    }
  },

  async getListSpecialFrameHourByDevice(device_id: string) {
    try {
      const res = await get(`/special-frame-hours/${device_id}`);
      return res.data as SpecialFrameHour[];
    } catch (error) {
      throw error;
    }
  },

  async updateChecked(id: number, checked: boolean, device_id: string) {
    try {
      await patch("/special-frame-hours/update-status/" + id, {
        device_id,
        is_active: checked,
      });
      return true;
    } catch (error) {
      throw error;
    }
  },

  async addNewSpecialFrameHour(
    data: Partial<SpecialFrameHour>,
    device_id?: string,
  ) {
    try {
      const payload = {
        ...data,
      };
      if (device_id) {
        payload["device_id"] = device_id;
      }
      const res = await post("/special-frame-hours", payload);
      return res.data as SpecialFrameHour;
    } catch (error) {
      throw error;
    }
  },

  async updateSpecialFrameHour(id: number, data: Partial<SpecialFrameHour>) {
    try {
      const res = await patch(`/special-frame-hours/${id}`, data);
      return res.data as SpecialFrameHour;
    } catch (error) {
      throw error;
    }
  },

  async deleteSpecialFrameHour(id: number) {
    try {
      await del(`/special-frame-hours/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  },

  async clearAllSpecialFrameHour() {
    try {
      await del("/special-frame-hours/delete-all");
      return true;
    } catch (error) {
      throw error;
    }
  },

  async updateCheckedAllDevice(id: number, isActive: boolean) {
    try {
      await patch("/special-frame-hours/update-status-all-device/" + id, {
        is_active: isActive,
      });
      return true;
    } catch (error) {
      throw error;
    }
  },
};

export {
  LIST_SPECIAL_FRAME_HOUR_DEFAULT,
  DEFAULT_LIST_DAY_OF_WEEK,
  specialFrameHourService,
};
