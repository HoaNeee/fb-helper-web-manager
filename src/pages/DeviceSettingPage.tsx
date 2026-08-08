import DataGroupPostTab from "@/components/DataGroupPostTab";
import DeviceSettingTab from "@/components/DeviceSettingTab";
import SchedulerTab from "@/components/SchedulerTab";
import SpecialFrameHourTab from "@/components/SpecialFrameHourTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import getTextWithLanguage from "@/helpers/language";
import { useParams } from "react-router";

export default function DeviceSettingPage() {
  const param = useParams<{ deviceId: string }>();

  const deviceId = param.deviceId;

  if (!deviceId) {
    return (
      <div className="flex items-center justify-center h-full">
        Không tìm thấy thiết bị
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden">
      <Tabs defaultValue={"scheduler"} className={"w-full h-full"}>
        <TabsList variant="line">
          <TabsTrigger value="device-setting">
            {getTextWithLanguage({
              vi: "Cài đặt thiết bị",
              en: "Device setting",
            })}
          </TabsTrigger>
          <TabsTrigger value="data-group-post">
            {getTextWithLanguage({
              vi: "Dữ liệu nhóm cần đăng",
              en: "Data group post",
            })}
          </TabsTrigger>
          <TabsTrigger value="scheduler">
            {getTextWithLanguage({
              vi: "Bộ lịch",
              en: "Scheduler",
            })}
          </TabsTrigger>
          <TabsTrigger value="special-frame-hours">
            {getTextWithLanguage({
              vi: "Khung giờ đặc biệt",
              en: "Special frame hours",
            })}
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value={"device-setting"}
          className={
            "w-full h-full overflow-hidden overflow-y-scroll pb-12 py-6"
          }
        >
          <DeviceSettingTab />
        </TabsContent>
        <TabsContent
          value={"data-group-post"}
          className={"w-full h-full overflow-hidden"}
        >
          <DataGroupPostTab />
        </TabsContent>
        <TabsContent value={"scheduler"}>
          <SchedulerTab />
        </TabsContent>
        <TabsContent
          value={"special-frame-hours"}
          className={"w-full h-full overflow-hidden"}
        >
          <SpecialFrameHourTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
