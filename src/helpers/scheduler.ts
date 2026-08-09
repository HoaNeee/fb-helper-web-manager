import type {
	SchedulerTime,
	SchedulerType,
} from "@/services/scheduler-service";
import { random } from "@/utils/utils";

const getSchedulerTypeText = (type: SchedulerType) => {
	switch (type) {
		case "EVERY_MINUTES":
			return "Every minutes";
		case "EVERY_HOURS":
			return "Every hours";
		case "CUSTOM_DAILY_MINUTES":
			return "Custom daily minutes";
		case "CUSTOM_DAILY_HOURS":
			return "Custom daily hours";
		case "DAILY_HOURS":
			return "Daily hours";
		case "FRAME_HOURS":
			return "Frame hours";
		default:
			return "Unknown";
	}
};

const SCHEDULER_TYPE_LIST: { label: string; value: SchedulerType }[] = [
	{
		label: getSchedulerTypeText("DAILY_HOURS"),
		value: "DAILY_HOURS",
	},
	{
		label: getSchedulerTypeText("EVERY_MINUTES"),
		value: "EVERY_MINUTES",
	},
	{
		label: getSchedulerTypeText("EVERY_HOURS"),
		value: "EVERY_HOURS",
	},
	{
		label: getSchedulerTypeText("CUSTOM_DAILY_MINUTES"),
		value: "CUSTOM_DAILY_MINUTES",
	},
	{
		label: getSchedulerTypeText("CUSTOM_DAILY_HOURS"),
		value: "CUSTOM_DAILY_HOURS",
	},

	{
		label: getSchedulerTypeText("FRAME_HOURS"),
		value: "FRAME_HOURS",
	},
];

function createSchedulerMinutes(val: number): SchedulerTime[] {
	// Implementation for creating scheduler minutes
	val = Number(val);
	if (val < 0) {
		val = 1;
	}
	const newScheduler = [];
	const now = new Date();
	const oneMinute = 60 * 1000;
	let nextTime = new Date(now.setHours(0, 0, 0, 0));
	let day = nextTime.getDate();
	const nextDay = day + 1;

	let i = 0;

	while (day < nextDay && i < 1000) {
		nextTime = new Date(nextTime.getTime() + (val + random(0, 3)) * oneMinute);
		day = nextTime.getDate();
		if (day < nextDay) {
			const h = nextTime.getHours();
			const m = nextTime.getMinutes();
			newScheduler.push({ h, m });
		}

		++i;
	}

	newScheduler.sort((a, b) => {
		if (a.h === b.h) return a.m - b.m;
		return a.h - b.h;
	});

	return newScheduler as SchedulerTime[];
}

function createSchedulerHours(val: number): SchedulerTime[] {
	// Implementation for creating scheduler hours
	val = Number(val);
	if (val < 1) val = 1;
	if (val > 23) val = 23;
	const newScheduler = [];
	const now = new Date();
	const oneHours = 60 * 60 * 1000;
	let nextTime = new Date(now.setHours(0, 0, 0, 0));
	let day = nextTime.getDate();
	const nextDay = day + 1;

	let i = 0;

	while (day < nextDay && i < 1000) {
		nextTime = new Date(
			nextTime.getTime() + val * oneHours + random(-7, 7) * 1000 * 60,
		);
		day = nextTime.getDate();
		if (day < nextDay) {
			const h = nextTime.getHours();
			const m = nextTime.getMinutes();
			newScheduler.push({ h, m });
		}

		++i;
	}

	newScheduler.sort((a, b) => {
		if (a.h === b.h) {
			return a.m - b.m;
		}
		return a.h - b.h;
	});

	return newScheduler as SchedulerTime[];
}

function createSchedulerDailyHours(): SchedulerTime[] {
	const newScheduler = [];
	for (let i = 0; i < 24; i++) {
		newScheduler.push({ h: i, m: 0 });
	}
	return newScheduler;
}

export {
	getSchedulerTypeText,
	SCHEDULER_TYPE_LIST,
	createSchedulerHours,
	createSchedulerMinutes,
	createSchedulerDailyHours,
};
