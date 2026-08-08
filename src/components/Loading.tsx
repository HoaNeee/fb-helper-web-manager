import { Classic } from "./classic";

type LoadingProps = {
  fullScreen?: boolean;
  title?: string;
  size?: number;
};

export default function Loading({
  fullScreen = true,
  title = "Đang tải...",
  size = 8,
}: LoadingProps) {
  return (
    <div
      className={`${fullScreen ? "w-full h-dvh" : "w-full h-full"} flex items-center justify-center`}
    >
      <div className="flex flex-col items-center justify-center">
        <Classic className={`size-${size}`} />
        <span className="text-slate-800 dark:text-slate-100 mt-2">{title}</span>
      </div>
    </div>
  );
}
