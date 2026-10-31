import getTextWithLanguage from "@/helpers/language";
import type { CommentWalk, IError, TypeBase64 } from "@/types/types";
import { commentWalkService } from "@/services/comment-walk-service";
import fileService from "@/services/file-service";
import {
  parseBase64ToFile,
  parseBlobToFile,
  parseFileToObjectBase64,
  parseUrlToBlob,
} from "@/utils/utils";
import { KEY_IMPORT_EXPORT_TYPE } from "@/constants/constants";

async function handleImportCommentWalk(
  callBack?: (data: CommentWalk[] | IError) => void,
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
          reader.onload = async (event) => {
            try {
              const json = JSON.parse(event.target?.result as string);
              const clean = await handleCleanCommentWalk(json);

              const res = await commentWalkService.importData(
                Array.isArray(clean) ? clean : [clean],
              );
              callBack?.(res);
            } catch (err) {
              callBack({
                error: {
                  message:
                    err.message ||
                    getTextWithLanguage({
                      en: "Error import data",
                      vi: "Không thể nhập dữ liệu",
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
                en: "Error reading file",
                vi: "Không thể đọc tệp",
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
          error?.message ||
          getTextWithLanguage({
            en: "Error launching dialog",
            vi: "Không thể mở hộp thoại",
          }),
      },
    });
  }
}

async function handleCleanCommentWalk(data: any): Promise<any> {
  let flagError = false;

  async function deep(data: any): Promise<any> {
    if (flagError) {
      return;
    }
    try {
      if (Array.isArray(data)) {
        return await Promise.all(data.map(async (item) => await deep(item)));
      }

      if (
        data[KEY_IMPORT_EXPORT_TYPE.KEY_FIELD_OBJECT_TYPE] !==
        KEY_IMPORT_EXPORT_TYPE.COMMENT_WALK
      ) {
        flagError = true;
        throw new Error(
          getTextWithLanguage({
            en: "Invalid data file type",
            vi: "Loại tệp dữ liệu không hợp lệ",
          }),
        );
      }

      let urls: string[] = [];
      if (data.files && Array.isArray(data.files)) {
        const listObjectBase64 = data.files as (TypeBase64 | string)[];
        const filesToUpload: File[] = [];
        const directUrls: string[] = [];

        for (const item of listObjectBase64) {
          if (typeof item === "string") {
            directUrls.push(item);
          } else if (item && typeof item === "object" && item.base64Data) {
            filesToUpload.push(parseBase64ToFile(item));
          }
        }

        if (filesToUpload.length > 0) {
          const uploadedUrls = await fileService.uploadFiles(filesToUpload);
          urls = [...directUrls, ...uploadedUrls];
        } else {
          urls = directUrls;
        }
      }

      const dataClean: Partial<CommentWalk> = {
        name: data?.name || "",
        title_query_searchs: data?.title_query_searchs || [],
        contents: Array.isArray(data?.contents) ? data.contents : [],
        files: urls,
        keyword_query_includes: Array.isArray(data?.keyword_query_includes)
          ? data.keyword_query_includes
          : [],
        keyword_query_excludes: Array.isArray(data?.keyword_query_excludes)
          ? data.keyword_query_excludes
          : [],
        keywords_certain_choice: Array.isArray(data?.keywords_certain_choice)
          ? data.keywords_certain_choice
          : [],
        match_rate_value_content_query_includes:
          Number(data?.match_rate_value_content_query_includes) || 1,
        description_for_ai: data?.description_for_ai || "",
      };

      return dataClean;
    } catch (error) {
      flagError = true;
      throw error;
    }
  }

  return await deep(data);
}

async function handleExportCommentWalk(data: any) {
  try {
    let dataExport: any = null;

    async function handleSolveItem(item: any) {
      const urls = (item.files as string[]) || [];
      const listObjectBase64 = await Promise.all(
        urls.map(async (url) => {
          try {
            const blob = await parseUrlToBlob(url);
            const file = parseBlobToFile(blob, url);
            return await parseFileToObjectBase64(file);
          } catch (e) {
            console.error("Error converting file to base64:", e);
            return null;
          }
        }),
      );

      return {
        name: item.name || "",
        title_query_searchs: item.title_query_searchs || "",
        contents: item.contents || [],
        keyword_query_includes: item.keyword_query_includes || [],
        keyword_query_excludes: item.keyword_query_excludes || [],
        keywords_certain_choice: item.keywords_certain_choice || [],
        match_rate_value_content_query_includes:
          item.match_rate_value_content_query_includes ?? 1,
        description_for_ai: item.description_for_ai || "",
        files: listObjectBase64.filter(Boolean),
        [KEY_IMPORT_EXPORT_TYPE.KEY_FIELD_OBJECT_TYPE]:
          KEY_IMPORT_EXPORT_TYPE.COMMENT_WALK,
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

    const json = JSON.stringify(dataExport, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    if (Array.isArray(dataExport)) {
      const date = new Date().toLocaleString("vi-VN");
      const name = date.replaceAll(/[/\s:-]/g, "_");
      a.download = `list_comment_walk_${name}.json`;
    } else {
      a.download = `comment_walk_for_${data?.name || data?.title_query_searchs || "export"}.json`;
    }
    a.click();
  } catch (error) {
    console.error("Error exporting comment walk:", error);
  }
}

export {
  handleImportCommentWalk,
  handleCleanCommentWalk,
  handleExportCommentWalk,
};
