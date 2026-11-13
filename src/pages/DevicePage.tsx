import { useLanguage } from "@/hooks/useLanguage";
import getTextWithLanguage from "@/helpers/language";
import { Switch } from "@/components/ui/switch";
import { Database, Play, Settings2, Sliders, Square } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import deviceService from "../services/device-service";
import Loading from "@/components/Loading";
import type { Device, DeviceSetting } from "@/types/types";
import { handleExceptionGlobal } from "@/utils/exception";
import toastHepler from "@/helpers/toast-helper";
import DialogConfirm from "@/components/dialogs/DialogConfirm";
import { logError } from "@/utils/utils";

export default function DevicePage() {
	useLanguage();
	const [devices, setDevices] = useState<Device[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [showDialogConfirmRemoteAll, setShowDialogConfirmRemoteAll] =
		useState(false);
	const [
		showDialogConfirmStopOrEnableAll,
		setShowDialogConfirmStopOrEnableAll,
	] = useState(false);

	const [isRemoteAllDevices, setIsRemoteAllDevices] = useState(false);
	const [isStopOrEnableAllDevices, setIsStopOrEnableAllDevices] =
		useState(false);

	useEffect(() => {
		async function fn() {
			try {
				setLoading(true);
				const data = await deviceService.getAllDeviceByUser();
				setDevices(data);
			} catch (error) {
				handleExceptionGlobal(
					error,
					getTextWithLanguage({
						en: "Failed to load devices",
						vi: "Lỗi tải danh sách thiết bị",
					}),
				);
			} finally {
				setLoading(false);
			}
		}
		fn();
	}, []);

	if (loading) {
		return <Loading />;
	}

	const handleStopAutomation = async (
		device_id: string,
		is_stop_task: boolean,
	) => {
		try {
			await deviceService.updateDeviceSetting({
				key: "is_stop_task",
				value: is_stop_task,
				device_id,
			});
			setDevices((prev) =>
				prev.map((dev) =>
					dev.id === device_id
						? {
								...dev,
								device_setting: {
									...dev.device_setting,
									is_stop_task,
								},
							}
						: dev,
				),
			);
			toastHepler({
				message: getTextWithLanguage({
					en: "Device updated successfully",
					vi: "Cập nhật thiết bị thành công",
				}),
				type: "success",
			});
		} catch (error) {
			handleExceptionGlobal(
				error,
				getTextWithLanguage({
					en: "Failed to update device setting",
					vi: "Lỗi cập nhật thiết bị",
				}),
			);
		}
	};

	const handleScheduler = async (device_id: string, is_scheduler: boolean) => {
		try {
			await deviceService.updateDeviceSetting({
				key: "is_scheduler",
				value: is_scheduler,
				device_id,
			});
			setDevices((prev) =>
				prev.map((dev) =>
					dev.id === device_id
						? {
								...dev,
								device_setting: {
									...dev.device_setting,
									is_scheduler,
								},
							}
						: dev,
				),
			);
		} catch (error) {
			handleExceptionGlobal(
				error,
				getTextWithLanguage({
					en: "Failed to update device setting",
					vi: "Lỗi cập nhật thiết bị",
				}),
			);
		}
	};

	function getLabelByStatusDevice(setting: DeviceSetting) {
		if (!setting) {
			return getTextWithLanguage({
				vi: "Không rõ",
				en: "Unknown",
			});
		}

		if (setting.is_stop_task) {
			return getTextWithLanguage({
				en: "Stop task",
				vi: "Đã tắt",
			});
		}

		if (setting.is_spammed) {
			return getTextWithLanguage({
				en: "Spammed",
				vi: "Bị Spamm",
			});
		}

		return getTextWithLanguage({
			en: "Running",
			vi: "Đang bật",
		});
	}

	const handleUpdateRemoteDevice = async (deviceId: string, b: boolean) => {
		try {
			await deviceService.updateDeviceSetting({
				key: "is_remote_control",
				value: b,
				device_id: deviceId,
			});
			setDevices((prev) =>
				prev.map((dev) =>
					dev.id === deviceId
						? {
								...dev,
								device_setting: {
									...dev.device_setting,
									is_remote_control: b,
								},
							}
						: dev,
				),
			);
		} catch (error) {
			handleExceptionGlobal(
				error,
				getTextWithLanguage({
					en: "Failed to update device setting",
					vi: "Lỗi cập nhật thiết bị",
				}),
			);
		}
	};

	return (
		<div className="flex-1">
			{/* Header Info */}
			<div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
						<Database className="text-blue-500" size={24} />
						{getTextWithLanguage({
							en: "Device management",
							vi: "Quản lý thiết bị",
						})}
					</h1>
					<p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
						{getTextWithLanguage({
							en: "Manage automatic posting for your Facebook accounts and windows.",
							vi: "Quản lý và thiết lập trạng thái tự động đăng bài cho các tài khoản/cửa sổ Facebook của bạn.",
						})}
					</p>
				</div>
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
				<div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex flex-col">
					<span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
						{getTextWithLanguage({ en: "Total devices", vi: "Tổng Thiết Bị" })}
					</span>
					<span className="text-2xl font-bold mt-1 text-slate-800 dark:text-slate-100">
						{devices.length}
					</span>
				</div>
				<div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex flex-col">
					<span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
						{getTextWithLanguage({
							en: "Automation running",
							vi: "Đang Chạy Auto",
						})}
					</span>
					<span className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
						{0}
						<span className="relative flex h-3 w-3">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
						</span>
					</span>
				</div>
				<div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex flex-col">
					<span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
						{getTextWithLanguage({
							en: "Spam / Checkpoint",
							vi: "Bị Spam/Checkpoint",
						})}
					</span>
					<span className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">
						{devices.filter((d) => d?.device_setting?.is_spammed).length}
					</span>
				</div>
				<div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex flex-col">
					<span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
						{getTextWithLanguage({ en: "Stopped", vi: "Đã Dừng" })}
					</span>
					<span className="text-2xl font-bold mt-1 text-slate-500 dark:text-slate-400">
						{devices.filter((d) => d?.device_setting?.is_stop_task).length}
					</span>
				</div>
			</div>

			{/* Device grid list */}
			<div className="mb-3 pb-2 border-b border-slate-200 dark:border-zinc-800">
				<h3 className="text-lg font-semibold text-slate-800 dark:text-zinc-100">
					{getTextWithLanguage({
						en: "Actions",
						vi: "Hành động",
					})}
				</h3>
			</div>
			<div className="mb-6 mt-3 flex flex-col gap-4">
				<div className="flex flex-wrap gap-2 items-center">
					<Button
						onClick={() => {
							setIsStopOrEnableAllDevices(false);
							setShowDialogConfirmStopOrEnableAll(true);
						}}
						size="lg"
						variant="primary"
					>
						{getTextWithLanguage({
							en: "Enable all",
							vi: "Bật tất cả",
						})}
					</Button>
					<Button
						onClick={() => {
							setIsStopOrEnableAllDevices(true);
							setShowDialogConfirmStopOrEnableAll(true);
						}}
						size="lg"
						variant="secondary"
					>
						{getTextWithLanguage({
							en: "Disable all",
							vi: "Tắt tất cả",
						})}
					</Button>
				</div>

				<div className="flex flex-wrap gap-2 items-center">
					<Button
						onClick={() => {
							setIsRemoteAllDevices(true);
							setShowDialogConfirmRemoteAll(true);
						}}
						size="lg"
					>
						{getTextWithLanguage({
							en: "Remote Control for all devices",
							vi: "Điều khiển từ xa cho tất cả",
						})}
					</Button>
					<Button
						onClick={() => {
							setIsRemoteAllDevices(false);
							setShowDialogConfirmRemoteAll(true);
						}}
						size="lg"
						variant="secondary"
					>
						{getTextWithLanguage({
							en: "Disable Remote Control for all devices",
							vi: "Tắt điều khiển từ xa cho tất cả",
						})}
					</Button>
				</div>
			</div>

			<div className="mb-6 pb-2 border-b border-slate-200 dark:border-zinc-800">
				<h3 className="text-lg font-semibold text-slate-800 dark:text-zinc-100">
					{getTextWithLanguage({
						en: "Devices List",
						vi: "Danh sách thiết bị",
					})}
				</h3>
			</div>

			{devices.length === 0 ? (
				<div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-12 text-center shadow-sm">
					<Sliders
						className="mx-auto text-slate-300 dark:text-zinc-700 mb-4"
						size={48}
					/>
					<h3 className="text-lg font-medium text-slate-800 dark:text-zinc-200">
						{getTextWithLanguage({
							en: "No devices found",
							vi: "Không tìm thấy thiết bị nào",
						})}
					</h3>
					<p className="text-slate-400 dark:text-zinc-500 text-sm mt-1">
						{getTextWithLanguage({
							en: "No devices match your search filters.",
							vi: "Không có thiết bị nào phù hợp với bộ lọc tìm kiếm của bạn.",
						})}
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
					{devices.map((dev) => (
						<div
							key={dev.id}
							className={`bg-white dark:bg-zinc-900 border rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-700 flex flex-col overflow-hidden ${
								!dev.device_setting?.is_stop_task
									? "border-emerald-200 dark:border-emerald-950/60"
									: dev.device_setting?.is_spammed
										? "border-rose-200 dark:border-rose-950/60"
										: "border-slate-200 dark:border-zinc-800"
							}`}
						>
							{/* Card Top: Device Info */}
							<div className="p-5 flex justify-between items-start gap-4 border-b border-slate-100 dark:border-zinc-800/80">
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 flex-wrap">
										<h3 className="font-semibold text-slate-800 dark:text-zinc-100 truncate text-base">
											{dev.device_name ||
												getTextWithLanguage({
													en: "Unnamed device",
													vi: "Thiết bị chưa có tên",
												})}
										</h3>
										<span
											className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
												!dev.device_setting?.is_stop_task
													? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
													: dev.device_setting?.is_spammed
														? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
														: "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400"
											}`}
										>
											{getLabelByStatusDevice(dev?.device_setting)}
										</span>
									</div>
									<p className="text-xs text-slate-400 dark:text-zinc-500 mt-1 break-all">
										ID: {dev.id}
									</p>
								</div>
							</div>

							{/* Card Footer: Quick Toggles and Navigation */}
							<div className="px-5 py-4 bg-slate-50 dark:bg-zinc-950/20 border-t border-slate-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
								{/* Toggles */}
								<div className="flex items-center gap-4">
									<div className="flex items-center gap-1.5">
										<span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
											{getTextWithLanguage({
												en: "Schedule:",
												vi: "Lên lịch:",
											})}
										</span>
										<Switch
											checked={!!dev?.device_setting?.is_scheduler}
											onCheckedChange={(checked) => {
												handleScheduler(dev.id, checked);
											}}
										/>
									</div>
								</div>

								{/* Actions */}
								<div className="flex flex-wrap items-center gap-2">
									<Button
										size="sm"
										link
										to={`/device/${dev.id}/device-setting`}
										text={getTextWithLanguage({
											en: "Settings",
											vi: "Cài đặt",
										})}
										icon={<Settings2 size={14} />}
									/>

									<Button
										size="sm"
										variant={
											!dev?.device_setting?.is_remote_control
												? "secondary"
												: "primary"
										}
										onClick={() => {
											handleUpdateRemoteDevice(
												dev.id,
												!dev.device_setting.is_remote_control,
											);
										}}
									>
										{dev.device_setting?.is_remote_control ? (
											<>
												<Square size={12} fill="white" />
												{getTextWithLanguage({
													en: "Enable remote",
													vi: "Tắt điều khiển",
												})}
											</>
										) : (
											<>
												<Play size={12} fill="white" />
												{getTextWithLanguage({
													en: "Disable remote",
													vi: "Bật điều khiển",
												})}
											</>
										)}
									</Button>

									<Button
										size="sm"
										variant={
											!dev.device_setting?.is_stop_task
												? "secondary"
												: "primary"
										}
										onClick={() => {
											handleStopAutomation(
												dev.id,
												!dev.device_setting?.is_stop_task,
											);
										}}
									>
										{!dev.device_setting?.is_stop_task ? (
											<>
												<Square size={12} fill="white" />
												{getTextWithLanguage({
													en: "Stop automation",
													vi: "Dừng Tool",
												})}
											</>
										) : (
											<>
												<Play size={12} fill="white" />
												{getTextWithLanguage({
													en: "Start automation",
													vi: "Bật Tool",
												})}
											</>
										)}
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			<DialogConfirm
				open={showDialogConfirmRemoteAll}
				onOpenChange={setShowDialogConfirmRemoteAll}
				title={getTextWithLanguage({
					en: isRemoteAllDevices
						? "Enable remote control for all devices"
						: "Disable remote control for all devices",
					vi: isRemoteAllDevices
						? "Bật điều khiển từ xa cho tất cả thiết bị"
						: "Tắt điều khiển từ xa cho tất cả thiết bị",
				})}
				description={getTextWithLanguage({
					en: isRemoteAllDevices
						? "Are you sure you want to enable remote control for all devices?"
						: "Are you sure you want to disable remote control for all devices?",
					vi: isRemoteAllDevices
						? "Bạn có chắc chắn muốn bật điều khiển từ xa cho tất cả thiết bị?"
						: "Bạn có chắc chắn muốn tắt điều khiển từ xa cho tất cả thiết bị?",
				})}
				onCancel={() => {
					setShowDialogConfirmRemoteAll(false);
				}}
				onConfirm={async () => {
					try {
						await deviceService.updateRemoteAllDevice(isRemoteAllDevices);
						setShowDialogConfirmRemoteAll(false);
						toastHepler({
							message: getTextWithLanguage({
								en: isRemoteAllDevices
									? "Remote control for all devices has been enabled successfully"
									: "Remote control for all devices has been disabled successfully",
								vi: isRemoteAllDevices
									? "Điều khiển từ xa cho tất cả thiết bị đã được bật thành công"
									: "Điều khiển từ xa cho tất cả thiết bị đã được tắt thành công",
							}),
							type: "success",
						});

						setDevices((prev) => {
							return prev.map((dev) => ({
								...dev,
								device_setting: {
									...dev.device_setting,
									is_remote_control: isRemoteAllDevices,
								},
							}));
						});
					} catch (error) {
						logError(error);
						toastHepler({
							message: getTextWithLanguage({
								en: "Something went wrong, please try again later",
								vi: "Đã có lỗi xảy ra, vui lòng thử lại sau",
							}),
							type: "error",
						});
					}
				}}
			/>

			<DialogConfirm
				open={showDialogConfirmStopOrEnableAll}
				onOpenChange={setShowDialogConfirmStopOrEnableAll}
				title={getTextWithLanguage({
					en: isStopOrEnableAllDevices
						? "Stop automation for all devices"
						: "Enable automation for all devices",
					vi: isStopOrEnableAllDevices
						? "Dừng tự động cho tất cả thiết bị"
						: "Bật tự động cho tất cả thiết bị",
				})}
				description={getTextWithLanguage({
					en: isStopOrEnableAllDevices
						? "Are you sure you want to stop automation for all devices?"
						: "Are you sure you want to enable automation for all devices?",
					vi: isStopOrEnableAllDevices
						? "Bạn có chắc chắn muốn dừng tự động cho tất cả thiết bị?"
						: "Bạn có chắc chắn muốn bật tự động cho tất cả thiết bị?",
				})}
				onCancel={() => {
					setShowDialogConfirmStopOrEnableAll(false);
				}}
				onConfirm={async () => {
					try {
						await deviceService.updateStopOrEnableAllDevice(
							isStopOrEnableAllDevices,
						);
						setShowDialogConfirmStopOrEnableAll(false);
						toastHepler({
							message: getTextWithLanguage({
								en: isStopOrEnableAllDevices
									? "Automation for all devices has been stopped successfully"
									: "Automation for all devices has been enabled successfully",
								vi: isStopOrEnableAllDevices
									? "Tự động cho tất cả thiết bị đã được dừng thành công"
									: "Tự động cho tất cả thiết bị đã được bật thành công",
							}),
							type: "success",
						});

						setDevices((prev) =>
							prev.map((item) => ({
								...item,
								device_setting: {
									...item.device_setting,
									is_stop_task: isStopOrEnableAllDevices,
								},
							})),
						);
					} catch (error) {
						logError(error);
						toastHepler({
							message: getTextWithLanguage({
								en: "Something went wrong, please try again later",
								vi: "Đã có lỗi xảy ra, vui lòng thử lại sau",
							}),
							type: "error",
						});
					}
				}}
			/>
		</div>
	);
}
