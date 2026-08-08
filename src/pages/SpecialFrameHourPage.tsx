import SpecialFrameHourTabComponent from "@/components/SpecialFrameHourTabComponent";

export default function SpecialFrameHourPage() {
  return (
    <div className="w-full h-full py-3 px-5 flex flex-col gap-2">
      <h1 className="text-xl font-semibold">Special Frame Hours</h1>
      <SpecialFrameHourTabComponent mode="page" />
    </div>
  );
}
