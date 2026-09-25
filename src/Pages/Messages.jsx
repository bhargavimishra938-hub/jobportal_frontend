import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useLocation } from "react-router-dom";

import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Smile,
  ArrowLeft,
  MessageSquare,
  CheckCheck,
  RefreshCw,
} from "lucide-react";

const API_BASE =
  "http://localhost/job_portal/job-portal-api/api/messages";

const Messages = () => {
  const location = useLocation();

  const [user, setUser] = useState(null);

  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const [messages, setMessages] = useState([]);

  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // GET LOGGED-IN USER
  // =====================================================

  const getUser = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (error) {
      console.error("User parse error:", error);
      return null;
    }
  };

  // =====================================================
  // CREATE TEMPORARY NEW CONVERSATION
  // =====================================================

  const createNewConversationObject = () => {
    const candidateId = Number(
      location.state?.candidateId
    );

    if (!candidateId) {
      return null;
    }

    return {
      other_user_id: candidateId,
      other_user_name:
        location.state?.candidateName ||
        "Candidate",
      other_user_email:
        location.state?.candidateEmail ||
        "",
      last_message: "",
      last_message_time: null,
      unread_count: 0,
      isNew: true,
    };
  };

  // =====================================================
  // FETCH CONVERSATIONS
  // =====================================================

  const fetchConversations = async () => {
    try {
      setError("");

      const loggedUser = getUser();

      if (!loggedUser?.id) {
        setError(
          "Recruiter login information not found."
        );

        setLoading(false);
        return;
      }

      if (loggedUser.role !== "recruiter") {
        setError(
          "Only recruiters can access messages."
        );

        setLoading(false);
        return;
      }

      setUser(loggedUser);

      const recruiterId = Number(
        loggedUser.id
      );

      const response = await fetch(
        `${API_BASE}/get-conversations.php?userId=${recruiterId}`
      );

      const raw = await response.text();

      console.log(
        "Conversations RAW:",
        raw
      );

      let data;

      try {
        data = JSON.parse(raw);
      } catch (parseError) {
        throw new Error(
          "Invalid response received from server."
        );
      }

      if (!data.success) {
        throw new Error(
          data.message ||
            "Unable to fetch conversations."
        );
      }

      const list = Array.isArray(
        data.conversations
      )
        ? data.conversations
        : [];

      setConversations(list);

      // =================================================
      // CANDIDATE REQUESTED FROM APPLICANTS PAGE
      // =================================================

      const requestedCandidateId = Number(
        location.state?.candidateId
      );

      if (requestedCandidateId) {
        const requestedChat = list.find(
          (chat) =>
            Number(chat.other_user_id) ===
            requestedCandidateId
        );

        // -----------------------------------------------
        // EXISTING CONVERSATION
        // -----------------------------------------------

        if (requestedChat) {
          console.log(
            "Opening existing conversation:",
            requestedChat
          );

          setSelectedChat(requestedChat);

          return;
        }

        // -----------------------------------------------
        // NEW CONVERSATION
        // -----------------------------------------------

        const newConversation =
          createNewConversationObject();

        if (newConversation) {
          console.log(
            "Starting new conversation:",
            newConversation
          );

          setSelectedChat(
            newConversation
          );

          setMessages([]);

          return;
        }
      }

      // =================================================
      // AUTOMATICALLY SELECT FIRST CONVERSATION
      // =================================================

      if (list.length > 0) {
        setSelectedChat(
          (currentSelected) => {
            if (!currentSelected) {
              return list[0];
            }

            const stillExists =
              list.find(
                (chat) =>
                  Number(
                    chat.other_user_id
                  ) ===
                  Number(
                    currentSelected.other_user_id
                  )
              );

            return (
              stillExists ||
              list[0]
            );
          }
        );
      } else {
        setSelectedChat(null);
        setMessages([]);
      }
    } catch (error) {
      console.error(
        "Conversation Error:",
        error
      );

      setError(
        error.message ||
          "Unable to load conversations."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH MESSAGES
  // =====================================================

  const fetchMessages = async (
    conversation
  ) => {
    if (
      !conversation ||
      !user?.id
    ) {
      return;
    }

    const currentUserId = Number(
      user.id
    );

    const otherUserId = Number(
      conversation.other_user_id
    );

    if (
      !currentUserId ||
      !otherUserId
    ) {
      console.error(
        "Invalid conversation user IDs:",
        {
          currentUserId,
          otherUserId,
          conversation,
        }
      );

      return;
    }

    try {
      setMessagesLoading(true);

      const response = await fetch(
        `${API_BASE}/get-messages.php?userId=${currentUserId}&otherUserId=${otherUserId}`
      );

      const raw = await response.text();

      console.log(
        "Messages RAW:",
        raw
      );

      let data;

      try {
        data = JSON.parse(raw);
      } catch (parseError) {
        throw new Error(
          "Invalid response received from server."
        );
      }

      if (!data.success) {
        throw new Error(
          data.message ||
            "Unable to fetch messages."
        );
      }

      setMessages(
        Array.isArray(data.messages)
          ? data.messages
          : []
      );
    } catch (error) {
      console.error(
        "Messages Error:",
        error
      );

      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchConversations();
  }, [location.state]);

  // =====================================================
  // SELECTED CHAT CHANGED
  // =====================================================

  useEffect(() => {
    if (
      selectedChat &&
      user?.id &&
      selectedChat?.other_user_id
    ) {
      fetchMessages(selectedChat);
    }
  }, [selectedChat, user]);

  // =====================================================
  // DISPLAY CONVERSATIONS
  // Includes NEW conversation if candidate came
  // from Applicants page
  // =====================================================

  const displayConversations =
    useMemo(() => {
      const candidateId = Number(
        location.state?.candidateId
      );

      if (!candidateId) {
        return conversations;
      }

      const existingConversation =
        conversations.find(
          (chat) =>
            Number(chat.other_user_id) ===
            candidateId
        );

      // Already exists
      if (existingConversation) {
        return conversations;
      }

      // Candidate has no previous messages
      const newConversation =
        createNewConversationObject();

      if (!newConversation) {
        return conversations;
      }

      return [
        newConversation,
        ...conversations,
      ];
    }, [
      conversations,
      location.state,
    ]);

  // =====================================================
  // SEARCH CONVERSATIONS
  // =====================================================

  const filteredConversations =
    useMemo(() => {
      const searchValue =
        search
          .trim()
          .toLowerCase();

      return displayConversations.filter(
        (chat) => {
          const name = String(
            chat.other_user_name ||
              ""
          ).toLowerCase();

          const email = String(
            chat.other_user_email ||
              ""
          ).toLowerCase();

          return (
            name.includes(
              searchValue
            ) ||
            email.includes(
              searchValue
            )
          );
        }
      );
    }, [
      displayConversations,
      search,
    ]);

  // =====================================================
  // SELECT CONVERSATION
  // =====================================================

  const handleSelectConversation = (
    chat
  ) => {
    setSelectedChat(chat);
    setMessages([]);
  };

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const sendMessage = async () => {
    const text =
      message.trim();

    if (
      !text ||
      !selectedChat ||
      !user?.id ||
      !selectedChat?.other_user_id
    ) {
      return;
    }

    const senderId = Number(
      user.id
    );

    const receiverId = Number(
      selectedChat.other_user_id
    );

    const payload = {
      sender_id: senderId,
      receiver_id: receiverId,
      message: text,
    };

    console.log(
      "Sending Message:",
      payload
    );

    try {
      setSending(true);

      const response =
        await fetch(
          `${API_BASE}/send-message.php`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload
            ),
          }
        );

      const raw =
        await response.text();

      console.log(
        "Send Message RAW:",
        raw
      );

      let data;

      try {
        data =
          JSON.parse(raw);
      } catch (parseError) {
        throw new Error(
          "Invalid response received from server."
        );
      }

      if (!data.success) {
        throw new Error(
          data.message ||
            "Unable to send message."
        );
      }

      // Clear input
      setMessage("");

      // =================================================
      // LOAD CURRENT CHAT
      // =================================================

      await fetchMessages(
        selectedChat
      );

      // =================================================
      // REFRESH CONVERSATIONS
      // This will convert temporary conversation
      // into real DB conversation
      // =================================================

      await fetchConversations();

      console.log(
        "Message sent successfully."
      );
    } catch (error) {
      console.error(
        "Send Message Error:",
        error
      );

      alert(
        error.message ||
          "Unable to send message."
      );
    } finally {
      setSending(false);
    }
  };

  // =====================================================
  // ENTER TO SEND
  // =====================================================

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      sendMessage();
    }
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (
    dateValue
  ) => {
    if (!dateValue) {
      return "";
    }

    const date =
      new Date(
        String(
          dateValue
        ).replace(
          " ",
          "T"
        )
      );

    if (
      isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    return date.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">

          <RefreshCw
            size={35}
            className="animate-spin mx-auto text-blue-600"
          />

          <p className="mt-3 text-gray-600">
            Loading messages...
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">

        <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 text-center shadow-sm">

          <MessageSquare
            size={45}
            className="mx-auto text-red-500"
          />

          <h2 className="text-xl font-semibold mt-4">
            Unable to Load Messages
          </h2>

          <p className="text-gray-500 mt-2">
            {error}
          </p>

          <button
            type="button"
            onClick={
              fetchConversations
            }
            className="mt-5 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">

          <div className="flex items-center gap-3">

            <div className="p-3 bg-blue-100 rounded-xl">

              <MessageSquare
                size={26}
                className="text-blue-600"
              />

            </div>

            <div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Messages
              </h1>

              <p className="text-gray-500 mt-1">
                Communicate with candidates.
              </p>

            </div>

          </div>

        </div>

        {/* MAIN CHAT BOX */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] h-[680px]">

            {/* =================================================
                CONVERSATION SIDEBAR
            ================================================== */}

            <div
              className={`border-r border-gray-200 flex flex-col ${
                selectedChat
                  ? "hidden md:flex"
                  : "flex"
              }`}
            >

              {/* SEARCH */}
              <div className="p-4 border-b border-gray-200">

                <div className="relative">

                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                    placeholder="Search candidates..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

              </div>

              {/* CONVERSATIONS */}
              <div className="flex-1 overflow-y-auto">

                {filteredConversations.length ===
                0 ? (
                  <div className="p-8 text-center">

                    <MessageSquare
                      size={38}
                      className="mx-auto text-gray-300"
                    />

                    <p className="text-gray-500 mt-3">
                      No conversations yet.
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Messages will appear here when you communicate with candidates.
                    </p>

                  </div>
                ) : (
                  filteredConversations.map(
                    (chat) => {

                      const chatId =
                        Number(
                          chat.other_user_id
                        );

                      const selectedId =
                        Number(
                          selectedChat?.other_user_id
                        );

                      return (
                        <button
                          key={chatId}
                          type="button"
                          onClick={() =>
                            handleSelectConversation(
                              chat
                            )
                          }
                          className={`w-full text-left px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition ${
                            selectedId ===
                            chatId
                              ? "bg-blue-50"
                              : ""
                          }`}
                        >

                          <div className="flex gap-3">

                            {/* AVATAR */}
                            <div className="w-11 h-11 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold flex-shrink-0">

                              {String(
                                chat.other_user_name ||
                                  "C"
                              )
                                .charAt(
                                  0
                                )
                                .toUpperCase()}

                            </div>

                            <div className="min-w-0 flex-1">

                              <div className="flex justify-between gap-2">

                                <h3 className="font-semibold text-gray-900 truncate">
                                  {chat.other_user_name ||
                                    "Candidate"}
                                </h3>

                                {/* NEW BADGE */}
                                {chat.isNew ? (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold flex-shrink-0">
                                    New
                                  </span>
                                ) : (
                                  <span className="text-xs text-gray-400 flex-shrink-0">
                                    {formatTime(
                                      chat.last_message_time
                                    )}
                                  </span>
                                )}

                              </div>

                              <p className="text-xs text-gray-500 mt-0.5 truncate">
                                {chat.other_user_email ||
                                  ""}
                              </p>

                              <div className="flex justify-between gap-2 mt-1">

                                <p className="text-sm text-gray-500 truncate">
                                  {chat.isNew
                                    ? "Start a new conversation"
                                    : chat.last_message ||
                                      "No message"}
                                </p>

                                {!chat.isNew &&
                                  Number(
                                    chat.unread_count
                                  ) >
                                    0 && (
                                    <span className="min-w-5 h-5 px-1.5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">

                                      {
                                        chat.unread_count
                                      }

                                    </span>
                                  )}

                              </div>

                            </div>

                          </div>

                        </button>
                      );
                    }
                  )
                )}

              </div>

            </div>

            {/* =================================================
                CHAT AREA
            ================================================== */}

            {selectedChat ? (
              <div className="flex flex-col min-w-0">

                {/* CHAT HEADER */}
                <div className="h-[76px] px-4 md:px-6 border-b border-gray-200 flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    {/* MOBILE BACK */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedChat(
                          null
                        );

                        setMessages(
                          []
                        );
                      }}
                      className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ArrowLeft
                        size={20}
                      />
                    </button>

                    {/* AVATAR */}
                    <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold">

                      {String(
                        selectedChat.other_user_name ||
                          "C"
                      )
                        .charAt(0)
                        .toUpperCase()}

                    </div>

                    <div>

                      <div className="flex items-center gap-2">

                        <h2 className="font-semibold text-gray-900">
                          {selectedChat.other_user_name ||
                            "Candidate"}
                        </h2>

                        {selectedChat.isNew && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                            New Conversation
                          </span>
                        )}

                      </div>

                      <p className="text-xs text-gray-500">
                        {selectedChat.other_user_email ||
                          ""}
                      </p>

                    </div>

                  </div>

                  {/* HEADER ACTIONS */}
                  <div className="flex items-center gap-1">

                    <button
                      type="button"
                      className="hidden sm:block p-2.5 hover:bg-gray-100 rounded-lg"
                      title="Call"
                    >
                      <Phone
                        size={19}
                      />
                    </button>

                    <button
                      type="button"
                      className="hidden sm:block p-2.5 hover:bg-gray-100 rounded-lg"
                      title="Video call"
                    >
                      <Video
                        size={19}
                      />
                    </button>

                    <button
                      type="button"
                      className="p-2.5 hover:bg-gray-100 rounded-lg"
                      title="More"
                    >
                      <MoreVertical
                        size={19}
                      />
                    </button>

                  </div>

                </div>

                {/* =================================================
                    MESSAGES
                ================================================== */}

                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50">

                  {messagesLoading ? (
                    <div className="h-full flex items-center justify-center">

                      <RefreshCw
                        size={28}
                        className="animate-spin text-blue-600"
                      />

                    </div>
                  ) : messages.length ===
                    0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">

                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">

                        <MessageSquare
                          size={32}
                          className="text-blue-600"
                        />

                      </div>

                      <p className="text-gray-700 font-medium mt-4">
                        {selectedChat.isNew
                          ? "Start New Conversation"
                          : "No messages yet."}
                      </p>

                      <p className="text-xs text-gray-400 mt-1 max-w-sm">
                        {selectedChat.isNew
                          ? `Send a message to ${selectedChat.other_user_name || "this candidate"} to start the conversation.`
                          : "Start the conversation below."}
                      </p>

                    </div>
                  ) : (
                    messages.map(
                      (msg) => {

                        const isMine =
                          Number(
                            msg.sender_id
                          ) ===
                          Number(
                            user?.id
                          );

                        return (
                          <div
                            key={msg.id}
                            className={`flex ${
                              isMine
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >

                            <div className="max-w-[80%] md:max-w-[65%]">

                              {/* MESSAGE */}
                              <div
                                className={`px-4 py-3 rounded-2xl text-sm break-words ${
                                  isMine
                                    ? "bg-gray-900 text-white rounded-br-md"
                                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
                                }`}
                              >
                                {msg.message}
                              </div>

                              {/* TIME */}
                              <div
                                className={`flex items-center gap-1 mt-1 text-[11px] text-gray-400 ${
                                  isMine
                                    ? "justify-end"
                                    : ""
                                }`}
                              >

                                <span>
                                  {formatTime(
                                    msg.created_at
                                  )}
                                </span>

                                {isMine && (
                                  <CheckCheck
                                    size={13}
                                  />
                                )}

                              </div>

                            </div>

                          </div>
                        );
                      }
                    )
                  )}

                </div>

                {/* =================================================
                    MESSAGE INPUT
                ================================================== */}

                <div className="p-4 border-t border-gray-200 bg-white">

                  <div className="flex items-end gap-2">

                    {/* ATTACHMENT */}
                    <button
                      type="button"
                      className="p-3 text-gray-500 hover:bg-gray-100 rounded-lg"
                      title="Attach file"
                    >
                      <Paperclip
                        size={20}
                      />
                    </button>

                    {/* TEXTAREA */}
                    <div className="flex-1 relative">

                      <textarea
                        value={message}
                        onChange={(e) =>
                          setMessage(
                            e.target.value
                          )
                        }
                        onKeyDown={
                          handleKeyDown
                        }
                        rows={1}
                        placeholder={
                          selectedChat.isNew
                            ? "Write your first message..."
                            : "Type your message..."
                        }
                        className="w-full resize-none border border-gray-200 rounded-xl px-4 py-3 pr-11 outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      {/* EMOJI */}
                      <button
                        type="button"
                        className="absolute right-2 bottom-2.5 text-gray-400 hover:text-gray-600"
                        title="Emoji"
                      >
                        <Smile
                          size={19}
                        />
                      </button>

                    </div>

                    {/* SEND */}
                    <button
                      type="button"
                      onClick={
                        sendMessage
                      }
                      disabled={
                        sending ||
                        !message.trim() ||
                        !selectedChat?.other_user_id
                      }
                      className="p-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Send message"
                    >

                      {sending ? (
                        <RefreshCw
                          size={20}
                          className="animate-spin"
                        />
                      ) : (
                        <Send
                          size={20}
                        />
                      )}

                    </button>

                  </div>

                  <p className="text-[11px] text-gray-400 mt-2">
                    Press Enter to send
                  </p>

                </div>

              </div>
            ) : (
              /* EMPTY STATE */
              <div className="hidden md:flex flex-col items-center justify-center text-center">

                <MessageSquare
                  size={50}
                  className="text-gray-300"
                />

                <h2 className="text-xl font-semibold text-gray-800 mt-4">
                  Select a conversation
                </h2>

                <p className="text-gray-500 mt-2">
                  Select a candidate to start messaging.
                </p>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default Messages;