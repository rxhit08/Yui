import React, { useState } from "react";

const suggestions = [
  { name: "John Doe", username: "@john_doe" },
  { name: "Jane Smith", username: "@jane_smith" },
  { name: "OpenAI", username: "@openai" },
];

const RightSidebar = () => {
  const [postText, setPostText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="h-full  text-white border-l border-gray-800 flex flex-col pt-15">
      <div className="overflow-y-auto h-full p-4 space-y-6">
        
        {/* Who to follow */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Who to follow</h2>
          <div className="space-y-4">
            {suggestions.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between hover:bg-white/10 p-3 rounded-lg cursor-pointer"
              >
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-400">{user.username}</p>
                </div>
                <button className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full hover:bg-blue-600">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
