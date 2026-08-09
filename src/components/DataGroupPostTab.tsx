import {
	dataGroupPostService,
	DEFAULT_LIST_DATA_GROUP_POST,
	type DataGroupPost,
} from "@/services/data-group-post-service";
import { Eye, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Button from "./Button";
import DialogAddOrUpdateDataGroupPost from "./dialogs/DialogAddOrUpdateDataGroupPost";
import { Checkbox } from "./ui/checkbox";
import { Field, FieldLabel } from "./ui/field";
import Loading from "./Loading";
import DialogConfirm from "./dialogs/DialogConfirm";
import {
	handleExportDataGroupPost,
	handleImportDataGroupPost,
} from "@/helpers/data-group-post";
import { useParams } from "react-router";

export default function DataGroupPostTab() {
	const [dataGroupPosts, setDataGroupPosts] = useState<
		Partial<DataGroupPost>[]
	>(DEFAULT_LIST_DATA_GROUP_POST);
	const [openDialogViewDetail, setOpenDialogViewDetail] = useState(false);
	const [openAdd, setOpenAdd] = useState(false);
	const [loading, setLoading] = useState(true);
	const [actionLoading, setActionLoading] = useState(false);

	const [dataGroupPostSeleted, setDataGroupPostSeleted] =
		useState<Partial<DataGroupPost>>();

	const params = useParams<{ deviceId: string }>();
	const deviceId = params.deviceId;

	useEffect(() => {
		async function fn() {
			try {
				setLoading(true);
				const res = await dataGroupPostService.getAllDataGroupPostByDevice(
					params.deviceId,
				);
				setDataGroupPosts(res);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		}
		fn();
	}, []);

	useEffect(() => {
		if (!openDialogViewDetail) {
			setDataGroupPostSeleted(undefined);
		}
	}, [openDialogViewDetail]);

	const handleOnsubmit = useCallback(
		(mode: "edit" | "add", payload: Partial<DataGroupPost>) => {
			if (mode === "add") {
				setDataGroupPosts((prev) => [...prev, payload]);
				setOpenAdd(false);
				return;
			}

			const id = payload?.id;

			const newList = dataGroupPosts.map((dgp) => {
				if (dgp.id === id) {
					return payload;
				}
				return dgp;
			});

			setDataGroupPosts(newList);

			setOpenDialogViewDetail(false);
		},
		[dataGroupPosts],
	);

	const handleDelete = async (id: string) => {
		try {
			setActionLoading(true);
			await dataGroupPostService.deleteDataGroupPost(id);
			setDataGroupPosts((prev) => prev.filter((dgp) => dgp.id !== id));
		} catch (error) {
			console.log(error);
		} finally {
			setActionLoading(false);
		}
	};

	const handleClearAll = async () => {
		try {
			setActionLoading(true);
			await dataGroupPostService.clearAllDataGroupPost();
			setDataGroupPosts([]);
		} catch (error) {
			console.log(error);
		} finally {
			setActionLoading(false);
		}
	};

	const handleImport = async () => {
		try {
			setActionLoading(true);
			await handleImportDataGroupPost((data) => {
				setDataGroupPosts((prev) => [...prev, ...data]);
				setActionLoading(false);
			});
		} catch (error) {
			setActionLoading(false);
			console.log(error);
		}
	};

	const handleCheckedChange = async (
		data_group_post_id: string,
		checked: boolean,
	) => {
		try {
			const sucess = await dataGroupPostService.updateChecked(
				data_group_post_id,
				deviceId,
				checked,
			);
			if (sucess) {
				//do some thing or no
			}
		} catch (error) {
			console.log(error);
		}
	};

	if (loading) {
		return <Loading type="page" />;
	}

	return (
		<>
			<div className="flex flex-col py-4 px-6 gap-3 overflow-hidden h-full">
				{actionLoading && <Loading type="dialog" />}
				<div className="mb-3 flex items-center gap-3">
					<Button
						size="md"
						type="submit"
						onClick={() => {
							setOpenAdd(true);
						}}
					>
						Add Data Group Post
					</Button>
					<Button size="md" onClick={handleImport}>
						Import Data
					</Button>
					<Button
						size="md"
						onClick={() =>
							handleExportDataGroupPost(dataGroupPosts as DataGroupPost[])
						}
						disabled={!dataGroupPosts.length}
					>
						Export Data
					</Button>
					<DialogConfirm
						trigger={
							<Button size="md" disabled={!dataGroupPosts.length}>
								Clear All Data
							</Button>
						}
						type="trigger"
						onConfirm={handleClearAll}
						title="Clear All Data"
						description="Are you sure you want to clear all data?"
					/>
				</div>
				<div className="flex flex-col gap-4 overflow-y-auto h-full">
					{dataGroupPosts.length ? (
						dataGroupPosts.map((dgp) => {
							return (
								<div key={dgp.id} className="flex items-center gap-1">
									<Field orientation="horizontal" className="w-auto">
										<Checkbox
											className={"size-4.5"}
											defaultChecked={dgp.is_active}
											onCheckedChange={(e) => {
												handleCheckedChange(dgp.id, e);
											}}
										/>
										<FieldLabel className="text-base font-medium">
											{dgp.name || dgp.title}
										</FieldLabel>
									</Field>
									<div className="flex gap-0 items-center">
										<Button
											variant="outline"
											size="xs"
											className="rounded-md"
											onClick={() => {
												setOpenDialogViewDetail(true);
												setDataGroupPostSeleted(dgp);
											}}
										>
											<Eye size={16} />
										</Button>
										<DialogConfirm
											type="trigger"
											trigger={
												<Button
													variant="outline"
													size="xs"
													className="rounded-md hover:text-destructive"
												>
													<Trash2 size={16} />
												</Button>
											}
											title="Delete data group post"
											description="Are you sure you want to delete this data group post?"
											onConfirm={() => handleDelete(dgp?.id)}
										/>
									</div>
								</div>
							);
						})
					) : (
						<div className="flex justify-center h-full">No data</div>
					)}
				</div>
			</div>

			<DialogAddOrUpdateDataGroupPost
				open={openDialogViewDetail}
				onOpenChange={setOpenDialogViewDetail}
				onSave={(payload) => handleOnsubmit("edit", payload)}
				dataGroupPost={dataGroupPostSeleted}
				dialog_mode="edit"
			/>

			<DialogAddOrUpdateDataGroupPost
				open={openAdd}
				onOpenChange={setOpenAdd}
				onSave={(payload) => handleOnsubmit("add", payload)}
				dialog_mode="add"
			/>
		</>
	);
}
