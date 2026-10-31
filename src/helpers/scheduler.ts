import getTextWithLanguage from "@/helpers/language";
import type {
  SchedulerTime,
  SchedulerType,
} from "@/services/scheduler-service";
import { random } from "@/utils/utils";

const getSchedulerTypeText = (type: SchedulerType) => {
  switch (type) {
    case "EVERY_MINUTES":
      return getTextWithLanguage({
        en: "Every N minutes",
        vi: "Lặp lại theo phút",
      });
    case "EVERY_HOURS":
      return getTextWithLanguage({
        en: "Every N hours",
        vi: "Lặp lại theo giờ",
      });
    case "CUSTOM_DAILY_MINUTES":
      return getTextWithLanguage({
        en: "Custom daily minutes",
        vi: "Tùy chỉnh theo phút mỗi ngày",
      });
    case "CUSTOM_DAILY_HOURS":
      return getTextWithLanguage({
        en: "Custom daily hours",
        vi: "Tùy chỉnh theo giờ mỗi ngày",
      });
    case "DAILY_HOURS":
      return getTextWithLanguage({
        en: "Daily hours",
        vi: "Giờ chạy hằng ngày",
      });
    case "FRAME_HOURS":
      return getTextWithLanguage({ en: "Frame hours", vi: "Theo khung giờ" });
    default:
      return getTextWithLanguage({ en: "Unknown", vi: "Không xác định" });
  }
};

const SCHEDULER_TYPE_LIST: { label: string; value: SchedulerType }[] = [
  {
    get label() {
      return getSchedulerTypeText("DAILY_HOURS");
    },
    value: "DAILY_HOURS",
  },
  {
    get label() {
      return getSchedulerTypeText("EVERY_MINUTES");
    },
    value: "EVERY_MINUTES",
  },
  {
    get label() {
      return getSchedulerTypeText("EVERY_HOURS");
    },
    value: "EVERY_HOURS",
  },
  {
    get label() {
      return getSchedulerTypeText("CUSTOM_DAILY_MINUTES");
    },
    value: "CUSTOM_DAILY_MINUTES",
  },
  {
    get label() {
      return getSchedulerTypeText("CUSTOM_DAILY_HOURS");
    },
    value: "CUSTOM_DAILY_HOURS",
  },

  {
    get label() {
      return getSchedulerTypeText("FRAME_HOURS");
    },
    value: "FRAME_HOURS",
  },
];

function createSchedulerMinutes(val: number): SchedulerTime[] {
  val = Number(val);
  if (val < 0) {
    val = 1;
  }
  const newScheduler = [];

  let i = 0;

  let hours = 0,
    miniutes = val;

  const set = new Set<SchedulerTime>();

  while (hours < 24 && i < 1000) {
    if (miniutes >= 60) {
      while (miniutes >= 60) {
        miniutes -= 60;
        ++hours;
      }
    }
    if (hours >= 24) {
      break;
    }

    set.add({ h: hours, m: miniutes + random(-2, 4) });

    miniutes += val;

    ++i;
  }

  let idx = 0;

  for (const item of set) {
    if (item.h < 24) {
      if (newScheduler.length) {
        const prev = newScheduler[idx - 1];
        const diff = item.h * 60 + item.m - (prev.h * 60 + prev.m);
        if (diff < val - 5) {
          continue;
        }
      }

      newScheduler.push(item);
      ++idx;
    }
  }

  newScheduler.sort((a, b) => {
    if (a.h === b.h) return a.m - b.m;
    return a.h - b.h;
  });

  return newScheduler;
}

function createSchedulerHours(val: number): SchedulerTime[] {
  // Implementation for creating scheduler hours
  val = Number(val);
  if (val < 1) val = 1;
  if (val > 23) val = 23;
  const newScheduler = [];

  let i = 0;

  let hours = 0,
    minutes = 0;

  while (i < 1000 && hours < 24) {
    if (hours >= 24) {
      break;
    }

    newScheduler.push({ h: hours, m: minutes + random(-5, 5) });

    hours += val;

    i++;
  }

  newScheduler.sort((a, b) => {
    if (a.h === b.h) {
      return a.m - b.m;
    }
    return a.h - b.h;
  });

  return newScheduler;
}

function createSchedulerDailyHours(): SchedulerTime[] {
  const newScheduler = [];
  for (let i = 0; i < 24; i++) {
    newScheduler.push({ h: i, m: 0 });
  }
  return newScheduler;
}

function getScheduerWithType(type: SchedulerType, value: number) {
  switch (type) {
    case "CUSTOM_DAILY_MINUTES":
      return createSchedulerMinutes(value);
    case "CUSTOM_DAILY_HOURS":
      return createSchedulerHours(value);
    case "DAILY_HOURS":
      return createSchedulerDailyHours();
    default:
      return null;
  }
}

export {
  getSchedulerTypeText,
  SCHEDULER_TYPE_LIST,
  createSchedulerHours,
  createSchedulerMinutes,
  createSchedulerDailyHours,
  getScheduerWithType,
};
