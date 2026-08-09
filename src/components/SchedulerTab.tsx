import {
	schedulerService,
	type SchedulerDetail,
	type SchedulerTime,
} from "@/services/scheduler-service";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { useEffect, useState } from "react";
import { type SchedulerType } from "@/services/scheduler-service";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import Button from "./Button";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { X } from "lucide-react";
import { useParams } from "react-router";
import {
	createSchedulerDailyHours,
	getSchedulerTypeText,
	SCHEDULER_TYPE_LIST,
} from "@/helpers/scheduler";

export default function SchedulerTab() {
	const [openDialogViewScheduler, setOpenDialogViewScheduler] = useState(false);
	const [schedulerType, setSchedulerType] =
		useState<SchedulerType>("DAILY_HOURS");
	const [schedulerDetail, setSchedulerDetail] =
		useState<Partial<SchedulerDetail>>();

	const params = useParams<{ deviceId: string }>();

	useEffect(() => {
		async function fn() {
			try {
				const deviceId = params.deviceId;
				if (!deviceId) return;
				const res = await schedulerService.getSchedulerByDevice(deviceId);
				setSchedulerType(res.scheduler_type);
				let details = (await schedulerService.getSchedulerDetail(
					res.scheduler_type,
					deviceId,
				)) as Partial<SchedulerDetail>;
				if (!details) {
					if (res.scheduler_type === "DAILY_HOURS") {
						details = {
							scheduler_time_list: createSchedulerDailyHours(),
						};
					}
				}
				setSchedulerDetail(details);
			} catch (error) {
				console.log(error);
			}
		}
		fn();
	}, []);

	function renderSchedulerDetail() {
		if (schedulerType !== "DAILY_HOURS" && schedulerType !== "FRAME_HOURS") {
			return (
				<div className="mt-4 ml-6">
					<Field>
						<FieldLabel className="font-normal" htmlFor="time-value">
							Enter time value for{" "}
							{getSchedulerTypeText(schedulerType).toLowerCase()}
						</FieldLabel>
						<Input placeholder="Ex: 1,2,3" id="time-value" />
					</Field>
					<div className="flex justify-end mt-3">
						<Button text="Save" className="rounded-sm" />
					</div>
				</div>
			);
		}
		if (schedulerType === "DAILY_HOURS") {
			return (
				<div className="mt-4 ml-6 flex justify-end">
					<Button text="Reset Daily Hours" />
				</div>
			);
		}
	}

	function DialogSchedulerTimeList({
		list,
		open,
		onOpenChange,
	}: {
		list?: SchedulerTime[];
		open: boolean;
		onOpenChange: (open: boolean) => void;
	}) {
		const displayList = list || [];

		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className={"h-100"}>
					<DialogHeader>
						<DialogTitle>Scheduler time list</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-2 items-center flex-1 overflow-y-auto">
						{displayList.length > 0 ? (
							displayList.map((item, idx) => {
								return (
									<div key={idx} className="flex gap-2 items-center">
										<p className="font-medium">
											{item.h}:{item.m}
										</p>
										<button className="cursor-pointer hover:text-red-600 transition-colors flex justify-center items-center">
											<X size={16} onClick={() => console.log(item)} />
										</button>
									</div>
								);
							})
						) : (
							<div className="flex flex-col gap-2 items-center justify-center">
								<p className="font-medium">No scheduler time list</p>
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<>
			<div className="w-full h-full p-4 flex flex-col gap-3">
				<h2 className="font-medium text-lg">Scheduler for device</h2>
				<div>
					<Button
						text="View Scheduler list"
						size="md"
						onClick={() => setOpenDialogViewScheduler(true)}
					/>
				</div>
				<div className="w-[320px]">
					<Label className="font-normal my-2">Select scheduler type</Label>
					<Select
						value={schedulerType}
						onValueChange={(value) => {
							setSchedulerType(value);
						}}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select scheduler type">
								{getSchedulerTypeText(schedulerType)}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{SCHEDULER_TYPE_LIST.map((item) => {
								return (
									<SelectItem key={item.value} value={item.value}>
										{item.label}
									</SelectItem>
								);
							})}
						</SelectContent>
					</Select>
					{renderSchedulerDetail()}
				</div>
			</div>
			<DialogSchedulerTimeList
				list={schedulerDetail?.scheduler_time_list}
				open={openDialogViewScheduler}
				onOpenChange={setOpenDialogViewScheduler}
			/>
		</>
	);
}
