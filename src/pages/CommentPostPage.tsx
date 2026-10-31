import { useLanguage } from "@/hooks/useLanguage";
import getTextWithLanguage from "@/helpers/language";
import { Button } from "@/components/Button";
import Loading from "@/components/Loading";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import commentPostService from "@/services/comment-post-service";
import { handleExceptionGlobal } from "@/utils/exception";

import { useEffect, useState } from "react";

export default function CommentAfterPostPage() {
  useLanguage();
  const [contents, setContents] = useState<string[]>([]);
  const [maxCommentPerPost, setMaxCommentPerPost] = useState(0);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await commentPostService.getCommentPost();
        setContents(data?.contents || []);
        setMaxCommentPerPost(data?.max_comment_per_post || 0);
      } catch (error) {
        handleExceptionGlobal(
          error,
          getTextWithLanguage({
            en: "Failed to load comment post",
            vi: "Lỗi tải bình luận sau khi đăng bài",
          }),
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleSaveMaxComment() {
    try {
      setActionLoading(true);
      await commentPostService.updateCommentPost({
        max_comment_per_post: maxCommentPerPost,
      });
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to update max comment per post",
          vi: "Lỗi cập nhật số bình luận cho mỗi bài đăng",
        }),
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleSaveListContent() {
    try {
      setActionLoading(true);
      await commentPostService.updateCommentPost({
        contents: contents,
      });
    } catch (error) {
      handleExceptionGlobal(
        error,
        getTextWithLanguage({
          en: "Failed to update list content",
          vi: "Lỗi cập nhật danh sách nội dung",
        }),
      );
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <Loading type="page" />;

  return (
    <>
      {actionLoading && <Loading type="dialog" />}
      <div className="w-full h-full p-3">
        <h2 className="text-lg font-medium">
          {getTextWithLanguage({
            en: "Comment after Post",
            vi: "Bình luận sau khi đăng bài",
          })}
        </h2>
        <div className="pt-6 flex flex-col gap-6">
          <Field className="max-w-md w-full">
            <FieldLabel>
              {getTextWithLanguage({
                en: "Number of comments per post",
                vi: "Số bình luận cho mỗi bài đăng",
              })}
            </FieldLabel>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                placeholder={getTextWithLanguage({
                  en: "Ex: 1,2,3,...",
                  vi: "VD: 1,2,3,...",
                })}
                value={maxCommentPerPost}
                onChange={(e) => setMaxCommentPerPost(Number(e.target.value))}
              />
              <Button
                text={getTextWithLanguage({
                  en: "Save",
                  vi: "Lưu",
                })}
                onClick={handleSaveMaxComment}
                size="md"
              />
            </div>
          </Field>

          <Field>
            <FieldLabel>
              {getTextWithLanguage({
                en: "List comment (Each comment on a separate line)",
                vi: "Danh sách bình luận (mỗi bình luận trên một dòng)",
              })}
            </FieldLabel>
            <div className="">
              <Textarea
                placeholder={getTextWithLanguage({
                  en: "Ex: Message me for details",
                  vi: "VD: Nhắn tin cho tôi để biết thêm chi tiết",
                })}
                value={contents.join("\n")}
                onChange={(e) => setContents(e.target.value.split("\n"))}
              />
              <div className="flex justify-end mt-3">
                <Button
                  text={getTextWithLanguage({
                    en: "Save list content",
                    vi: "Lưu danh sách nội dung",
                  })}
                  onClick={handleSaveListContent}
                />
              </div>
            </div>
          </Field>
        </div>
      </div>
    </>
  );
}
