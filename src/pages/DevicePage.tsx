import { Switch } from "@/components/ui/switch";
import { Database, Play, Settings2, Sliders, Square } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import type { Device } from "../services/device-service";
import deviceService from "../services/device-service";
import Loading from "@/components/Loading";

const INITIAL_DEVICES: Device[] = [
  {
    id: "dev-01",
    device_name: "Chrome Profile #01 (Main)",
    status: "RUNNING",
    created_at: new Date().toISOString(),
    device_type: "Chrome",
  },
  {
    id: "dev-02",
    device_name: "Chrome Profile #02 (Sub)",
    status: "SPAMMED",
    created_at: new Date().toISOString(),
    device_type: "Chrome",
  },
  {
    id: "dev-03",
    device_name: "Chrome Profile #03 (Sub)",
    status: "RUNNING",
    created_at: new Date().toISOString(),
    device_type: "Chrome",
  },
];

export default function DevicePage() {
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fn() {
      try {
        setLoading(true);
        const devices = await deviceService.getAllDeviceByUser();
        setDevices(devices);
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    }
    fn();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex-1">
      {/* Header Info */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
            <Database className="text-blue-500" size={24} />
            Quản lý thiết bị
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Quản lý và thiết lập trạng thái tự động đăng bài cho các tài
            khoản/cửa sổ Facebook của bạn.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex flex-col">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Tổng Thiết Bị
          </span>
          <span className="text-2xl font-bold mt-1 text-slate-800 dark:text-slate-100">
            {1}
          </span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex flex-col">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Đang Chạy Auto
          </span>
          <span className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            {1}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex flex-col">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Bị Spam/Checkpoint
          </span>
          <span className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">
            {1}
          </span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex flex-col">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Tổng Đã Đăng Hôm Nay
          </span>
          <span className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">
            {1}
          </span>
        </div>
      </div>

      {/* Device grid list */}
      {devices.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-12 text-center shadow-sm">
          <Sliders
            className="mx-auto text-slate-300 dark:text-zinc-700 mb-4"
            size={48}
          />
          <h3 className="text-lg font-medium text-slate-800 dark:text-zinc-200">
            Không tìm thấy thiết bị nào
          </h3>
          <p className="text-slate-400 dark:text-zinc-500 text-sm mt-1">
            Không có thiết bị nào phù hợp với bộ lọc tìm kiếm của bạn.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {devices.map((dev) => (
            <div
              key={dev.id}
              className={`bg-white dark:bg-zinc-900 border rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-700 flex flex-col overflow-hidden ${
                dev.status === "RUNNING"
                  ? "border-emerald-200 dark:border-emerald-950/60"
                  : dev.status === "SPAMMED"
                    ? "border-rose-200 dark:border-rose-950/60"
                    : "border-slate-200 dark:border-zinc-800"
              }`}
            >
              {/* Card Top: Device Info */}
              <div className="p-5 flex justify-between items-start gap-4 border-b border-slate-100 dark:border-zinc-800/80">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-slate-800 dark:text-zinc-100 truncate text-base">
                      {dev.device_name || "Thiết bị chưa có tên"}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        dev.status === "RUNNING"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : dev.status === "SPAMMED"
                            ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                            : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {dev.status === "RUNNING"
                        ? "Đang chạy"
                        : dev.status === "SPAMMED"
                          ? "Bị Spam"
                          : "Đang dừng"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Quick Toggles and Navigation */}
              <div className="px-5 py-4 bg-slate-50 dark:bg-zinc-950/20 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                {/* Toggles */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                      Lên lịch:
                    </span>
                    <Switch />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    size="md"
                    link
                    to={`/device/${dev.id}`}
                    text="Cài đặt"
                    icon={<Settings2 size={14} />}
                  />

                  <Button
                    size="md"
                    variant={dev.status === "RUNNING" ? "secondary" : "primary"}
                  >
                    {dev.status === "RUNNING" ? (
                      <>
                        <Square size={12} fill="white" />
                        Dừng Auto
                      </>
                    ) : (
                      <>
                        <Play size={12} fill="white" />
                        Chạy Auto
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
