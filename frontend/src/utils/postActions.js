import axios from "axios";
import { toast } from "react-toastify";

export const likePost = async ({
  postId,
  currentUserId,
  setLikedPostIds,
  setLikeAnimations,
  setPosts,
}) => {
  try {
    const res = await axios.patch(
      `http://localhost:8000/api/v1/post/${postId}/addlike`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    const liked = res.data.liked;

    setLikedPostIds((prev) => {
      const updated = new Set(prev);
      liked ? updated.add(postId) : updated.delete(postId);
      return updated;
    });

    if (liked) {
      setLikeAnimations((prev) => ({ ...prev, [postId]: true }));
      setTimeout(() => {
        setLikeAnimations((prev) => ({ ...prev, [postId]: false }));
      }, 600);
    }

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? {
              ...post,
              likes: liked
                ? [...(post.likes || []), currentUserId]
                : (post.likes || []).filter((id) => id !== currentUserId),
            }
          : post
      )
    );
  } catch (error) {
    console.error("Error liking post:", error);
  }
};

export const showComments = async ({
  postId,
  setSelectedPost,
  setShowCommentModal,
}) => {
  try {
    const res = await axios.get(
      `http://localhost:8000/api/v1/post/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    setSelectedPost(res.data.data);
    setShowCommentModal(true);
  } catch (error) {
    console.error("Error fetching post:", error);
  }
};

export const showLikes = async ({
  postId,
  setLikesList,
  setShowLikesModal,
}) => {
  try {
    const res = await axios.get(
      `http://localhost:8000/api/v1/post/${postId}/getlikes`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    setLikesList(res.data.data || []);
    setShowLikesModal(true);
  } catch (error) {
    console.error("Error fetching likes:", error);
    toast.error("Failed to load likes");
  }
};

export const addCommentOrReply = async ({
  selectedPost,
  commentText,
  replyingTo,
  setSelectedPost,
  setPosts,
  setRepliesData,
  setCommentText,
  setReplyingTo,
  setShowEmojiPicker,
}) => {
  if (!commentText.trim()) return;

  const accessToken = localStorage.getItem("accessToken");

  if (replyingTo) {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${selectedPost._id}/comment/${replyingTo}/addreplies`,
        { text: commentText },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const newReply = res.data.data;

      const updatedComments = selectedPost.comments.map((comment) =>
        comment._id === replyingTo
          ? {
              ...comment,
              replies: [...(comment.replies || []), newReply],
            }
          : comment
      );

      setSelectedPost((prev) => ({ ...prev, comments: updatedComments }));

      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: updatedComments }
            : p
        )
      );

      setRepliesData?.((prev) => {
        const existing = prev[replyingTo] || {
          replies: [],
          total: 0,
          page: 1,
          allLoaded: false,
          visible: true,
        };

        return {
          ...prev,
          [replyingTo]: {
            ...existing,
            replies: [...existing.replies, newReply],
            total: existing.total + 1,
          },
        };
      });

      setCommentText("");
      setReplyingTo(null);
      setShowEmojiPicker?.(false);
      toast.success("Reply added");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add reply");
    }
  } else {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${selectedPost._id}/comment`,
        { text: commentText },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const newComment = res.data.data;

      setSelectedPost((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), newComment],
      }));

      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: [...(p.comments || []), newComment] }
            : p
        )
      );

      setCommentText("");
      setShowEmojiPicker?.(false);
      toast.success("Comment added");
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to add comment");
    }
  }
};

export const deleteComment = async ({
  selectedPost,
  commentId,
  setSelectedPost,
  setPosts,
}) => {
  try {
    await axios.delete(
      `http://localhost:8000/api/v1/post/${selectedPost._id}/comment/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    setSelectedPost((prev) => ({
      ...prev,
      comments: prev.comments.filter((c) => c._id !== commentId),
    }));

    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p._id === selectedPost._id
          ? {
              ...p,
              comments: p.comments.filter((c) => c._id !== commentId),
            }
          : p
      )
    );

    toast.success("Comment deleted");
  } catch (error) {
    console.error("Error deleting comment:", error);
    toast.error("Failed to delete comment");
  }
};

export const likeComment = async ({
  selectedPost,
  commentId,
  currentUserId,
  setSelectedPost,
  setPosts,
}) => {
  try {
    const res = await axios.patch(
      `http://localhost:8000/api/v1/post/${selectedPost._id}/comment/${commentId}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    const liked = res.data.liked;

    const updatedComments = selectedPost.comments.map((comment) => {
      if (comment._id === commentId) {
        const updatedLikes = liked
          ? [...(comment.likes || []), currentUserId]
          : (comment.likes || []).filter((id) => id !== currentUserId);
        return { ...comment, likes: updatedLikes };
      }
      return comment;
    });

    setSelectedPost((prev) => ({
      ...prev,
      comments: updatedComments,
    }));

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === selectedPost._id
          ? { ...post, comments: updatedComments }
          : post
      )
    );
  } catch (error) {
    console.error("Error liking comment:", error);
  }
};

export const showCommentLikes = async ({
  postId,
  commentId,
  setCommentLikesList,
  setShowCommentLikesModal,
}) => {
  try {
    const res = await axios.get(
      `http://localhost:8000/api/v1/post/${postId}/comment/${commentId}/getlikes`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    setCommentLikesList(res.data.data || []);
    setShowCommentLikesModal(true);
  } catch (error) {
    console.error("Failed to fetch comment likes:", error);
    toast.error("Failed to load comment likes");
  }
};


export const deleteReply = async ({
  postId,
  commentId,
  replyId,
  setRepliesData,
}) => {
  try {
    const res = await axios.delete(
      `http://localhost:8000/api/v1/post/${postId}/comment/${commentId}/replies/${replyId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    if (res.data.success) {
      toast.success("Reply deleted");

      const fetchRes = await axios.get(
        `http://localhost:8000/api/v1/post/${postId}/comment/${commentId}/getreplies?page=1&limit=3`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const { replies, totalReplies } = fetchRes.data.data;

      setRepliesData((prev) => ({
        ...prev,
        [commentId]: {
          replies,
          total: totalReplies,
          page: 2,
          allLoaded: replies.length >= totalReplies,
          visible: replies.length > 0, // Hide if no replies
        },
      }));
    }
  } catch (error) {
    console.error("Error deleting reply:", error);
    toast.error("Failed to delete reply");
  }
};

export const fetchReplies = async ({
  postId,
  commentId,
  repliesData,
  setRepliesData,
}) => {
  const data = repliesData[commentId] || {
    replies: [],
    total: 0,
    page: 1,
    allLoaded: false,
    visible: true,
  };

  try {
    const res = await axios.get(
      `http://localhost:8000/api/v1/post/${postId}/comment/${commentId}/getreplies?page=${data.page}&limit=3`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    const { replies, totalReplies } = res.data.data;

    setRepliesData((prev) => ({
      ...prev,
      [commentId]: {
        replies: [...(prev[commentId]?.replies || []), ...replies],
        total: totalReplies,
        page: data.page + 1,
        allLoaded:
          (prev[commentId]?.replies?.length || 0) + replies.length >=
          totalReplies,
        visible: true,
      },
    }));
  } catch (error) {
    console.error("Failed to fetch replies:", error);
    toast.error("Failed to load replies");
  }
};

export const hideReplies = ({ commentId, setRepliesData }) => {
  setRepliesData((prev) => ({
    ...prev,
    [commentId]: {
      ...prev[commentId],
      visible: false,
    },
  }));
};


export const likeReply = async ({
  postId,
  commentId,
  replyId,
  currentUserId,
  setRepliesData,
}) => {
  try {
    const res = await axios.patch(
      `http://localhost:8000/api/v1/post/${postId}/comment/${commentId}/replies/${replyId}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    const liked = res.data.liked;

    setRepliesData((prev) => {
      const existing = prev[commentId];
      if (!existing) return prev;

      const updatedReplies = existing.replies.map((reply) => {
        if (reply._id === replyId) {
          const updatedLikes = liked
            ? [...(reply.likes || []), currentUserId]
            : (reply.likes || []).filter((id) => id !== currentUserId);
          return { ...reply, likes: updatedLikes };
        }
        return reply;
      });

      return {
        ...prev,
        [commentId]: {
          ...existing,
          replies: updatedReplies,
        },
      };
    });
  } catch (error) {
    console.error("Error liking reply:", error);
    toast.error("Failed to like reply");
  }
};


export const showReplyLikes = async ({
  postId,
  commentId,
  replyId,
  setReplyLikesList,
  setShowReplyLikesModal,
}) => {
  try {
    const res = await axios.get(
      `http://localhost:8000/api/v1/post/${postId}/comment/${commentId}/replies/${replyId}/getlikes`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    setReplyLikesList(res.data.data || []);
    setShowReplyLikesModal(true);
  } catch (error) {
    console.error("Failed to fetch reply likes:", error);
    toast.error("Failed to load reply likes");
  }
};
