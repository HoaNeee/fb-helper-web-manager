import type { TypeBase64 } from "@/components/types/types";
import {
	dataGroupPostService,
	type DataGroupPost,
} from "@/services/data-group-post-service";
import fileService from "@/services/file-service";
import {
	parseBase64ToFile,
	parseBlobToFile,
	parseFileToObjectBase64,
	parseUrlToBlob,
} from "@/utils/utils";

async function handleImportDataGroupPost(
	callBack?: (data: DataGroupPost[]) => void,
) {
	try {
		const a = document.createElement("input");
		a.type = "file";
		a.accept = ".json";
		a.onchange = (e: Event) => {
			try {
				const file = (e.target as HTMLInputElement).files?.[0];
				if (file) {
					const reader = new FileReader();
					reader.onload = async (e) => {
						try {
							const json = JSON.parse(e.target?.result as string);
							const clean = await handleCleanDataGroupPost(json);
							const res = await dataGroupPostService.importData(
								Array.isArray(clean) ? clean : [clean],
							);
							callBack?.(res);
						} catch (error) {
							throw error;
						}
					};
					reader.readAsText(file);
				} else {
					callBack?.([]);
				}
			} catch (error) {
				throw error;
			}
		};
		a.oncancel = () => {
			callBack?.([]);
		};
		a.click();
	} catch (error) {
		throw error;
	}
}

async function handleCleanDataGroupPost(data: any) {
	try {
		if (Array.isArray(data)) {
			return await Promise.all(
				data.map((item) => handleCleanDataGroupPost(item)),
			);
		}

		const listObjectBase64 = data.files as TypeBase64[];
		const files = listObjectBase64.map((obj) => {
			return parseBase64ToFile(obj);
		});

		const urls = await fileService.uploadFiles(files);

		const dataClean: Partial<DataGroupPost> = {
			title: data.title,
			name: data.name,
			contents: data.contents,
			files: urls,
			priority: data?.priority || 1,
			from_member: data?.from_member || 0,
			to_member: data?.to_member || 0,
		};
		return dataClean;
	} catch (error) {
		throw error;
	}
}

async function handleExportDataGroupPost(data: any) {
	try {
		let dataExport = null;

		async function handleSolveItem(item: any) {
			const urls = item.files as string[];
			const listObjectBase64 = await Promise.all(
				urls.map(async (url) =>
					parseFileToObjectBase64(
						parseBlobToFile(await parseUrlToBlob(url), url),
					),
				),
			);

			return {
				title: item.title,
				name: item.name,
				contents: item.contents,
				priority: item.priority,
				from_member: item.from_member,
				to_member: item.to_member,
				files: listObjectBase64,
			};
		}

		if (Array.isArray(data)) {
			dataExport = await Promise.all(
				data.map(async (item) => {
					return await handleSolveItem(item);
				}),
			);
		} else {
			dataExport = await handleSolveItem(data);
		}

		const json = JSON.stringify(dataExport);
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		if (Array.isArray(dataExport)) {
			const date = new Date().toLocaleString("vi-VN");
			const name = date.replaceAll(/[/\s:-]/g, "_");
			a.download = `list_data_group_post_${name}.json`;
		} else {
			a.download = `data_group_post_for_${data?.name || data.title}.json`;
		}
		a.click();
	} catch (error) {
		console.log(error);
	}
}

export { handleImportDataGroupPost, handleExportDataGroupPost };
