import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Search,
  Bell,
  User,
  LogOut,
  MessageCircle,
  Users,
  Plus,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import avatar from "../assets/avatar.png";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

const getNavItems = (userName) => [
  { name: "Home", icon: Home, path: "/home" },
  { name: "Search", icon: Search, path: "/search" },
  { name: "Messages", icon: MessageCircle, path: "/messages" },
  { name: "Notifications", icon: Bell, path: "/notifications" },
  { name: "Friends", icon: Users, path: "/friends" },
  { name: "Profile", icon: User, path: `/profile/${userName}` }, 
  { name: "Create", icon: Plus, modal: true },
  { name: "Logout", icon: LogOut, action: true },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const navItems = getNavItems(user?.userName);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postText, setPostText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handlePost = async () => {
    if (!postText.trim() && !imageFile) {
      toast.error("cannot do an empty post");
      return;
    }

    try {
      const formData = new FormData();
      if (postText.trim()) formData.append("caption", postText);
      if (imageFile) formData.append("image", imageFile);

      const accessToken = localStorage.getItem("accessToken");

      await axios.post("http://localhost:8000/api/v1/post/create", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Post created successfully!");
      setPostText("");
      setImagePreview(null);
      setImageFile(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to create post");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPostText("");
    setImagePreview(null);
    setImageFile(null);
    setError("");
  };

  return (
    <>
      <div className="h-full border-r border-gray-800 text-white flex flex-col items-end py-20 pr-10 space-y-8">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isLogout = item.action;
          const isModal = item.modal;
          const isActive = item.path && location.pathname === item.path;

          const textColor = isLogout || isModal
            ? "group-hover:text-red-400"
            : isActive
              ? "text-blue-400"
              : "group-hover:text-blue-400";

          const underlineColor = isLogout || isModal
            ? "bg-red-400"
            : "bg-blue-400";

          const TextAndUnderline = (
            <div className="flex flex-col items-end">
              <span className={`text-xl transition-colors duration-300 ${textColor}`}>
                {item.name}
              </span>
              <div
                className={`h-[2px] w-full max-w-[60px] ${
                  isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                } ${underlineColor} transition-transform duration-300 origin-right`}
              />
            </div>
          );

          if (isLogout) {
            return (
              <button
                key={index}
                onClick={handleLogout}
                className="group flex flex-row-reverse items-center justify-end space-x-2 space-x-reverse cursor-pointer focus:outline-none"
              >
                {TextAndUnderline}
                <Icon className="h-5 w-5 ml-2 transition-colors duration-200 group-hover:text-red-400" />
              </button>
            );
          }

          if (isModal) {
            return (
              <button
                key={index}
                onClick={() => setIsModalOpen(true)}
                className="group flex flex-row-reverse items-center justify-end space-x-2 space-x-reverse cursor-pointer focus:outline-none"
              >
                {TextAndUnderline}
                <Icon className="h-5 w-5 ml-2 transition-colors duration-200 group-hover:text-red-400" />
              </button>
            );
          }

          return (
            <Link
              to={item.path}
              key={index}
              className="group flex flex-row-reverse items-center justify-end space-x-2 space-x-reverse cursor-pointer"
            >
              {TextAndUnderline}
              <Icon
                className={`h-5 w-5 ml-2 transition-colors duration-200 ${
                  isActive ? "text-blue-400" : "group-hover:text-blue-400"
                }`}
              />
            </Link>
          );
        })}

        <div className="mt-auto flex flex-row-reverse items-center justify-end gap-3">
          <img
            src={user?.avatar || avatar}
            alt="User avatar"
            className="w-12 h-12 rounded-full border-2 border-white object-cover"
          />
          <div className="flex flex-col items-end">
            <span className="text-sm text-gray-300">@{user?.userName || "username"}</span>
            <span className="text-md font-bold text-white">{user?.name || "Guest"}</span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 text-white w-full max-w-md rounded-xl p-5 shadow-xl relative">
            {error && (
              <div className="text-red-500 text-sm mb-3 text-center">
                {error}
              </div>
            )}

            <textarea
              placeholder="What's on your mind?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="w-full h-24 p-3 bg-zinc-800 border border-white/10 rounded-md text-white placeholder-gray-400 resize-none focus:outline-none mb-3"
            />

            {imagePreview && (
              <div className="relative mb-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="rounded-md max-h-48 object-cover w-full"
                />
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                  className="absolute top-2 right-2 bg-black/60 rounded-full p-1 hover:bg-black"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}

            <div className="flex justify-between items-center">
              <label className="cursor-pointer text-red-400">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <ImageIcon size={20} />
              </label>

              <div className="flex gap-2">
                <button
                  onClick={closeModal}
                  className="text-sm px-4 py-1.5 rounded-full bg-zinc-700 hover:bg-zinc-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePost}
                  className="text-sm px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
