import { del, get, patch, post } from "@/utils/api-request";

export interface DataGroupPost {
	id: string;
	title: string;
	name: string;
	contents: string[];
	files: string[];
	priority: number;
	from_member: number;
	to_member: number;
	is_active?: boolean;
}

const DEFAULT_LIST_DATA_GROUP_POST: Partial<DataGroupPost>[] = [
	{
		id: "1",
		title: "Data 1",
		name: "Data 1",
		priority: 1,
		contents: [
			'<p><strong>CĂN HỘ MINI STUDIO FULL ĐỒ CÓ BAN CÔNG - GIÁ 4TRX MỄ TRÌ</strong></p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Cho thuê phòng tại 50 Mễ Trì Thượng.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Studio khép kín, thang máy, phòng trống dọn vào luôn.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Thiết kế ban công thoáng, bếp tách ngủ, sẵn full nội thất.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Giờ giấc tự do, ra vào thoải mái, không chung chủ.</li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Nhà xe rộng, để xe miễn phí hàng tháng.</li></ol><p>Ib hoặc liên hệ hotline để xem phòng: 0339 005 642</p>',
			"<p>aaaaaa</p>",
		],
		files: [],
	},
	{
		id: "2",
		title: "Data 2",
		name: "Data 2",
		priority: 2,
		contents: ["<p>aaaaaa</p>", "<p>bbbb</p>"],
		files: [],
	},
	{
		id: "3",
		title: "Data 3",
		name: "Data 3",
		priority: 3,
		contents: ["<p>ddddd</p>"],
		files: [],
	},
];

const dataGroupPostService = {
	async getAllDataGroupPostByUser(): Promise<Array<DataGroupPost>> {
		try {
			const res = await get("/data-group-posts");
			return res.data as DataGroupPost[];
		} catch (error) {
			throw error;
		}
	},

	async getAllDataGroupPostByDevice(device_id: string) {
		try {
			const res = await get(`/data-group-posts/device/${device_id}`);
			return res.data as DataGroupPost[];
		} catch (error) {
			throw error;
		}
	},

	async addNewDataGroupPost(data_group_post: Partial<DataGroupPost>) {
		try {
			const res = await post("/data-group-posts", data_group_post);
			return res.data;
		} catch (error) {
			throw error;
		}
	},

	async getMaxPriority(): Promise<number> {
		try {
			const res = await get("/data-group-posts/get-max-priority");
			const max_priority = Number(res.data);
			return Number(max_priority) || 0;
		} catch (error) {
			throw error;
		}
	},

	async updateDataGroupPost(
		id: string,
		data_group_post: Partial<DataGroupPost>,
	) {
		try {
			const res = await patch(`/data-group-posts/${id}`, data_group_post);
			return res.data;
		} catch (error) {
			throw error;
		}
	},

	async updateChecked(
		data_group_post_id: string,
		device_id: string,
		checked: boolean,
	) {
		try {
			const payload = {
				is_active: checked,
				data_group_post_id,
				device_id,
			};

			await patch("/data-group-posts/details", payload);
			return true;
		} catch (error) {
			throw error;
		}
	},

	async deleteDataGroupPost(id: string) {
		try {
			await del(`/data-group-posts/${id}`);
			return true;
		} catch (error) {
			throw error;
		}
	},

	async importData(data: DataGroupPost[], device_id?: string) {
		try {
			const payload = {
				list_data_group_post: data,
			};
			if (device_id) {
				payload["device_id"] = device_id;
			}
			const res = await post("/data-group-posts/import-data", payload);
			return res.data as DataGroupPost[];
		} catch (error) {
			throw error;
		}
	},

	async clearAllDataGroupPost() {
		try {
			await del(`/data-group-posts/delete-all-data-group-post`);
			return true;
		} catch (error) {
			throw error;
		}
	},

	async updateStatusAllDevice(data_group_post_id: string, is_active: boolean) {
		try {
			const res = await patch(
				`/data-group-posts/update-status-all-device/${data_group_post_id}`,
				{
					is_active,
				},
			);
			return res.data;
		} catch (error) {
			throw error;
		}
	},

	async syncDeviceDataGroupPost(
		current_device_id: string,
		target_device_id: string,
	) {
		try {
			const payload = {
				current_device_id,
				target_device_id,
			};
			const res = await post(
				`/data-group-posts/sync-device-data-group-post`,
				payload,
			);
			return res.data as DataGroupPost[];
		} catch (error) {
			throw error;
		}
	},
};

export { DEFAULT_LIST_DATA_GROUP_POST, dataGroupPostService };
