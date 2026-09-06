import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { type Device } from "@/services/device-service";
import { Button, ButtonConfirm } from "../Button";
import { handleExceptionGlobal } from "@/utils/exception";
import deviceService from "@/services/device-service";
import { useParams } from "react-router";
import Loading from "../Loading";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSyncDevice: (target_device_id: string) => void;
};

export default function DialogSyncDevieSetting({
  open,
  onOpenChange,
  onSyncDevice,
}: Props) {
  const [listDevice, setListDevice] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);

  const params = useParams<{ deviceId: string }>();
  const deviceId = params.deviceId;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await deviceService.getAllDeviceByUser();
        const data = res.filter((d) => d.id !== deviceId);
        setListDevice(data);
      } catch (error) {
        handleExceptionGlobal(error);
      } finally {
        setLoading(false);
      }
    }
    if (open) {
      fetchData();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={
          "max-w-lg! h-full w-full max-h-[93vh] flex flex-col overflow-hidden"
        }
      >
        <DialogHeader>
          <DialogTitle>List device of user</DialogTitle>
        </DialogHeader>
        <div className="flex-1 w-full overflow-y-auto h-full flex flex-col gap-4">
          {loading ? (
            <Loading />
          ) : listDevice.length ? (
            listDevice.map((d) => {
              return (
                <div
                  key={d.id}
                  className="py-3 px-4 rounded-sm border border-gray-300 border-l-4 border-l-blue-500 flex items-center justify-between"
                >
                  <div className="">
                    <p className="font-medium">{d.device_name}</p>
                    <p className="text-xs">{d.device_type}</p>
                  </div>
                  <ButtonConfirm
                    title="Sync"
                    titleConfirm="Confirm Sync"
                    onConfirm={() => {
                      onSyncDevice(d.id);
                    }}
                  />
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              Không có thiết bị nào
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose render={<Button text="Cancel" variant="secondary" />} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
