import AlertComponent from "@/components/AlertComponent";
import { Button } from "../components/Button";
import toastHepler from "@/helpers/toast-helper";
import { Classic } from "@/components/classic";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-4">
      <Button
        text="Click"
        variant="primary"
        onClick={() => {
          toastHepler({
            message:
              "Test toast very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very",
            type: "warning",
          });
        }}
      />
      <Button text="Delete" variant="danger" />
      <AlertComponent type="info" title="Error test very long" />
      <Classic className="size-10" />
      {/* <DialogLoading /> */}
    </div>
  );
}
