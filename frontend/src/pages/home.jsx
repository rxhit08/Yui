import React, { useEffect, useRef, useState } from "react";
import axios from '../utils/axiosinstance.js'
import { IoArrowUndo } from "react-icons/io5";
import { FaRegCommentDots } from "react-icons/fa6";
import { FaRegShareSquare } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"
import Likesmodal from "../components/likesmodal.jsx"
import LikeButton from "../components/LikeButton.jsx"
import { likePost, showComments, showLikes, addCommentOrReply, deleteComment, likeComment, showCommentLikes, deleteReply, fetchReplies, hideReplies,likeReply, showReplyLikes } from "../utils/postActions.js";


const getRelativeTime = (timestamp) => {
  const now = new Date();
  const diff = Math.floor((now - new Date(timestamp)) / 1000);
  if (diff < 60) return `${diff}s`;
  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 365) return `${days}d`;
  const years = Math.floor(days / 365);
  return `${years}y`;
};

function Home() {
  const [posts, setPosts] = useState([]);
  const [likedPostIds, setLikedPostIds] = useState(new Set());
  const [likeAnimations, setLikeAnimations] = useState({});
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [likesList, setLikesList] = useState([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [repliesData, setRepliesData] = useState({}); 
  const [showCommentLikesModal, setShowCommentLikesModal] = useState(false);
  const [commentLikesList, setCommentLikesList] = useState([]);
  const [showReplyLikesModal, setShowReplyLikesModal] = useState(false);
  const [replyLikesList, setReplyLikesList] = useState([]);
  const commentInputRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?._id;

  const navigate = useNavigate()

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/post/feed", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const sortedPosts = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setPosts(sortedPosts);

        const liked = new Set();
        sortedPosts.forEach((post) => {
          if (post.likes?.includes(currentUserId)) {
            liked.add(post._id);
          }
        });
        setLikedPostIds(liked);
      } catch (error) {
        console.error("Failed to fetch feed:", error);
      }
    };

    fetchFeed();
  }, [currentUserId]);

  useEffect(() => {
    const handleClickOutside = () => setMenuOpenId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLike = (postId) => {
    likePost({
      postId,
      currentUserId,
      setLikedPostIds,
      setLikeAnimations,
      setPosts,
    });
  };

  const handleShowLikes = (postId) => {
    showLikes({
      postId,
      setLikesList,
      setShowLikesModal,
    });
  };

  const handleShowComments = (postId) => {
    showComments({
      postId,
      setSelectedPost,
      setShowCommentModal,
    });
  };

  const handleAddCommentOrReply = () => {
    addCommentOrReply({
      selectedPost,
      commentText,
      replyingTo,
      setSelectedPost,
      setPosts,
      setRepliesData,
      setCommentText,
      setReplyingTo,
      setShowEmojiPicker,
    });
  };

  const handleDeleteComment = (commentId) => {
    deleteComment({
      selectedPost,
      commentId,
      setSelectedPost,
      setPosts,
    });
  };

  const handleLikeComment = (commentId) => {
    likeComment({
      selectedPost,
      commentId,
      currentUserId,
      setSelectedPost,
      setPosts,
    });
  }

  const handleShowCommentLikes = (postId, commentId) => {
    showCommentLikes({
      postId,
      commentId,
      setCommentLikesList,
      setShowCommentLikesModal,
    });
  };

  const handleDeleteReply = (commentId, replyId) => {
    deleteReply({
      postId: selectedPost._id,
      commentId,
      replyId,
      setRepliesData,
    });
  };

  const handleFetchReplies = (commentId) => {
    fetchReplies({
      postId: selectedPost._id,
      commentId,
      repliesData,
      setRepliesData,
    });
  };

  const handleHideReplies = (commentId) => {
    hideReplies({ commentId, setRepliesData });
  };

  const handleLikeReply = (commentId, replyId) => {
    likeReply({
      postId: selectedPost._id,
      commentId,
      replyId,
      currentUserId,
      setRepliesData,
    });
  };

  const handleShowReplyLikes = (commentId, replyId) => {
    showReplyLikes({
      postId: selectedPost._id,
      commentId,
      replyId,
      setReplyLikesList,
      setShowReplyLikesModal,
    });
    };

  return (
    <>
      <div className="p-4 space-y-6 hover:cursor-pointer">
        {posts.length === 0 ? (
          <div className="text-center text-gray-400 text-lg mt-10">
            Follow some people to get started
          </div>
        ) : (
          posts.map((post) => {
            return (
              <div
                key={post._id}
                className="relative p-4 border-b border-gray-700 text-white flex"
              >
                {likeAnimations[post._id] && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-6xl animate-pop text-red-500">
                      <i className="fas fa-heart"></i>
                    </span>
                  </div>
                )}
                <img
                  src={post.user.avatar}
                  onClick={() => navigate(`/profile/${post.user.userName}`)} 
                  alt="avatar"
                  className="w-14 h-14 rounded-full object-cover mr-4"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div
                    onClick={() => navigate(`/profile/${post.user.userName}`)} 
                    className="font-bold text-lg text-white hover:cursor-pointer">
                      {post.user.name}
                      <span className="text-sm text-gray-400 font-normal ml-2">
                        • {getRelativeTime(post.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div
                  onClick={() => navigate(`/profile/${post.user.userName}`)}
                  className="text-sm text-gray-400 hover:cursor-pointer">@{post.user.userName}</div>
                  <div className="mt-2 space-y-3">
                    {post.caption && (
                      <div
                      onClick={() => handleShowComments(post._id)}
                      className="text-base text-white">{post.caption}</div>
                    )}
                    {post.image && post.image.trim() !== "" ? (
                      <img
                        src={post.image}
                        alt="post"
                        className="max-w-full rounded-lg"
                      />
                    ) : null}
                    <div className="flex gap-8 pt-2 text-white text-sm font-medium items-center">
                      <LikeButton
                        likes={post.likes}
                        currentUserId={currentUserId}
                        onLike={() => handleLike(post._id)}
                      />
                      <button
                        className="hover:text-blue-400 cursor-pointer text-sm transition-colors"
                        onClick={() => handleShowComments(post._id)}
                      >
                        <FaRegCommentDots size={15}/>
                      </button>
                      <button className="hover:text-green-400 cursor-pointer transition-colors">
                        <FaRegShareSquare size={15}/>
                      </button>
                    </div>
                    <div className="text-sm text-white font-bold flex gap-6 pt-1">
                      <span
                        className="cursor-pointer hover:underline"
                        onClick={() => handleShowLikes(post._id)}
                      >
                        {post.likes?.length || 0} Likes
                      </span>
                      <span>{post.comments?.length || 0} Comments</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {showLikesModal && (
        <Likesmodal
          type="post"
          likesData={likesList}
          onClose={() => setShowLikesModal(false)}
        />
      )}

      {showCommentModal && selectedPost && (
        <div className="fixed inset-0 bg-opacity-70 backdrop-blur-2xl flex items-center justify-center z-50">
          <div className="bg-stone-950 p-4 rounded-lg w-full max-w-xl h-[80vh] flex flex-col">
            <div className="overflow-y-auto flex-1 space-y-3 pr-2">
              <div className="mb-4 border-b border-gray-700 pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={selectedPost.user.avatar}
                    className="w-10 h-10 rounded-full"
                    alt="user"
                  />
                  <div>
                    <div className="text-white font-bold">
                      {selectedPost.user.name}
                      <span className="text-sm text-gray-400 font-normal ml-2">
                        • {getRelativeTime(selectedPost.createdAt)}
                      </span>
                    </div>
                    <div className="text-gray-400 text-sm">{selectedPost.user.userName}</div>
                  </div>
                </div>
                {selectedPost.caption && (
                  <div className="text-white">{selectedPost.caption}</div>
                )}
                {selectedPost.image && (
                  <img
                    src={selectedPost.image}
                    alt="post"
                    className="max-w-full mt-2 rounded-lg"
                  />
                )}
              </div>

              {
                selectedPost.comments
                  ?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .map((comment) => {
                    return (
                      <div
                        key={comment._id}
                        className="relative pt-1 pb-1 flex flex-col text-white group"
                      >
                        <div className="flex items-start gap-2">
                          <img
                            src={comment.user.avatar}
                            alt="user"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="text-sm flex gap-2 text-white">
                              <span className="font-semibold text-gray-200">{comment.user.userName}</span>
                              <span className="text-white">{comment.text}</span>
                            </div>

                            <div className="text-xs text-gray-400 mt-1 flex gap-4 items-center group/comment">
                              <span>{getRelativeTime(comment.createdAt)}</span>
                              {comment.likes?.length > 0 && (
                                <span
                                  className="text-gray-400 hover:underline cursor-pointer"
                                  onClick={() => handleShowCommentLikes(selectedPost._id, comment._id)}
                                >
                                  {comment.likes.length} like{comment.likes.length > 1 ? "s" : ""}
                                </span>
                              )}
                              <button
                                onClick={() => {
                                  setCommentText(`@${comment.user.userName} `);
                                  setReplyingTo(comment._id);
                                  commentInputRef.current?.focus();
                                }}
                                className="hover:text-white"
                              >
                                Reply
                              </button>

                              <div className="relative group/comment">
                                <button
                                  className={`text-gray-400 hover:text-gray-200 px-2 ${
                                              menuOpenId === comment._id ? "block" : "hidden group-hover/comment:block"
                                            }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpenId((prev) =>
                                      prev === comment._id ? null : comment._id
                                    );
                                  }}
                                >
                                  ⋯
                                </button>

                                {menuOpenId === comment._id && (
                                  <div className="absolute right-0 mt-2 w-28 bg-gray-800 border border-gray-700 rounded shadow-lg z-50">
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(comment.text);
                                        toast.success("Comment copied!");
                                        setMenuOpenId(null);
                                      }}
                                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                                    >
                                      Copy
                                    </button>
                                    {comment.user._id === currentUserId && (
                                      <button
                                        onClick={() => {
                                          handleDeleteComment(comment._id);
                                          setMenuOpenId(null);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-700"
                                      >
                                        Delete
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="pt-4">
                              {repliesData[comment._id]?.visible ? (
                                <>
                                  <button
                                    onClick={() => handleHideReplies(comment._id)}
                                    className="ml-6 mt-1 text-white text-xs"
                                  >
                                    —— &nbsp;&nbsp;&nbsp;&nbsp; Hide Replies
                                  </button>

                                  {repliesData[comment._id]?.replies?.map((reply) => (
                                    <div
                                      key={reply._id}
                                      className="ml-6 mt-1 pt-1 pb-1 pl-4 text-sm text-white group w-full"
                                    >
                                      <div className="flex justify-between items-start gap-2 w-full">
                                        <img
                                          src={reply.user.avatar}
                                          alt=""
                                          className="w-6 h-6 rounded-full"
                                        />
                                        <div className="flex-1">
                                          <div className="flex gap-2 text-sm text-white">
                                            <span className="font-semibold text-gray-200">
                                              {reply.user.userName}
                                            </span>
                                            <span>{reply.text}</span>
                                          </div>

                                          <div className="text-xs text-gray-400 mt-1 flex gap-4 items-center group/reply">
                                            <span>{getRelativeTime(reply.createdAt)}</span>

                                            {reply.likes?.length > 0 && (
                                              <span
                                                className="text-gray-400 hover:underline cursor-pointer"
                                                onClick={() => handleShowReplyLikes(comment._id, reply._id)}
                                              >
                                                {reply.likes.length} like{reply.likes.length > 1 ? "s" : ""}
                                              </span>
                                            )}
                                            <button
                                              onClick={() => {
                                                setCommentText(`@${reply.user.userName} `);
                                                setReplyingTo(comment._id);
                                                commentInputRef.current?.focus();
                                              }}
                                              className="hover:text-white"
                                            >
                                              Reply
                                            </button>

                                            <div className="relative group/reply">
                                              <button
                                                className={`text-gray-400 hover:text-gray-200 px-2 ${
                                                  menuOpenId === reply._id ? "block" : "hidden group-hover/reply:block"
                                                }`}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setMenuOpenId((prev) =>
                                                    prev === reply._id ? null : reply._id
                                                  );
                                                }}
                                              >
                                                ⋯
                                              </button>

                                              {menuOpenId === reply._id && (
                                                <div className="absolute right-0 mt-2 w-28 bg-gray-800 border border-gray-700 rounded shadow-lg z-50">
                                                  <button
                                                    onClick={() => {
                                                      navigator.clipboard.writeText(reply.text);
                                                      toast.success("Reply copied!");
                                                      setMenuOpenId(null);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                                                  >
                                                    Copy
                                                  </button>
                                                  {reply.user._id === currentUserId && (
                                                    <button
                                                      onClick={() => {
                                                        handleDeleteReply(
                                                          comment._id,
                                                          reply._id
                                                        );
                                                        setMenuOpenId(null);
                                                      }}
                                                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-700"
                                                    >
                                                      Delete
                                                    </button>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex mt-1 justify-end">
                                          <LikeButton
                                            likes={reply.likes}
                                            currentUserId={currentUserId}
                                            onLike={() => handleLikeReply(comment._id, reply._id)}
                                          />

                                        </div>
                                      </div>
                                      
                                    </div>
                                  ))}

                                  {!repliesData[comment._id]?.allLoaded && (
                                    <button
                                      onClick={() => handleFetchReplies(comment._id)}
                                      className="ml-6 mt-1 text-white text-xs"
                                    >
                                      —— &nbsp;&nbsp;&nbsp;&nbsp; View Replies (
                                      {(repliesData[comment._id]?.total || 0) -
                                        (repliesData[comment._id]?.replies?.length || 0)}
                                      )
                                    </button>
                                  )}
                                </>
                              ) : (
                                (comment.replies?.length > 0 ||
                                  (repliesData[comment._id]?.total || 0) > 0) && (
                                  <button
                                    onClick={() => handleFetchReplies(comment._id)}
                                    className="ml-6 mt-1 text-white text-xs"
                                  >
                                    —— &nbsp;&nbsp;&nbsp;&nbsp; View Replies (
                                    {repliesData[comment._id]?.total ||
                                      comment.replies?.length ||
                                      0}
                                    )
                                  </button>
                                )
                              )}
                            </div>
                          </div>


                          <div className="flex flex-col items-center gap-1 mt-1 ml-2">
                            <LikeButton
                              likes={comment.likes}
                              currentUserId={currentUserId}
                              onLike={() => handleLikeComment(comment._id)}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
              }

            </div>

            {replyingTo && (
              <div className="flex w-3/4 ml-7.5 items-center justify-between bg-gray-800 rounded px-4 ">
                <div className="flex items-center text-sm text-white gap-2">
                  <IoArrowUndo className="text-blue-400" size={18} />
                  <span>
                    Replying to <span className="font-semibold">@{selectedPost.comments.find(c => c._id === replyingTo)?.user?.userName || "user"}</span>
                  </span>
                </div>
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    setCommentText("");
                  }}
                  className="text-gray-400 hover:text-red-500 text-lg"
                >
                  ×
                </button>
              </div>
            )}

            <div className="mt-3 flex items-center gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 p-2 rounded bg-gray-800 text-white"
              />
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-xl"
              >
                😊
              </button>
              <button
                onClick={handleAddCommentOrReply}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white rounded"
              >
                Post
              </button>
            </div>
            {showEmojiPicker && (
              <div className="absolute bottom-20 left-6 z-50">
                <EmojiPicker
                  emojiStyle="native"
                  height={250}
                  width={250}
                  searchDisabled
                  onEmojiClick={(e) => setCommentText((prev) => prev + e.emoji)}
                  lazyLoadEmojis
                />
              </div>
            )}

            <button
              onClick={() => setShowCommentModal(false)}
              className="mt-2 text-sm text-gray-400 underline"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showCommentLikesModal && (
        <Likesmodal
          type="post"
          likesData={commentLikesList}
          onClose={() => setShowCommentLikesModal(false)}
        />
      )}

      {showReplyLikesModal && (
        <Likesmodal
          type="post"
          likesData={replyLikesList}
          onClose={() => setShowReplyLikesModal(false)}
        />
      )}


      <style>{`
        .animate-pop {
          animation: popHeart 0.6s ease;
        }
        @keyframes popHeart {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.5); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }

        .animate-like-bounce {
          animation: likeBounce 0.4s ease;
        }
        @keyframes likeBounce {
          0% { transform: scale(1); }
          30% { transform: scale(1.5); }
          60% { transform: scale(0.85); }
          100% { transform: scale(1); }
        }
      `}</style>
    </>
  );
}

export default Home;
