import { Button } from "@/components/Button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import interactBeforePostService from "@/services/ineract-post-service";
import { handleExceptionGlobal } from "@/utils/exception";
import Loading from "@/components/Loading";

export default function InteractBeforePostPage() {
  const [maxInteractPerBatch, setMaxInteractPerBatch] = useState(0);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function fetchMaxInteractPerBatch() {
      try {
        setLoading(true);
        const data =
          await interactBeforePostService.getMaxPostInteractPerBatch();
        setMaxInteractPerBatch(data);
      } catch (error) {
        handleExceptionGlobal(error);
      } finally {
        setLoading(false);
      }
    }
    fetchMaxInteractPerBatch();
  }, []);

  const handleSave = async () => {
    try {
      setActionLoading(true);
      await interactBeforePostService.saveMaxPostInteractPerBatch(
        maxInteractPerBatch,
      );
    } catch (error) {
      handleExceptionGlobal(error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loading type="page" />;

  return (
    <>
      {actionLoading && <Loading type="dialog" />}
      <div className="w-full h-full p-3">
        <h2 className="text-lg font-medium">Interact Before Post</h2>
        <div className="pt-6">
          <Field className="max-w-md w-full">
            <FieldLabel>Number of post intereact per batch</FieldLabel>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                placeholder="Ex: 1,2,3,..."
                value={maxInteractPerBatch}
                onChange={(e) => setMaxInteractPerBatch(Number(e.target.value))}
              />
              <Button text="Save" onClick={handleSave} size="md" />
            </div>
          </Field>
        </div>
      </div>
    </>
  );
}
