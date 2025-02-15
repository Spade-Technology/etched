import { TextArea } from "@/components/ui/autoresize-textarea";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Etch, EtchCommentAdded } from "@/gql/graphql";
import { lit } from "@/LitClientSide";
import { api } from "@/utils/api";
import { shortenAddress } from "@/utils/hooks/address";
import { useCommentEtch } from "@/utils/hooks/useCommentBackendOperation";
import { useLoggedInAddress, useSignIn } from "@/utils/hooks/useSignIn";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import Avatar from "boring-avatars";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type CommentProps = {
  imgUrl?: string;
  userName: string;
  description: string;
  commentedAt: number;
  addr: string;
};

export const EtchedAvatar = ({ uid }: { uid: string }) => (
  <Avatar size={40} name={uid.toLowerCase()} variant="beam" colors={["#077844", "#147c60", "#f1f5f9", "#6b9568", "#64748b"]} />
);

const Comment = ({ imgUrl, userName, description, commentedAt, addr }: CommentProps) => (
  <div className="flex justify-start gap-3 py-5">
    {imgUrl ? (
      <Image src={imgUrl} width={40} height={40} alt={description} className="mt-3 aspect-square h-10 w-10 rounded" />
    ) : (
      <EtchedAvatar uid={addr} />
    )}
    <div className="w-full">
      <div className="flex items-center gap-3">
        <div className="pt-2 text-base font-semibold text-muted-foreground">{userName}</div>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>
              <div className="pt-2 text-base font-normal text-muted-foreground">
                <p>{dayjs.unix(commentedAt).format("YYYY.MM.DD HH:mm")}</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>{dayjs.unix(commentedAt).from(dayjs())}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {description ? (
        <div className="whitespace-pre-wrap pt-2 text-base font-medium text-muted-foreground">{description}</div>
      ) : (
        <div className="mt-2 w-full space-y-2">
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-300"></div>
          <div className="h-4 w-5/6 animate-pulse rounded bg-gray-300"></div>
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-300"></div>
        </div>
      )}
    </div>
  </div>
);

const Comments = ({ etch, hasWritePermission }: { etch: Partial<Etch>; hasWritePermission: boolean }) => {
  const [comments, setComments] = useState<Record<string, { comment: string; timestamp: number; owner: string; addr: string }>>(
    {}
  );
  const [profilePics, setProfilePics] = useState<Record<string, string | undefined>>({});
  const { addComment, isLoading, newComment, setNewComment } = useCommentEtch(etch?.documentName, etch.tokenId);
  const { regenerateAuthSig } = useSignIn();
  const owner = useLoggedInAddress();
  const { mutateAsync: getClerkUsers } = api.user.getClerkUser.useMutation();

  const handleComment = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(evt.target.value);
  };

  const memoizedDecrypt = useMemo(() => {
    const cache = new Map();
    const _decrypt = (comment: EtchCommentAdded) => {
      if (cache.has(comment.commentId)) {
        return Promise.resolve(cache.get(comment.commentId));
      }

      const decryptPromise = (async () => {
        await lit.connect();

        if (!lit.client) return;

        const authSig = await regenerateAuthSig();

        try {
          const decryptedObject = await lit.decryptFromIpfs({ authSig, ipfsCid: comment.comment_commentIpfsCid });
          const decryptedComment = decryptedObject?.data as string;

          if (decryptedComment) {
            cache.set(comment.commentId, decryptedComment);
            return decryptedComment;
          }
        } catch (e) {
          if (e instanceof Error) {
            alert(e.message);
          } else {
            alert("An unknown error occurred during decryption.");
          }
        }
      })();

      cache.set(comment.commentId, decryptPromise);

      return decryptPromise;
    };
    return _decrypt;
  }, []); // Dependencies array is empty, meaning it will only compute this once

  useEffect(() => {
    const decryptAndSetComments = async () => {
      const decryptedComments = await Promise.all((etch.comments || []).map(memoizedDecrypt));
      const commentsMap = decryptedComments.reduce((acc, decryptedComment, index) => {
        const comment = etch.comments![index];
        if (!comment?.commentId) return acc;
        if (decryptedComment) {
          acc[comment.commentId] = {
            comment: decryptedComment,
            timestamp: comment.comment_timestamp,
            addr: comment.owner.id,
            owner: comment.owner.etchENS[0]?.name || shortenAddress({ address: comment.owner.id }),
          };
        }
        return acc;
      }, {} as Record<string, { comment: string; timestamp: number; owner: string; addr: string }>);
      setComments(commentsMap);
    };

    decryptAndSetComments();
  }, [etch.comments]);

  useEffect(() => {
    const fetchProfilePics = async () => {
      const uniqueWalletIds = Array.from(new Set(etch.comments?.map((comment) => comment.owner.id)));
      const users = await getClerkUsers({ externalId: uniqueWalletIds });
      const picsMap = users.reduce((acc, user) => {
        acc[user.externalId as string] = user.imageUrl;
        return acc;
      }, {} as Record<string, string | undefined>);
      setProfilePics(picsMap);
    };

    fetchProfilePics();
  }, [etch.comments]);

  return (
    <div className="my-6 rounded-2xl bg-muted p-7 dark:bg-background">
      <div className="text-xl font-semibold">{Object.keys(comments).length} Comments</div>
      <div className="py-5">
        <div className="flex justify-start gap-3">
          <EtchedAvatar uid={owner} />
          <TextArea
            disabled={isLoading || !hasWritePermission}
            placeholder="Add a comment"
            value={newComment}
            onChange={handleComment}
            className={!hasWritePermission ? "cursor-not-allowed" : ""}
          />
          {newComment && (
            <Button
              className="float-right rounded-lg duration-500"
              onClick={addComment}
              isLoading={isLoading || !hasWritePermission}
            >
              <PaperPlaneIcon />
            </Button>
          )}
        </div>
      </div>
      {(etch.comments || []).map((rawCommentData, idx) => {
        const decryptedCommentData = comments[rawCommentData.commentId];
        return (
          <Comment
            key={idx}
            userName={
              decryptedCommentData
                ? decryptedCommentData.owner
                : rawCommentData.owner?.etchENS[0]?.name || shortenAddress({ address: rawCommentData.owner?.id })
            }
            description={decryptedCommentData ? decryptedCommentData.comment : ""}
            commentedAt={decryptedCommentData ? decryptedCommentData.timestamp : rawCommentData.comment_timestamp}
            addr={rawCommentData.owner?.id}
            imgUrl={profilePics[rawCommentData.owner?.id]}
          />
        );
      })}
    </div>
  );
};

export default Comments;
