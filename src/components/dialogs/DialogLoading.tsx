import { Classic } from "../classic";
import { Dialog, DialogContent } from "../ui/dialog";

type Props = {
  msg?: string;
};

export default function DialogLoading({ msg = "Đang tải..." }: Props) {
  return (
    <Dialog open={true}>
      <DialogContent
        className="flex items-center justify-center p-6 w-40"
        showCloseButton={false}
      >
        <div className="flex flex-col justify-center items-center gap-2">
          <Classic className="size-9" />
          <p className="text-sm">{msg}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
