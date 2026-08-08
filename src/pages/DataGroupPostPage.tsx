import Button from "@/components/Button";
import DialogAddOrUpdateDataGroupPost from "@/components/dialogs/DialogAddOrUpdateDataGroupPost";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  DEFAULT_LIST_DATA_GROUP_POST,
  type DataGroupPost,
} from "@/services/data-group-post-service";
import { Eye } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function DataGroupPostPage() {
  const [dataGroupPosts, setDataGroupPosts] = useState<
    Partial<DataGroupPost>[]
  >(DEFAULT_LIST_DATA_GROUP_POST);
  const [openDialogViewDetail, setOpenDialogViewDetail] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const [dataGroupPostSeleted, setDataGroupPostSeleted] =
    useState<Partial<DataGroupPost>>();

  useEffect(() => {
    if (!openDialogViewDetail) {
      setDataGroupPostSeleted(undefined);
    }
  }, [openDialogViewDetail]);

  const handleOnsubmit = useCallback(
    (mode: "edit" | "add", payload: Partial<DataGroupPost>) => {
      if (mode === "add") {
        console.log(payload);
        setDataGroupPosts((prev) => [...prev, payload]);
        setOpenAdd(false);
        return;
      }

      const id = payload?.id;

      const newList = dataGroupPosts.map((dgp) => {
        if (dgp.id === id) {
          return payload;
        }
        return dgp;
      });

      setDataGroupPosts(newList);

      setOpenDialogViewDetail(false);
    },
    [dataGroupPosts],
  );
  return (
    <>
      <div className="h-full p-2">
        <h2 className="text-xl font-medium">Data Group Post</h2>
        <div className="flex flex-col py-4 px-6 gap-3 overflow-hidden h-full">
          <div className="mb-3">
            <Button
              size="md"
              type="submit"
              onClick={() => {
                setOpenAdd(true);
              }}
            >
              Add Data Group Post
            </Button>
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto h-full">
            {dataGroupPosts.map((dgp) => {
              return (
                <div
                  key={dgp.id}
                  className="flex items-center gap-1 p-3 border border-l-4 border-l-(--bg-btn-primary) rounded-md hover:shadow-sm transition-all duration-300"
                >
                  <div className="w-auto flex-1">
                    <p className="text-base font-medium">
                      {dgp.name || dgp.title}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="xs"
                      className="rounded-sm"
                      onClick={() => {
                        setOpenDialogViewDetail(true);
                        setDataGroupPostSeleted(dgp);
                      }}
                      text="View"
                    />
                    <Button
                      text="Uncheck all devices"
                      size="xs"
                      className="rounded-sm hover:bg-red-500 hover:text-white"
                      variant="danger"
                      outline
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <DialogAddOrUpdateDataGroupPost
        open={openDialogViewDetail}
        onOpenChange={setOpenDialogViewDetail}
        onSave={(payload) => handleOnsubmit("edit", payload)}
        dataGroupPost={dataGroupPostSeleted}
        dialog_mode="edit"
      />

      <DialogAddOrUpdateDataGroupPost
        open={openAdd}
        onOpenChange={setOpenAdd}
        onSave={(payload) => handleOnsubmit("add", payload)}
        dialog_mode="add"
      />
    </>
  );
}
