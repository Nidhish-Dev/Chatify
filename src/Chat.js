// src/Chat.js
import React, { useEffect, useState, useRef } from 'react';
import { auth, database } from './firebase';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import { getDatabase, ref, push, onValue, off, set } from 'firebase/database';

import './Chat.css'; // Import the styles

function Chat() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const messagesRef = ref(database, 'messages');

    const fetchMessages = (snapshot) => {
      const messagesData = snapshot.val();
      if (messagesData) {
        const messagesArray = Object.values(messagesData);
        setMessages(messagesArray);
      }
    };

    onValue(messagesRef, fetchMessages);

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      off(messagesRef, 'value', fetchMessages);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;

    // Calculate whether the user is at the bottom of the scrollable container
    const isAtBottom =
      container.scrollHeight - container.scrollTop === container.clientHeight;

    // If the user is at the bottom, scroll to the bottom automatically
    if (isAtBottom) {
      scrollToBottom();
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      const messagesRef = ref(database, 'messages');
      const newMessageRef = push(messagesRef);

      set(newMessageRef, {
        text: newMessage,
        user: user ? user.displayName || 'Anonymous' : 'Anonymous',
      }).then(() => {
        setNewMessage('');
      });
    }
  };

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(getAuth(), provider);
      setUser(result.user);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(getAuth());
      setUser(null);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="chat-container">
      <div className="user-info">
        {user ? (
          <div>
            <p>Welcome, {user.displayName || 'Anonymous'}!</p>
            <button onClick={handleSignOut}>Logout</button>
          </div>
        ) : (
          <button onClick={handleSignIn}>Login with Google</button>
        )}
      </div>
      <div
        className="message-container"
        ref={messagesContainerRef}
        onScroll={handleScroll}
        style={{ overflowY: 'auto', maxHeight: '300px' }}
      >
        {messages.map((message, index) => (
          <div key={index} className="message">
            <span className="user">{message.user}:</span>
            <span className="text">{message.text}</span>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input 
        placeholder='Type message here'
          type="text"
          className='msg'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage} className='send' disabled={!user}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
