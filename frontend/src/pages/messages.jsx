import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import defaultAvatar from "../assets/avatar.png";
import { IoSend } from "react-icons/io5";
import { io } from "socket.io-client";

function Messages() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const { token, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const lastMessageRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const newSocket = io("http://localhost:8000", { withCredentials: true });
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (socket && user?._id) {
      socket.emit("join", user._id);
    }
  }, [socket, user]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg) => {
      if (
        selectedUser &&
        (msg.senderId === selectedUser._id || msg.receiverId === selectedUser._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    return () => socket.off("receiveMessage", handleReceiveMessage);
  }, [socket, selectedUser]);

  useEffect(() => {
    const fetchLastMessagedUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/message/showlastmessage",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setUsers(res.data.data || []);
      } catch (err) {
        console.error("❌ Error fetching last messages:", err);
      }
    };

    fetchLastMessagedUsers();
  }, [token]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      setLoadingMessages(true);
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/message/showmessage/${selectedUser.userName}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setMessages(res.data.data || []);
      } catch (err) {
        console.error("❌ Error fetching messages:", err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedUser, token]);

  useEffect(() => {
    // Scroll to the latest message when messages change
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/message/sendmessage/${selectedUser.userName}`,
        { text: newMessage },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setMessages((prev) => [...prev, res.data.data]);
      setNewMessage("");
    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex max-h-[calc(100vh-33px)] overflow-hidden">
      {/* Left sidebar */}
      <div className="w-7/20 flex flex-col border-r border-gray-300">
        <h2 className="text-lg font-semibold text-white p-4 border-b">Chats</h2>
        <div className="flex-1 overflow-y-auto p-4">
          {users.length === 0 && <p>No conversations yet.</p>}
          {users.map(({ user: userItem, lastMessage }) => (
            <div
              key={userItem._id}
              onClick={() => setSelectedUser(userItem)}
              className={`flex text-white flex-col mb-4 gap-1 cursor-pointer p-2 rounded hover:bg-gray-900 ${
                selectedUser?.userName === userItem.userName
                  ? "bg-gray-900 font-bold font-mono"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={userItem.avatar || defaultAvatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-row">
                    <p className="font-medium pr-2"> {userItem.name}</p>
                    <p className="text-sm text-gray-356 font-">@{userItem.userName}</p>
                  </div>
                  {lastMessage?.createdAt && (
                    <p className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(lastMessage.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
              {lastMessage && (
                <p className="text-sm text-gray-400 truncate">
                  {lastMessage.text}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="w-13/20 flex flex-col bg-[#111827] text-white">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-gray-600 flex items-center gap-4">
              <img
                src={selectedUser.avatar || defaultAvatar}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <h2 className="text-lg font-semibold">
                Chat with{" "}
                <span
                onClick={() => navigate(`/profile/${selectedUser.userName}`)} className="text-blue-400 hover:cursor-pointer">@{selectedUser.userName}</span>
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {loadingMessages ? (
                <p className="text-gray-400">Loading messages...</p>
              ) : (
                messages.map((msg, index) => {
                  const isSender = (msg.senderId?._id || msg.senderId) === user._id;
                  const time = new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={msg._id || index}
                      ref={index === messages.length - 1 ? lastMessageRef : null}
                      className={`pl-3 pr-3 pt-2 pb-1 m-1 rounded-2xl max-w-[60%] flex flex-col ${
                        isSender
                          ? "bg-blue-600 text-white self-end"
                          : "bg-gray-900 text-white self-start"
                      }`}
                    >
                      <div className="text-sm">{msg.text}</div>
                      <div className="text-[11px] text-gray-300 mt-1 self-end">
                        {time}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input box */}
            <div className="p-4 ml-4 mr-4 mb-3 rounded-2xl h-10 border-gray-700 bg-[#1f2937] flex items-center gap-2">
              <input
                type="text"
                className="flex-1 rounded-lg bg-gray-800 text-white px-4 py-2 focus:outline-none"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleSendMessage}
                className="text-blue-500 text-xl px-4 py-2 rounded-lg"
              >
                <IoSend />
              </button>
            </div>
          </>
        ) : (
          <div className="p-4 items-center flex justify-center h-screen font-bold">
            <p className="text-gray-400">Select a user to view messages.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
