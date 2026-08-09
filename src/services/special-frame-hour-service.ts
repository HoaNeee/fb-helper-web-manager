import { get } from "@/utils/api-request";

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
};

export {
	LIST_SPECIAL_FRAME_HOUR_DEFAULT,
	DEFAULT_LIST_DAY_OF_WEEK,
	specialFrameHourService,
};
