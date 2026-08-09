import { get } from "@/utils/api-request";

export type SchedulerTime = {
	h: number;
	m: number;
};

export type Scheduler = {
	id?: number;
	scheduler_type: SchedulerType;
	scheduler_detail: SchedulerDetail;
	device_id: string;
};

export type SchedulerDetail = {
	id?: number;
	scheduler_id?: number;
	scheduler_type: string;
	scheduler_time_value: number;
	scheduler_time_list: SchedulerTime[];
};

export type SchedulerType =
	| "EVERY_MINUTES"
	| "EVERY_HOURS"
	| "CUSTOM_DAILY_MINUTES"
	| "CUSTOM_DAILY_HOURS"
	| "DAILY_HOURS"
	| "FRAME_HOURS";

const schedulerService = {
	async getSchedulerByDevice(device_id: string) {
		try {
			const res = await get(`/schedulers/${device_id}`);
			return res.data as Scheduler;
		} catch (error) {
			throw error;
		}
	},
	async getSchedulerDetail(scheduler_type: SchedulerType, device_id: string) {
		try {
			const res = await get(
				`/schedulers/details/${scheduler_type}/${device_id}`,
			);
			console.log(res);
			return res.data as SchedulerDetail;
		} catch (error) {
			throw error;
		}
	},
};

export { schedulerService };
