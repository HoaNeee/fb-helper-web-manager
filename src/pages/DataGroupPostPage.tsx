import { Button } from "@/components/Button";
import DialogAddOrUpdateDataGroupPost from "@/components/dialogs/DialogAddOrUpdateDataGroupPost";
import DialogConfirm from "@/components/dialogs/DialogConfirm";
import Loading from "@/components/Loading";
import {
	handleExportDataGroupPost,
	handleImportDataGroupPost,
} from "@/helpers/data-group-post";
import {
	dataGroupPostService,
	DEFAULT_LIST_DATA_GROUP_POST,
	type DataGroupPost,
} from "@/services/data-group-post-service";
import { handleExceptionGlobal } from "@/utils/exception";
import { useCallback, useEffect, useState } from "react";

export default function DataGroupPostPage() {
	const [dataGroupPosts, setDataGroupPosts] = useState<
		Partial<DataGroupPost>[]
	>(DEFAULT_LIST_DATA_GROUP_POST);
	const [openDialogViewDetail, setOpenDialogViewDetail] = useState(false);
	const [openAdd, setOpenAdd] = useState(false);
	const [actionLoading, setActionLoading] = useState(false);

	const [dataGroupPostSeleted, setDataGroupPostSeleted] =
		useState<Partial<DataGroupPost>>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fn() {
			try {
				setLoading(true);
				const res = await dataGroupPostService.getAllDataGroupPostByUser();
				setDataGroupPosts(res);
			} catch (error) {
				handleExceptionGlobal(error);
			} finally {
				setLoading(false);
			}
		}
		fn();
	}, []);

	const handleOnsubmit = useCallback(
		(mode: "edit" | "add", payload: Partial<DataGroupPost>) => {
			if (mode === "add") {
				console.log(payload);
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

	async function handleUpdateStatusAll(
		data_group_post_id: string,
		is_active: boolean,
	) {
		try {
			setActionLoading(true);
			await dataGroupPostService.updateStatusAllDevice(
				data_group_post_id,
				is_active,
			);
		} catch (error) {
			console.log(error);
		} finally {
			setActionLoading(false);
		}
	}

	if (loading) {
		return <Loading type="dialog" />;
	}

	return (
		<>
			{actionLoading && <Loading type="dialog" />}
			<div className="h-full p-2">
				<h2 className="text-xl font-medium">Data Group Post</h2>
				<div className="flex flex-col py-4 px-6 gap-3 overflow-hidden h-full">
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
									<div
										key={dgp.id}
										className="flex flex-col gap-4 p-3 border border-l-4 border-l-(--bg-btn-primary) rounded-md hover:shadow-sm transition-all duration-300"
									>
										<div className="w-auto flex-1">
											<p className="text-base font-medium">
												{dgp.name || dgp.title}
											</p>
										</div>
										<div className="flex gap-2">
											<Button
												variant="primary"
												size="xs"
												className="rounded-sm"
												onClick={() => {
													setOpenDialogViewDetail(true);
													setDataGroupPostSeleted(dgp);
												}}
												text="View"
											/>

											<DialogConfirm
												type="trigger"
												trigger={
													<Button
														text="Check all devices"
														size="xs"
														className="rounded-sm hover:bg-blue-500 hover:text-white"
														outline
													/>
												}
												title="Check all devices"
												description="Are you sure you want to check all devices?"
												onConfirm={() => handleUpdateStatusAll(dgp?.id, true)}
											/>
											<DialogConfirm
												type="trigger"
												trigger={
													<Button
														text="Uncheck all devices"
														size="xs"
														className="rounded-sm hover:bg-red-500 hover:text-white"
														variant="danger"
														outline
													/>
												}
												title="Uncheck all devices"
												description="Are you sure you want to uncheck all devices?"
												onConfirm={() => handleUpdateStatusAll(dgp?.id, false)}
											/>
											<DialogConfirm
												type="trigger"
												trigger={
													<Button variant="danger" outline text="Delete" />
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
							<div className="w-full flex items-center justify-center h-full">
								<p>Không có dữ liệu</p>
							</div>
						)}
					</div>
				</div>
			</div>

			<DialogAddOrUpdateDataGroupPost
				open={openDialogViewDetail}
				onOpenChange={(open) => {
					if (!open) {
						setDataGroupPostSeleted(undefined);
					}
					setOpenDialogViewDetail(open);
				}}
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
