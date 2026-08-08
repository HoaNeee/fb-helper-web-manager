import {
  DEFAULT_LIST_DATA_GROUP_POST,
  type DataGroupPost,
} from "@/services/data-group-post-service";
import { Eye } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Button from "./Button";
import DialogAddOrUpdateDataGroupPost from "./dialogs/DialogAddOrUpdateDataGroupPost";
import { Checkbox } from "./ui/checkbox";
import { Field, FieldLabel } from "./ui/field";

export default function DataGroupPostTab() {
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
              <div key={dgp.id} className="flex items-center gap-1">
                <Field orientation="horizontal" className="w-auto">
                  <Checkbox className={"size-4.5"} />
                  <FieldLabel className="text-base font-medium">
                    {dgp.name || dgp.title}
                  </FieldLabel>
                </Field>
                <Button
                  variant="outline"
                  size="xs"
                  className="rounded-md"
                  onClick={() => {
                    setOpenDialogViewDetail(true);
                    setDataGroupPostSeleted(dgp);
                  }}
                >
                  <Eye size={16} />
                </Button>
              </div>
            );
          })}
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
