import React, { useEffect, useRef, useState } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import '../Styles/ChatPage.css';

// Helper to generate initials from name
const getInitials = (name) => {
  if (!name) return '';
  const names = name.trim().split(' ');
  if (names.length === 1) return names[0][0];
  return names[0][0] + names[1][0];
};

// Helper to assign avatar color class based on user ID (for consistent colors)
const getAvatarColorClass = (userId) => {
  const colors = ['color-1', 'color-2', 'color-3', 'color-4'];
  if (!userId) return colors[0];
  return colors[userId % colors.length];
};

const ChatPage = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' or 'users'
  const messagesEndRef = useRef(null);

  // Get user ID from localStorage
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (!userId) return;

    // Fetch all users
    axios
      .get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        // Filter out the current user
        const otherUsers = res.data.filter((user) => user.User_ID !== userId);
        setAllUsers(otherUsers);
      })
      .catch((err) => console.error('Error fetching users:', err));
  }, [userId]);

  useEffect(() => {
    if (!selectedUser || !userId) return;

    axios
      .get(`http://localhost:5000/api/chats/${userId}/${selectedUser.User_ID}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error('Error fetching messages:', err));
  }, [selectedUser, userId]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser || !userId) return;

    const messageData = {
      Sender_ID: userId,
      Receiver_ID: selectedUser.User_ID,
      Message: newMessage.trim(),
    };

    axios
      .post('http://localhost:5000/api/chats', messageData)
      .then((res) => {
        setMessages((prev) => [...prev, res.data]);
        setNewMessage('');
      })
      .catch((err) => console.error('Error sending message:', err));
  };

  return (
    <>
      <Sidebar />
      <div className="chat-container">
        <div className="chat-list-wrapper">
          <div className="chat-header">Messages</div>
          <div className="chat-tabs">
            <button
              className={`tab-button ${activeTab === 'chats' ? 'active' : ''}`}
              onClick={() => setActiveTab('chats')}
            >
              Chats
            </button>
            <button
              className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              All Users
            </button>
          </div>

          <div className="chat-list">
            {(activeTab === 'users' ? allUsers : allUsers).map((user) => (
              <div
                key={user.User_ID}
                className={`chat-item ${
                  selectedUser?.User_ID === user.User_ID ? 'selected' : ''
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <div className={`avatar ${getAvatarColorClass(user.User_ID)}`}>
                  {getInitials(user.Name)}
                </div>
                <div className="chat-details">
                  <div className="chat-name">{user.Name}</div>
                  <div className="chat-role">{user.Role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chat-messages-wrapper">
          {selectedUser ? (
            <>
              <div className="chat-header-bar">
                Chat with {selectedUser.Name} ({selectedUser.Role})
              </div>
              <div className="messages-container">
                {messages.length === 0 && (
                  <p className="no-messages">
                    No messages yet. Start the conversation!
                  </p>
                )}
                {messages.map((msg) => (
                  <div
                    key={msg.Chat_ID}
                    className={`message ${
                      msg.Sender_ID === userId ? 'sent' : 'received'
                    }`}
                  >
                    {msg.Message}
                    <div className="message-time">
                      {new Date(msg.Time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="message-input-container">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </>
          ) : (
            <div className="select-chat-prompt">
              {activeTab === 'users'
                ? 'Select a user to start chatting'
                : 'Select a chat or user to start messaging'}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatPage;
