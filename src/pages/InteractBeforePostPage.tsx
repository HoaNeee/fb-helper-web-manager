import { useLanguage } from "@/hooks/useLanguage";
import getTextWithLanguage from "@/helpers/language";
import { Button } from "@/components/Button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import interactBeforePostService from "@/services/ineract-post-service";
import { handleExceptionGlobal } from "@/utils/exception";
import Loading from "@/components/Loading";
import toastHepler from "@/helpers/toast-helper";

export default function InteractBeforePostPage() {
  useLanguage();
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
        handleExceptionGlobal(
          error,
          getTextWithLanguage({
            en: "Failed to get max interact per batch",
            vi: "Lỗi lấy số bài viết tương tác mỗi đợt",
          }),
        );
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
      toastHepler({
        message: getTextWithLanguage({
          en: "Max interact per batch updated successfully",
          vi: "Cập nhật số bài viết tương tác mỗi đợt thành công",
        }),
        type: "success",
      });
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to save max interact per batch",
          vi: "Lỗi lưu số bài viết tương tác mỗi đợt",
        }),
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loading type="page" />;

  return (
    <>
      {actionLoading && <Loading type="dialog" />}
      <div className="w-full h-full p-3">
        <h2 className="text-lg font-medium">
          {getTextWithLanguage({
            en: "Interact Before Post",
            vi: "Tương tác trước khi đăng bài",
          })}
        </h2>
        <div className="pt-6">
          <Field className="max-w-md w-full">
            <FieldLabel>
              {getTextWithLanguage({
                en: "Number of posts to interact with per batch",
                vi: "Số bài viết tương tác mỗi đợt",
              })}
            </FieldLabel>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                placeholder={getTextWithLanguage({
                  en: "Ex: 1,2,3,...",
                  vi: "VD: 1,2,3,...",
                })}
                value={maxInteractPerBatch}
                onChange={(e) => setMaxInteractPerBatch(Number(e.target.value))}
              />
              <Button
                text={getTextWithLanguage({ en: "Save", vi: "Lưu" })}
                onClick={handleSave}
                size="md"
              />
            </div>
          </Field>
        </div>
      </div>
    </>
  );
}
