import React from "react";
import avatar from "../assets/avatar.png";

function LikesModal({ type = "post", likesData = [], onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full space-y-4">
        <h2 className="text-lg font-bold text-white mb-2">Liked by</h2>
        {likesData.length > 0 ? (
            likesData.map((user) => (
            <div key={user._id} className="flex items-center gap-3 text-white">
                <img
                src={user.avatar || avatar} 
                className="w-8 h-8 rounded-full object-cover"
                alt=""
                />
                <div className="pl-2">
                <div className=" font-bold text-md text-white">@{user.userName}</div>
                <div className="font-small text-gray-200">{user.name}</div>
                </div>
            </div>
            ))
        ) : (
            <div className="text-gray-400">No likes yet.</div>
        )}
        <button
            onClick={onClose}
            className="mt-4 bg-red-500 hover:bg-red-600 px-4 py-1 rounded text-white"
        >
            Close
        </button>
        </div>
    </div>
  );
}

export default LikesModal;
