import { useLanguage } from "@/hooks/useLanguage";
import getTextWithLanguage from "@/helpers/language";
import AlertComponent from "@/components/AlertComponent";
import { Button } from "../components/Button";
import toastHepler from "@/helpers/toast-helper";
import { Classic } from "@/components/classic";

export default function HomePage() {
	useLanguage();
	return (
		<div className="flex flex-col gap-4 w-full h-full">
			{/* <Button
        text={getTextWithLanguage({ en: "Click", vi: "Nhấn thử" })}
        variant="primary"
        onClick={() => {
          toastHepler({
            message:
              getTextWithLanguage({ en: "Test notification", vi: "Thông báo thử nghiệm" }),
            type: "warning",
          });
        }}
      />
      <Button text={getTextWithLanguage({ en: "Delete", vi: "Xóa" })} variant="danger" />
      <AlertComponent type="info" title={getTextWithLanguage({
        en: "Error test very long",
        vi: "Thông báo lỗi thử nghiệm dài",
      })} />
      <Classic className="size-10" /> */}
			{/* <DialogLoading /> */}

			<div className="w-full h-full flex justify-center items-center text-4xl sm:text-7xl font-bold">
				<h2>
					{getTextWithLanguage({
						vi: "Xin chào",
						en: "Welcome",
					})}
				</h2>
			</div>
		</div>
	);
}
