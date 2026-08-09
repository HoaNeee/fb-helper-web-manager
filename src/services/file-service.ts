import { postImage } from "@/utils/api-request";

const fileService = {
	async uploadFile(file: File) {
		try {
			const res = await postImage({
				params: "/files/upload",
				files: [file],
				isMultiple: false,
			});
			return res.data;
		} catch (error) {
			throw error;
		}
	},
	async uploadFiles(files: File[]) {
		try {
			const res = await postImage({
				params: "/files/uploads",
				files: files,
				isMultiple: true,
			});
			return res.data as string[];
		} catch (error) {
			throw error;
		}
	},
};

export default fileService;
