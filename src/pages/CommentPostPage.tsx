import { Button } from "@/components/Button";
import Loading from "@/components/Loading";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import commentPostService from "@/services/comment-post-service";
import { handleExceptionGlobal } from "@/utils/exception";

import { useEffect, useState } from "react";

export default function CommentAfterPostPage() {
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
        handleExceptionGlobal(error);
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
      handleExceptionGlobal(error);
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
      handleExceptionGlobal(error);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <Loading type="page" />;

  return (
    <>
      {actionLoading && <Loading type="dialog" />}
      <div className="w-full h-full p-3">
        <h2 className="text-lg font-medium">Comment after Post</h2>
        <div className="pt-6 flex flex-col gap-6">
          <Field className="max-w-md w-full">
            <FieldLabel>Number comment per post</FieldLabel>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                placeholder="Ex: 1,2,3,..."
                value={maxCommentPerPost}
                onChange={(e) => setMaxCommentPerPost(Number(e.target.value))}
              />
              <Button text="Save" onClick={handleSaveMaxComment} size="md" />
            </div>
          </Field>

          <Field>
            <FieldLabel>
              List comment (Each comment on a separate line)
            </FieldLabel>
            <div className="">
              <Textarea
                placeholder="Ib"
                value={contents.join("\n")}
                onChange={(e) => setContents(e.target.value.split("\n"))}
              />
              <div className="flex justify-end mt-3">
                <Button
                  text="Save list content"
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
