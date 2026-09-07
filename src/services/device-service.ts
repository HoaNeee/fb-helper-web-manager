import { get, patch, post } from "@/utils/api-request";

type DeviceStatus = "ONLINE" | "OFFLINE" | "SPAMMED" | "RUNNING";

export interface Device {
	id: string;
	device_name: string;
	device_type: string;
	status: DeviceStatus;
	created_at: string;
}

export interface PostConfig {
	max_group_per_batch: number;
	is_shuffle_group_need_post: boolean;
	time_delay_click_to_post: number;
	time_delay_fill_content: number;
	time_delay_fill_file: number;
	time_delay_post: number;
	time_delay_open_new_tab: number;
	last_time_post: number;
}

export interface CommentWalkConfig {
	is_comment_walk: boolean;
}

export interface DeviceSetting {
	device_id: string;
	strictly_title_match_groups: string[];

	is_fix_steal_focus: boolean;
	is_fix_steal_all_focus: boolean;
	is_random_break_batch: boolean;
	is_random_time_post: boolean;
	is_special_frame_hours: boolean;
	is_scheduler: boolean;
	is_spammed: boolean;
	is_comment_when_post: boolean;
	is_interact_batch: boolean;
	is_remote: boolean;

	post_config: PostConfig;
	comment_walk_config: CommentWalkConfig;
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
			console.log(res);
			return res.data as DeviceSetting;
		} catch (error) {
			throw error;
		}
	},
};

export default deviceService;
