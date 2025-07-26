import React, { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RiPencilFill } from "react-icons/ri";
import { FaSpinner } from "react-icons/fa";

function EditProfile() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    location: user?.location || "",
  });

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [coverPreview, setCoverPreview] = useState(user?.coverImage || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const avatarInputRef = useRef();
  const coverInputRef = useRef();

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (type === "avatar") {
        setAvatarPreview(previewUrl);
        setAvatarFile(file);
      } else {
        setCoverPreview(previewUrl);
        setCoverFile(file);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("bio", formData.bio);
      form.append("location", formData.location);
      if (avatarFile) form.append("avatar", avatarFile);
      if (coverFile) form.append("coverImage", coverFile);

      const res = await axios.patch(
        "http://localhost:8000/api/v1/users/update-details",
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      updateUser(res.data.data);
      toast.success("Profile updated");
      localStorage.setItem("user", JSON.stringify(res.data.data));
      navigate(`/profile/${res.data.data.userName}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-white bg-black min-h-screen relative">
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
        <h1 className="text-xl font-semibold">Edit Profile</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-300 hover:text-white"
        >
          Cancel
        </button>
      </div>

      <div className="relative bg-gray-800">
        <img
          src={coverPreview}
          alt="Cover"
          className="w-full h-40 object-cover"
        />
        <button
          onClick={() => coverInputRef.current.click()}
          className="absolute top-2 right-2 bg-black bg-opacity-50 p-1 rounded-full"
        >
          <RiPencilFill size={20} />
        </button>
        <input
          type="file"
          accept="image/*"
          ref={coverInputRef}
          className="hidden"
          onChange={(e) => handleImageChange(e, "cover")}
        />

        <div className="absolute left-4 -bottom-12">
          <div className="relative w-24 h-24">
            <img
              src={avatarPreview}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-black object-cover"
            />
            <button
              onClick={() => avatarInputRef.current.click()}
              className="absolute bottom-0 right-0 bg-black bg-opacity-50 p-1 rounded-full"
            >
              <RiPencilFill size={16} />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={avatarInputRef}
              className="hidden"
              onChange={(e) => handleImageChange(e, "avatar")}
            />
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`mt-16 px-4 space-y-4 transition-all duration-200 ${
          loading ? "blur-sm pointer-events-none select-none" : ""
        }`}
      > <span className="font-josefin text-2xl">Name</span>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full p-2 mb-6 border-1 rounded"
          value={formData.name}
          onChange={handleChange}
        />
        <span className="font-josefin text-2xl">Bio</span>
        <textarea
          name="bio"
          placeholder="Bio"
          className="w-full p-2 mb-6 border-1 rounded"
          value={formData.bio}
          onChange={handleChange}
        />
        <span className="font-josefin text-2xl">Location</span>
        <input
          type="text"
          name="location"
          placeholder="Location"
          className="w-full p-2 mb-6 border-1 rounded"
          value={formData.location}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-white text-black px-4 py-2 rounded font-semibold flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-10">
          <FaSpinner className="text-white text-3xl animate-spin" />
        </div>
      )}
    </div>
  );
}

export default EditProfile;
