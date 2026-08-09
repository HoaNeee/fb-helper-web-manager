import {
	LIST_SPECIAL_FRAME_HOUR_DEFAULT,
	specialFrameHourService,
	type SpecialFrameHour,
} from "@/services/special-frame-hour-service";
import { useEffect, useState } from "react";
import Button from "./Button";
import DialogAddOrUpdateSpecialFrameHour from "./dialogs/DialogAddOrUpdateSpecialFrameHour";
import DialogChooseDayOfWeek from "./dialogs/DialogChooseDayOfWeek";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { getDayOfWeekText } from "@/utils/utils";
import { useParams } from "react-router";

type Props = {
	mode?: "device" | "page";
};

const LIST_DATA = LIST_SPECIAL_FRAME_HOUR_DEFAULT;

type PropsItem = {
	item: SpecialFrameHour;
	onClickEditDates: (item: SpecialFrameHour) => void;
	onClickEditSpecialFrameHour: (item: SpecialFrameHour) => void;
	mode?: "device" | "page";
};

function SpecialFrameHourItem({
	item,
	onClickEditDates,
	onClickEditSpecialFrameHour,
	mode,
}: PropsItem) {
	return (
		<>
			<div className="p-3 border rounded-md gap-4 flex flex-col w-full">
				<div className="flex gap-4 items-center">
					{mode === "device" ? <Checkbox className={"size-5"} /> : null}
					<Label className="flex flex-col items-start">
						<div className="flex flex-col gap-1 mb-1 font-normal">
							<div className="flex gap-4 items-center text-sm">
								<p>Start time: {item.start_time}:00</p>
								<p>End time: {item.end_time}:00</p>
								<p>Max group: {item.max_group}</p>
							</div>
							<p>
								Apply dates:{" "}
								{item.apply_dates
									.map((d) => getDayOfWeekText({ day: d }))
									.join(", ")}
							</p>
						</div>
					</Label>
				</div>
				<div
					className={`flex gap-2 items-center ${mode === "device" && "ml-8"}`}
				>
					<Button
						text="Edit"
						className="rounded-sm"
						onClick={() => onClickEditSpecialFrameHour(item)}
					/>
					<Button
						text="Edit Date"
						className="rounded-sm"
						onClick={() => onClickEditDates(item)}
					/>
					<Button text="Delete" className="rounded-sm" />
				</div>
			</div>
		</>
	);
}

export default function SpecialFrameHourTabComponent({ mode }: Props) {
	const [specialFrameHours, setSpecialFrameHours] = useState(LIST_DATA);
	const [openDialogChooseDay, setOpenDialogChooseDay] = useState(false);
	const [openDialogEdit, setOpenDialogEdit] = useState(false);
	const [openDialogAdd, setOpenDialogAdd] = useState(false);

	const [specialFrameSelected, setSpecialFrameSelected] = useState<
		SpecialFrameHour | undefined
	>(undefined);

	const params = useParams();

	useEffect(() => {
		const fn = async () => {
			try {
				if (mode === "device") {
					const device_id = params.deviceId;
					if (!device_id) return;
					const list =
						await specialFrameHourService.getListSpecialFrameHourByDevice(
							device_id,
						);
					setSpecialFrameHours(list);
				} else {
					const list =
						await specialFrameHourService.getListSpecialFrameHourByUser();
					setSpecialFrameHours(list);
				}
			} catch (error) {
				console.log(error);
			}
		};
		fn();
	}, [mode]);

	function handleCloseDialogChooseDay() {
		setOpenDialogChooseDay(false);
		setSpecialFrameSelected(undefined);
	}

	function handleOpenChangeDialogChooseDay(open: boolean) {
		if (!open) {
			handleCloseDialogChooseDay();
		} else {
			setOpenDialogChooseDay(open);
		}
	}

	function handleClickEditDates(item: SpecialFrameHour) {
		setSpecialFrameSelected(item);
		setOpenDialogChooseDay(true);
	}

	function handleSaveDayOfWeek(dayOfWeek: number[]) {
		if (!specialFrameSelected) {
			return;
		}

		const data = {
			...specialFrameSelected,
			apply_dates: dayOfWeek,
		};
		setSpecialFrameHours((prev) =>
			prev.map((item) => (item.id === data.id ? data : item)),
		);
		handleCloseDialogChooseDay();
	}

	function handleClickEditSpecialFrameHour(item: SpecialFrameHour) {
		setSpecialFrameSelected(item);
		setOpenDialogEdit(true);
	}

	function handleCloseDialogEdit() {
		setOpenDialogEdit(false);
		setSpecialFrameSelected(undefined);
	}

	function handleOpenChangeDialogEdit(open: boolean) {
		if (!open) {
			handleCloseDialogEdit();
		} else {
			setOpenDialogEdit(open);
		}
	}

	function handleSaveSpecialFrameHour(
		newSpecialFrameHour: Partial<SpecialFrameHour>,
	) {
		if (!specialFrameSelected) {
			return;
		}

		const data = {
			...specialFrameSelected,
			...newSpecialFrameHour,
		};
		setSpecialFrameHours((prev) =>
			prev.map((item) => (item.id === data.id ? data : item)),
		);
		handleCloseDialogEdit();
	}

	function handleAddNewSpecialFrameHour(payload: SpecialFrameHour) {
		const newList = [...specialFrameHours];
		newList.push(payload);
		setSpecialFrameHours(newList);
		setOpenDialogAdd(false);
	}

	return (
		<>
			<div className="w-full h-full py-3 px-5 flex flex-col">
				<div>
					<Button
						text="Add frame hour"
						className="rounded-sm"
						onClick={() => setOpenDialogAdd(true)}
					/>
				</div>
				<div className="flex flex-col gap-4 mt-4 flex-1 overflow-y-scroll">
					{specialFrameHours.map((item, idx) => (
						<SpecialFrameHourItem
							key={idx}
							item={item}
							onClickEditDates={handleClickEditDates}
							onClickEditSpecialFrameHour={handleClickEditSpecialFrameHour}
							mode={mode}
						/>
					))}
				</div>
			</div>
			{specialFrameSelected && (
				<DialogChooseDayOfWeek
					open={openDialogChooseDay}
					onOpenChange={handleOpenChangeDialogChooseDay}
					onClose={handleCloseDialogChooseDay}
					onSave={handleSaveDayOfWeek}
					initDayOfWeeks={specialFrameSelected?.apply_dates || []}
				/>
			)}

			<DialogAddOrUpdateSpecialFrameHour
				open={openDialogEdit}
				onOpenChange={handleOpenChangeDialogEdit}
				onClose={handleCloseDialogEdit}
				onSave={handleSaveSpecialFrameHour}
				specialFrameHour={specialFrameSelected}
				mode="edit"
			/>

			<DialogAddOrUpdateSpecialFrameHour
				open={openDialogAdd}
				onOpenChange={setOpenDialogAdd}
				onClose={() => setOpenDialogAdd(false)}
				onSave={handleAddNewSpecialFrameHour}
				mode="add"
			/>
		</>
	);
}
