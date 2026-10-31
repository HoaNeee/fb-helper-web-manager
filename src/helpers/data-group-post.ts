import getTextWithLanguage from "@/helpers/language";
import type { IError, TypeBase64 } from "@/types/types";
import {
  dataGroupPostService,
  type DataGroupPost,
} from "@/services/data-group-post-service";
import fileService from "@/services/file-service";
import {
  genID,
  parseBase64ToFile,
  parseBlobToFile,
  parseFileToObjectBase64,
  parseUrlToBlob,
} from "@/utils/utils";
import { KEY_IMPORT_EXPORT_TYPE } from "@/constants/constants";

async function handleImportDataGroupPost(
  callBack?: (data: DataGroupPost[] | IError) => void,
) {
  try {
    const a = document.createElement("input");
    a.type = "file";
    a.accept = ".json";
    a.onchange = (e: Event) => {
      try {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const json = JSON.parse(e.target?.result as string);
              let clean = await handleCleanDataGroupPost(json);
              if (!Array.isArray(clean)) {
                clean = [clean];
              }
              const res = await dataGroupPostService.importData(clean);
              callBack?.(res);
            } catch (error) {
              callBack?.({
                error: {
                  message:
                    error.message ||
                    getTextWithLanguage({
                      en: "Error import data group post",
                      vi: "Không thể nhập dữ liệu bài đăng nhóm",
                    }),
                },
              });
            }
          };
          reader.readAsText(file);
        } else {
          callBack?.([]);
        }
      } catch (error) {
        callBack({
          error: {
            message:
              error.message ||
              getTextWithLanguage({
                en: "Error import data group post",
                vi: "Không thể nhập dữ liệu bài đăng nhóm",
              }),
          },
        });
      }
    };
    a.oncancel = () => {
      callBack?.([]);
    };
    a.click();
  } catch (error) {
    callBack?.({
      error: {
        message:
          error.message ||
          getTextWithLanguage({
            en: "Error import data group post",
            vi: "Không thể nhập dữ liệu bài đăng nhóm",
          }),
      },
    });
  }
}

async function handleCleanDataGroupPost(data: any) {
  let flagError = false;

  async function deep(data: any) {
    if (flagError) return;

    try {
      if (Array.isArray(data)) {
        return await Promise.all(
          data.map((item) => handleCleanDataGroupPost(item)),
        );
      }
      if (
        data[KEY_IMPORT_EXPORT_TYPE.KEY_FIELD_OBJECT_TYPE] &&
        data[KEY_IMPORT_EXPORT_TYPE.KEY_FIELD_OBJECT_TYPE] !==
          KEY_IMPORT_EXPORT_TYPE.DATA_GROUP_POST
      ) {
        flagError = true;
        throw new Error(
          getTextWithLanguage({
            en: "Error import data type",
            vi: "Loại dữ liệu nhập không hợp lệ",
          }),
        );
      }

      const listObjectBase64 = data.files as TypeBase64[];
      const files = listObjectBase64.map((obj) => {
        return parseBase64ToFile(obj);
      });

      const urls = await fileService.uploadFiles(files);

      const dataClean: Partial<DataGroupPost> = {
        title: data.title,
        name: data.name,
        contents: data.contents,
        files: urls,
        priority: data?.priority || 1,
        from_member: data?.from_member || 0,
        to_member: data?.to_member || 0,
      };
      return dataClean;
    } catch (error) {
      flagError = true;
      throw error;
    }
  }

  return await deep(data);
}

async function handleExportDataGroupPost(data: any) {
  try {
    let dataExport = null;

    async function handleSolveItem(item: any) {
      const urls = item.files as string[];
      const listObjectBase64 = await Promise.all(
        urls.map(async (url) =>
          parseFileToObjectBase64(
            parseBlobToFile(await parseUrlToBlob(url), url),
          ),
        ),
      );

      return {
        title: item.title,
        name: item.name,
        contents: item.contents,
        priority: item.priority,
        from_member: item.from_member,
        to_member: item.to_member,
        files: listObjectBase64,
        [KEY_IMPORT_EXPORT_TYPE.KEY_FIELD_OBJECT_TYPE]:
          KEY_IMPORT_EXPORT_TYPE.DATA_GROUP_POST,
      };
    }

    if (Array.isArray(data)) {
      dataExport = await Promise.all(
        data.map(async (item) => {
          return await handleSolveItem(item);
        }),
      );
    } else {
      dataExport = await handleSolveItem(data);
    }

    const json = JSON.stringify(dataExport);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    if (Array.isArray(dataExport)) {
      const date = new Date().toLocaleString("vi-VN");
      const name = date.replaceAll(/[/\s:-]/g, "_");
      a.download = `list_data_group_post_${name}.json`;
    } else {
      a.download = `data_group_post_for_${data?.name || data.title}.json`;
    }
    a.click();
  } catch (error) {
    console.log(error);
  }
}

export { handleImportDataGroupPost, handleExportDataGroupPost };
