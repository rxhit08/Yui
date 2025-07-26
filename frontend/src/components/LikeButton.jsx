import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const LikeButton = ({ likes = [], currentUserId, onLike }) => {
  const isLiked = likes?.includes(currentUserId);
  const likeCount = likes?.length || 0;

  return (
    <div className="flex flex-col items-center gap-1 ml-2">
      <button
        onClick={onLike}
        className={`flex items-center gap-1 text-xs ${
          isLiked ? "text-red-500" : "text-white"
        }`}
      >
        {isLiked ? <FaHeart size={15} /> : <FaRegHeart size={15} />}
        {likeCount}
      </button>
    </div>
  );
};

export default LikeButton;
