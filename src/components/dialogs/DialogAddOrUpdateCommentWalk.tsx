import { useLanguage } from "@/hooks/useLanguage";
import getTextWithLanguage from "@/helpers/language";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../Button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import DialogContentCommentWalk from "./DialogContentCommentWalk";
import { commentWalkService } from "@/services/comment-walk-service";
import type { CommentWalk } from "@/types/types";
import {
	genID,
	parseBlobToFile,
	parseUrlToBlob,
	splitString,
} from "@/utils/utils";
import Loading from "../Loading";
import fileService from "@/services/file-service";
import { handleExceptionGlobal } from "@/utils/exception";
import { ImagePlus, Sparkles, X } from "lucide-react";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSave: (payload: Partial<CommentWalk>) => void;
	commentWalk?: Partial<CommentWalk>;
	dialog_mode: "edit" | "add";
};

export default function DialogAddOrUpdateCommentWalk({
	open,
	onOpenChange,
	onSave,
	commentWalk,
	dialog_mode,
}: Props) {
	useLanguage();
	const [openDialogContents, setOpenDialogContents] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [listContent, setListContent] = useState<string[]>(
		commentWalk?.contents || [],
	);
	const [listFileUrl, setListFileUrl] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	const [name, setName] = useState<string>("");
	const [titleQuerySearchs, setTitleQuerySearchs] = useState<string>("");
	const [keywordQueryIncludes, setKeywordQueryIncludes] = useState<string>("");
	const [keywordQueryExcludes, setKeywordQueryExcludes] = useState<string>("");
	const [keywordsCertainChoice, setKeywordsCertainChoice] =
		useState<string>("");
	const [matchRateValue, setMatchRateValue] = useState<number>(1);
	const [descriptionForAi, setDescriptionForAi] = useState<string>("");

	const formRef = useRef<HTMLFormElement>(null);
	const errorRef = useRef<HTMLDivElement>(null);
	const inputFileRef = useRef<HTMLInputElement>(null);
	const changeFileFlagRef = useRef<boolean>(false);

	const handleInitFile = useCallback(async (files: string[]) => {
		try {
			setLoading(true);
			const dataTransfer = new DataTransfer();
			setListFileUrl(files);

			for await (const url of files) {
				try {
					const blob = await parseUrlToBlob(url);
					dataTransfer.items.add(parseBlobToFile(blob, url));
				} catch (err) {
					handleExceptionGlobal(
						err,
						getTextWithLanguage({
							en: "Failed to load file",
							vi: "Lỗi khi tải tệp",
						}),
					);
				}
			}

			if (inputFileRef.current) {
				inputFileRef.current.files = dataTransfer.files;
			}
		} catch (error) {
			handleExceptionGlobal(
				error,
				getTextWithLanguage({
					en: "Failed to load file",
					vi: "Lỗi khi tải tệp",
				}),
			);
		} finally {
			setLoading(false);
		}
	}, []);

	const resetForm = useCallback(() => {
		setName("");
		setTitleQuerySearchs("");
		setListContent([]);
		setListFileUrl([]);
		setKeywordQueryIncludes("");
		setKeywordQueryExcludes("");
		setKeywordsCertainChoice("");
		setMatchRateValue(1);
		setDescriptionForAi("");
		setErrorMessage("");
		changeFileFlagRef.current = false;
		if (inputFileRef.current) {
			inputFileRef.current.value = "";
		}
	}, []);

	useEffect(() => {
		let ignore = false;
		const handleOpenChange = async (o: boolean) => {
			if (ignore) return;
			ignore = true;

			if (!o) {
				resetForm();
			} else {
				if (dialog_mode === "add") {
					resetForm();
				} else if (dialog_mode === "edit" && commentWalk) {
					setName(commentWalk.name || "");
					setTitleQuerySearchs(
						commentWalk?.title_query_searchs.join(", ") || "",
					);
					setListContent(
						commentWalk.contents && commentWalk.contents.length > 0
							? commentWalk.contents
							: [],
					);
					setKeywordQueryIncludes(
						(commentWalk.keyword_query_includes || []).join(", "),
					);
					setKeywordQueryExcludes(
						(commentWalk.keyword_query_excludes || []).join(", "),
					);
					setKeywordsCertainChoice(
						(commentWalk.keywords_certain_choice || []).join(", "),
					);
					setMatchRateValue(
						commentWalk.match_rate_value_content_query_includes ?? 1,
					);
					setDescriptionForAi(commentWalk.description_for_ai || "");

					if (commentWalk.files && commentWalk.files.length > 0) {
						await handleInitFile(commentWalk.files);
					} else {
						setListFileUrl([]);
					}
				}
			}
		};

		if (open) {
			handleOpenChange(open);
		}

		return () => {
			ignore = false;
		};
	}, [open, dialog_mode, commentWalk, handleInitFile, resetForm]);

	const handleRemoveImage = (indexToRemove: number) => {
		const updatedUrls = listFileUrl.filter((_, idx) => idx !== indexToRemove);
		setListFileUrl(updatedUrls);
		changeFileFlagRef.current = true;

		if (inputFileRef.current && inputFileRef.current.files) {
			const dataTransfer = new DataTransfer();
			Array.from(inputFileRef.current.files).forEach((file, idx) => {
				if (idx !== indexToRemove) {
					dataTransfer.items.add(file);
				}
			});
			inputFileRef.current.files = dataTransfer.files;
		}
	};

	const handleOnSave = useCallback(async () => {
		try {
			if (!name || !name.trim()) {
				handleError(
					getTextWithLanguage({
						en: "Name is required",
						vi: "Vui lòng nhập tên cấu hình",
					}),
				);
				return;
			}

			setLoading(true);

			let finalFiles = listFileUrl;

			if (changeFileFlagRef.current && inputFileRef.current?.files) {
				const files = Array.from(inputFileRef.current.files);
				if (files.length > 0) {
					const res = await fileService.uploadFiles(files);
					finalFiles = res;
				} else {
					finalFiles = [];
				}
				changeFileFlagRef.current = false;
			}

			const payload: Partial<CommentWalk> = {
				name: name.trim(),
				title_query_searchs: splitString(titleQuerySearchs, "\n"),
				contents: listContent.filter((c) => c && c.trim().length > 0),
				files: finalFiles,
				keyword_query_includes: splitString(keywordQueryIncludes),
				keyword_query_excludes: splitString(keywordQueryExcludes),
				keywords_certain_choice: splitString(keywordsCertainChoice),
				match_rate_value_content_query_includes: Number(matchRateValue || 1),
				description_for_ai: descriptionForAi.trim(),
			};

			if (dialog_mode === "edit" && commentWalk?.id) {
				const newPayload: Partial<CommentWalk> = {
					...commentWalk,
					...payload,
				};
				const res = await commentWalkService.updateCommentWalk(
					commentWalk.id,
					newPayload,
				);
				onSave(res || newPayload);
			} else if (dialog_mode === "add") {
				payload.id = genID();
				const res = await commentWalkService.addNewCommentWalk(payload);
				onSave(res || payload);
			}

			onOpenChange(false);
		} catch (error) {
			handleError(
				getTextWithLanguage({
					en: "Unable to save data. Please try again!",
					vi: "Đã xảy ra lỗi khi lưu dữ liệu. Vui lòng thử lại!",
				}),
			);
		} finally {
			setLoading(false);
		}
	}, [
		name,
		titleQuerySearchs,
		listContent,
		listFileUrl,
		keywordQueryIncludes,
		keywordQueryExcludes,
		keywordsCertainChoice,
		matchRateValue,
		descriptionForAi,
		dialog_mode,
		commentWalk,
		onSave,
		onOpenChange,
	]);

	function handleError(msg: string) {
		setErrorMessage(msg);
		errorRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
	}

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="min-w-0 sm:max-w-3xl h-[92dvh] flex flex-col">
					{loading && <Loading type="cover" />}
					<DialogHeader className="pb-3 border-b">
						<DialogTitle className="text-xl font-bold">
							{dialog_mode === "edit"
								? getTextWithLanguage({
										en: "Edit Comment Walk data",
										vi: "Chỉnh sửa dữ liệu Comment Walk",
									})
								: getTextWithLanguage({
										en: "Add Comment Walk data",
										vi: "Thêm mới dữ liệu Comment Walk",
									})}
						</DialogTitle>
					</DialogHeader>

					<div className="overflow-y-auto min-h-0 p-1 sm:p-3 flex-1 space-y-4">
						<form ref={formRef} className="flex flex-col gap-4">
							{/* Name field */}
							<Field>
								<FieldLabel htmlFor="comment-walk-name" className="font-medium">
									{getTextWithLanguage({
										en: "Comment walk configuration name",
										vi: "Tên cấu hình bình luận dạo",
									})}{" "}
									<span className="text-red-500">*</span>:
								</FieldLabel>
								<Input
									value={name}
									id="comment-walk-name"
									onChange={(e) => {
										setName(e.target.value);
										if (errorMessage) handleError("");
									}}
									placeholder={getTextWithLanguage({
										en: "Ex: Cau Giay property comments",
										vi: "VD: Comment walk bất động sản Cầu Giấy",
									})}
								/>
							</Field>

							{/* Title query searchs */}
							<Field>
								<FieldLabel
									htmlFor="comment-walk-title-query-searchs"
									className="font-medium"
								>
									{getTextWithLanguage({
										en: "Post title search keywords (1 title is 1 line):",
										vi: "Từ khóa tìm kiếm tiêu đề bài viết (1 tiêu đề là 1 dòng):",
									})}
								</FieldLabel>
								<Textarea
									value={titleQuerySearchs}
									id="comment-walk-title-query-searchs"
									onChange={(e) => setTitleQuerySearchs(e.target.value)}
									placeholder={getTextWithLanguage({
										en: "Ex: room rental, studio apartment, affordable accommodation",
										vi: "VD: cho thuê phòng, căn hộ mini, nhà trọ giá rẻ",
									})}
								/>
							</Field>

							{/* Contents Manager */}
							<div className="p-3.5 border border-slate-200 dark:border-zinc-800 rounded-lg bg-slate-50/60 dark:bg-zinc-900/40 my-2">
								<div className="flex items-center justify-between">
									<div>
										<Label className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
											{getTextWithLanguage({
												en: "Comment content:",
												vi: "Nội dung bình luận:",
											})}
											{listContent.length}{" "}
											{getTextWithLanguage({
												en: "contents created",
												vi: "nội dung đã tạo",
											})}
										</Label>
										<p className="text-xs text-slate-500 mt-0.5">
											{getTextWithLanguage({
												en: "One of these contents will be randomly selected for each comment",
												vi: "Hệ thống sẽ lấy ngẫu nhiên 1 trong các nội dung này để bình luận",
											})}
										</p>
									</div>
									<Button
										size="xs"
										text={getTextWithLanguage({
											en: "Manage contents",
											vi: "Quản lý nội dung",
										})}
										className="rounded-md font-medium"
										onClick={() => setOpenDialogContents(true)}
									/>
								</div>
							</div>

							{/* Keywords includes */}
							<Field>
								<FieldLabel
									htmlFor="comment-walk-keyword-query-includes"
									className="font-medium"
								>
									{getTextWithLanguage({
										en: "Required post keywords (comma-separated):",
										vi: "Từ khóa cần có trong bài viết (cách nhau bằng dấu phẩy ','):",
									})}
								</FieldLabel>
								<Textarea
									value={keywordQueryIncludes}
									id="comment-walk-keyword-query-includes"
									onChange={(e) => setKeywordQueryIncludes(e.target.value)}
									placeholder={getTextWithLanguage({
										en: "Ex: room, rental, private bathroom, balcony, washing machine",
										vi: "VD: phòng trọ, cho thuê, khép kín, ban công, máy giặt",
									})}
								/>
							</Field>

							{/* Keywords excludes */}
							<Field>
								<FieldLabel
									htmlFor="comment-walk-keyword-query-excludes"
									className="font-medium"
								>
									{getTextWithLanguage({
										en: "Excluded post keywords (comma-separated):",
										vi: "Từ khóa loại trừ trong bài viết (cách nhau bằng dấu phẩy ','):",
									})}
								</FieldLabel>
								<Textarea
									value={keywordQueryExcludes}
									id="comment-walk-keyword-query-excludes"
									onChange={(e) => setKeywordQueryExcludes(e.target.value)}
									placeholder={getTextWithLanguage({
										en: "Ex: resale, roommate wanted, clearance",
										vi: "VD: pass đồ, tìm người ở ghép, thanh lý",
									})}
								/>
							</Field>

							{/* Keywords certain choice */}
							<Field>
								<FieldLabel
									htmlFor="comment-walk-keywords-certain-choice"
									className="font-medium"
								>
									{getTextWithLanguage({
										en: "Always-match keywords (comma-separated):",
										vi: "Từ khóa chắc chắn chọn khi xuất hiện (cách nhau bằng dấu phẩy ','):",
									})}
								</FieldLabel>
								<Textarea
									value={keywordsCertainChoice}
									id="comment-walk-keywords-certain-choice"
									onChange={(e) => setKeywordsCertainChoice(e.target.value)}
									placeholder={getTextWithLanguage({
										en: "Ex: Cau Giay, Me Tri, My Dinh, Ho Tung Mau",
										vi: "VD: cầu giấy, mễ trì, mỹ đình, hồ tùng mậu",
									})}
								/>
							</Field>

							{/* Match rate */}
							<Field>
								<FieldLabel
									htmlFor="comment-walk-match-rate"
									className="font-medium"
								>
									{getTextWithLanguage({
										en: "Minimum keyword match rate / count in a post:",
										vi: "Tỷ lệ / Số lượng từ khóa khớp tối thiểu trong bài viết:",
									})}
								</FieldLabel>
								<Input
									type="number"
									min={1}
									value={matchRateValue}
									id="comment-walk-match-rate"
									onChange={(e) => setMatchRateValue(Number(e.target.value))}
									placeholder={getTextWithLanguage({
										en: "Ex: 1 or 2",
										vi: "VD: 1 hoặc 2",
									})}
								/>
							</Field>

							{/* Description for AI */}
							<Field>
								<div className="flex items-center gap-1.5 mb-1">
									<Sparkles size={16} className="text-amber-500" />
									<FieldLabel
										htmlFor="comment-walk-description-for-ai"
										className="font-medium"
									>
										{getTextWithLanguage({
											en: "Instructions for AI (when AI assistance is enabled):",
											vi: "Mô tả định hướng cho AI (nếu sử dụng AI Hỗ trợ):",
										})}
									</FieldLabel>
								</div>
								<Textarea
									value={descriptionForAi}
									id="comment-walk-description-for-ai"
									onChange={(e) => setDescriptionForAi(e.target.value)}
									placeholder={getTextWithLanguage({
										en: "Ex: Rent from 4 to 5 million VND, or floor area from 25 m²...",
										vi: "VD: Giá phòng phải từ 4tr - 5tr, hoặc diện tích từ 25m2...",
									})}
								/>
							</Field>

							{/* Image / Files */}
							<Field>
								<FieldLabel
									htmlFor="comment-walk-files"
									className="font-medium"
								>
									{getTextWithLanguage({
										en: "Comment image / video attachments:",
										vi: "Hình ảnh / Video đính kèm bình luận:",
									})}
								</FieldLabel>
								<div className="flex flex-col gap-2">
									<label
										htmlFor="comment-walk-files"
										className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 border border-dashed border-slate-300 dark:border-zinc-700 rounded-md hover:bg-slate-50 dark:hover:bg-zinc-900 text-sm font-medium text-slate-700 dark:text-zinc-300 w-fit transition-colors"
									>
										<ImagePlus size={16} />
										<span>
											{getTextWithLanguage({
												en: "Choose images from your computer",
												vi: "Chọn ảnh từ máy tính",
											})}
										</span>
									</label>
									<input
										type="file"
										multiple
										accept="image/*"
										className="hidden"
										id="comment-walk-files"
										name="comment-walk-files-input"
										ref={inputFileRef}
										onChange={(e) => {
											const files = e.target.files;
											if (!files || files.length === 0) return;
											const urls = Array.from(files).map((file) =>
												URL.createObjectURL(file),
											);
											setListFileUrl(urls);
											changeFileFlagRef.current = true;
										}}
									/>

									{listFileUrl.length > 0 && (
										<div className="flex gap-2 flex-wrap mt-2 p-2 border border-slate-200 dark:border-zinc-800 rounded-md bg-slate-50/40 dark:bg-zinc-900/40">
											{listFileUrl.map((url, idx) => (
												<div
													className="relative h-20 w-20 rounded-md overflow-hidden border border-slate-300 dark:border-zinc-700 group bg-slate-100"
													key={idx}
												>
													<img
														src={url}
														alt={getTextWithLanguage({
															en: `Preview ${idx + 1}`,
															vi: `Xem trước ${idx + 1}`,
														})}
														className="w-full h-full object-cover"
													/>
													<button
														type="button"
														onClick={() => handleRemoveImage(idx)}
														className="absolute top-1 right-1 p-0.5 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
														title={getTextWithLanguage({
															en: "Remove this image",
															vi: "Xóa ảnh này",
														})}
													>
														<X size={12} />
													</button>
												</div>
											))}
										</div>
									)}
								</div>
							</Field>
						</form>

						<div
							ref={errorRef}
							className="text-sm text-rose-500 font-medium empty:hidden"
						>
							{errorMessage}
						</div>
					</div>

					<DialogFooter className="py-2.5 px-4 border-t flex justify-end gap-2 bg-slate-50/50 dark:bg-zinc-950/50">
						<Button
							variant="secondary"
							size="md"
							onClick={() => onOpenChange(false)}
						>
							{getTextWithLanguage({ en: "Cancel", vi: "Hủy" })}
						</Button>
						<Button size="md" type="submit" onClick={handleOnSave}>
							{dialog_mode === "edit"
								? getTextWithLanguage({ en: "Update", vi: "Cập nhật" })
								: getTextWithLanguage({ en: "Add new", vi: "Thêm mới" })}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<DialogContentCommentWalk
				open={openDialogContents}
				onOpenChange={setOpenDialogContents}
				onChangeListContents={(contents) => {
					setListContent(contents);
				}}
				initContents={listContent}
			/>
		</>
	);
}
