import React, { useState, useCallback, useEffect, useRef } from 'react';
import { MainContainer } from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import Chatlist from "./Chatlist";
import Chatfeed from './Chatfeed';
import { auth, db } from '../../Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css'

const Chats = () => {
  const [user] = useAuthState(auth)
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarStyle, setSidebarStyle] = useState({});
  const [chatContainerStyle, setChatContainerStyle] = useState({});
  const [conversationContentStyle, setConversationContentStyle] = useState({});
  const [conversationAvatarStyle, setConversationAvatarStyle] = useState({});
  const [chatUser, setChatUser] = useState('')
  const [chatUid, setChatUid] = useState('')

  const navigate = useNavigate();
  const chatFeedRef = useRef(null);

  //* Function to handle what to do on back_click
  const handleBackClick = () => setSidebarVisible(!sidebarVisible);

  //* Function to handle what to do when a conversation is being clickes
  const handleConversationClick = useCallback(() => {
    if (sidebarVisible) {
      setSidebarVisible(false);
    }
  }, [sidebarVisible, setSidebarVisible]);

  //* Function to fetch the chats
  const getChat = async (chatId, path) => {
    try {
      // Getting chat on the basis of chatId
      const res = await getDoc(doc(db, path, chatId));
      if (!res.exists()) {
        await setDoc(doc(db, path, chatId),
          { messages: [] });
      }
    } catch (err) {
      //^ Handle error
      // console.error("getChat error", err);
    }
  }

  //* Function to create_chat
  const createChat = async (client, chatId) => {
    try {
      // For user side chat
      await getChat(user.uid, "userChats")
      await updateDoc(doc(db, "userChats", user.uid),
        {
          [chatId + ".userInfo"]: {
            uid: client.uid,
            displayName: client.name,
          },
          [chatId + ".date"]: serverTimestamp()
        })

      // For client side chat
      await getChat(client.uid, "userChats")
      await updateDoc(doc(db, "userChats", client.uid),
        {
          [chatId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.name,
          },
          [chatId + ".date"]: serverTimestamp()
        })
    } catch (err) {
      //^ Handle error
      // console.error("createChat error", err);
    }
  }

  //* Function to select a specefic chat
  const selectChat = async (chat) => {
    try {
      // fetch data of the clicked user
      const q = query(collection(db, "users"), where("uid", "==", chat));
      const doc = await getDocs(q);
      const usersData = doc.docs.map((doc) => doc.data());
      setChatUser(usersData[0]);
      const chatId = user.uid > usersData[0].uid
        ? user.uid + usersData[0].uid
        : usersData[0].uid + user.uid

      setChatUid(chatId)

      // Check weather chats exits, if not create
      await getChat(chatId, "chats")

      // create user chats
      await createChat(usersData[0], chatId)

    } catch (err) {
      //^ Handle error
      // console.error('select chat:', err);
    }
  }

  //* Function to handle_click
  const handleClick = (chats) => {
    handleConversationClick()
    selectChat(chats)
  }

  //* Function to select what to do if a message is being sent
  const handleSend = async (text) => {
    // Update last_message on user-side
    await updateDoc(doc(db, "userChats", user.uid), {
      [chatUid + ".lastMessage"]: {
        text,
      },
      [chatUid + ".date"]: serverTimestamp(),
    });

    // Update last_message in client-side
    await updateDoc(doc(db, "userChats", chatUser.uid), {
      [chatUid + ".lastMessage"]: {
        text,
      },
      [chatUid + ".date"]: serverTimestamp(),
    });
  };

  //* Function to set a user status online
  const setOnline = async () => {
    try {
      // Make query to 'users' database to get the detils of the 'user'
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const querySnapshot = await getDocs(q);
      const docRef = doc(db, "users", querySnapshot.docs[0].id);

      // Updating the document of 'users' database for 'user'
      await updateDoc(docRef, {
        status: 'online',
      });
    } catch (error) {
      //^ Handle error
      // console.log("setOnline error", error)
    }
  }

  //* useEffect-hook to set some custom stylling on the components
  useEffect(() => {
    if (sidebarVisible) {
      setSidebarStyle({
        display: "flex",
        flexBasis: "auto",
        minWidth: "100%"
      });
      setConversationContentStyle({
        display: "flex",
      });
      setConversationAvatarStyle({
        marginRight: "1em"
      });
      setChatContainerStyle({
        display: "none"
      });
    } else {
      setSidebarStyle({});
      setConversationContentStyle({});
      setConversationAvatarStyle({});
      setChatContainerStyle({});
    }
  }, [sidebarVisible, setSidebarVisible, setConversationContentStyle, setConversationAvatarStyle, setSidebarStyle, setChatContainerStyle]);

  //* useEffect-hook to do work on basis of avability of user
  useEffect(() => {
    if (!user) {
      // Goto home page if the user is not logged in
      navigate('/');
      return;
    } else {
      // Call function to set user online if the user is online
      setOnline();
      return;
    }
  })

  return (
    <div style={{}}>
      <MainContainer responsive style={{ height: "100%", width: "100%", overflow: "auto" }}>
        {/* First component <Chatlist/> */}
        <Chatlist
          sidebarStyle={sidebarStyle}
          conversationContentStyle={conversationContentStyle}
          conversationAvatarStyle={conversationAvatarStyle}
          handleClick={handleClick}
        />

        {/* Second component <Chatfeed/> */}
        <Chatfeed Ref={chatFeedRef}
          chatcontainerstyle={chatContainerStyle}
          handleBackClick={handleBackClick}
          chatUser={chatUser}
          onSend={handleSend}
          chatUid={chatUid}
        />
      </MainContainer>
    </div>


  );
};

export default Chats;
