export type SchedulerTime = {
  h: number;
  m: number;
};

export type Scheduler = {
  id?: number;
  scheduler_type: string;
  scheduler_detail: SchedulerDetail;
  device_id: string;
};

export type SchedulerDetail = {
  id?: number;
  scheduler_id?: number;
  scheduler_type: string;
  scheduler_time_value: number;
  scheduler_time_list: SchedulerTime[];
};

export type SchedulerType =
  | "EVERY_MINUTES"
  | "EVERY_HOURS"
  | "CUSTOM_DAILY_MINUTES"
  | "CUSTOM_DAILY_HOURS"
  | "DAILY_HOURS"
  | "FRAME_HOURS";

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

export { SCHEDULER_TYPE_LIST, getSchedulerTypeText };
