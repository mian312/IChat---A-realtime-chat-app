import React, { useEffect, useRef, useState } from 'react'
import { ChatContainer, ConversationHeader, VoiceCallButton, VideoCallButton, MessageList, Message, MessageSeparator, MessageInput } from '@chatscope/chat-ui-kit-react'
import { InfoCircleFilled } from '@ant-design/icons'
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { auth, db, storage } from '../../Firebase'
import { useAuthState } from 'react-firebase-hooks/auth';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Timestamp, arrayUnion, collection, doc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { v4 as uuid } from "uuid";
import 'bootstrap/dist/css/bootstrap.min.css'
import '../../index.css'

const Chatfeed = ({ chatcontainerstyle, chatUser, handleBackClick, chatUid, onSend, Ref }) => {
  // Necessarry Hooks
  const [user] = useAuthState(auth);
  const [Messages, setMessages] = useState([]);
  const [status, setStatus] = useState('');
  const inputRef = useRef();

  //* Function to attach get images grom device
  const handleAttachClick = async () => {
    // Get attached-image reference
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, file);

      try {
        // Upload to firebase-storage
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            //console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                //console.log('Upload is paused');
                break;
              case 'running':
                //console.log('Upload is running');
                break;
            }
          },
          (error) => {
            //^ Handle errors
            //console.error(error);
          },
          async () => {
            // Get url-reference of the uploaded image
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              // Update the 'chats' database
              await updateDoc(doc(db, "chats", chatUid), {
                messages: arrayUnion({
                  img: downloadURL,
                  id: uuid(),
                  senderId: user?.uid,
                  date: Timestamp.now(),
                }),
              });
            });
          }
        );
      } catch (error) {
        //^ handle error
        //console.error("Error uploading attachment:", error);
      }
    };

    fileInput.click();
  };

  //* function to send text message
  const handleSend = async (text) => {
    // Passing reference to the 'onSend' to know what to do
    onSend(text);

    // Implement Firebase Firestore functionality to save message data
    try {
      await updateDoc(doc(db, "chats", chatUid), {
        messages: arrayUnion({
          id: uuid(),
          chat: text,
          senderId: user?.uid,
          date: Timestamp.now(),
        }),
      });
    } catch (error) {
      //^ Handle error
      //console.error(error);
    }
  };

  //* useEffect-hook to update the chats in realtime
  useEffect(() => {
    if (!chatUid) {
      return; //^ Exit early if chatUid is not available
    }

    //* Realtime fetch from 'chats' database
    const unsubscribe = onSnapshot(doc(db, 'chats', chatUid), (snapshot) => {
      const chatData = snapshot.data();
      const chatMessages = chatData?.messages || [];

      const convertedMessages = chatMessages.map((message) => {
        const sentTime = message.date.toDate();

        const currentTime = new Date();
        const timeDiff = currentTime.getTime() - sentTime.getTime();

        // get message sentTime
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        const isToday = sentTime.toDateString() === currentTime.toDateString();

        let formattedTime;
        let prevDay;
        if (isToday) {
          formattedTime = 'Today';
        } else if (daysDiff <= 1) {
          formattedTime = 'Yesterday';
        } else if (daysDiff > 1) {
          formattedTime = sentTime.toLocaleDateString(); // Only show date if one or more days have passed
          prevDay = formattedTime; // Update the previous day
        } else {
          formattedTime = prevDay !== null ? null : sentTime.toLocaleTimeString(); // Show time only once per day
        }

        // get message timeAgo
        let timeAgo;
        if (timeDiff < 60000) {
          // Less than a minute ago
          timeAgo = 'just now';
        } else if (timeDiff < 3600000) {
          // Less than an hour ago
          const minutesAgo = Math.floor(timeDiff / 60000);
          timeAgo = `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
        } else if (timeDiff < 86400000) {
          // Less than a day ago
          const hoursAgo = Math.floor(timeDiff / 3600000);
          timeAgo = `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
        } else if (timeDiff < 2592000000) {
          // Less than a month ago
          const daysAgo = Math.floor(timeDiff / 86400000);
          timeAgo = `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
        } else if (timeDiff < 31536000000) {
          // Less than a year ago
          const monthsAgo = Math.floor(timeDiff / 2592000000);
          timeAgo = `${monthsAgo} month${monthsAgo > 1 ? 's' : ''} ago`;
        } else {
          // More than a year ago
          const yearsAgo = Math.floor(timeDiff / 31536000000);
          timeAgo = `${yearsAgo} year${yearsAgo > 1 ? 's' : ''} ago`;
        }

        return {
          ...message,
          sentTime: formattedTime,
          timeAgo,
        };
      });

      // Update 'message' array
      setMessages(convertedMessages);
    });

    return () => {
      // Unsubscribe from the snapshot listener when the component unmounts
      unsubscribe();
    }
  }, [chatUid]);

  //* useEffect-hook to fetch user_status in realtime
  useEffect(() => {
    if (chatUser && chatUser.uid) {
      const fetchUserStatus = async () => {
        const q = query(collection(db, "users"), where("uid", "==", chatUser.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docRef = doc(db, "users", querySnapshot.docs[0].id);

          // Subscribe to real-time updates for the document
          const unsubscribe = onSnapshot(docRef, async (snapshot) => {
            try {
              const data = snapshot.data();
              // Access the status field and perform any necessary actions
              setStatus(data.status)
            } catch (error) {
              //^ Hande error
              //console.error(error);
            }
          });

          return () => {
            // Unsubscribe from real-time updates when the component unmounts
            unsubscribe();
          };
        }
      };

      fetchUserStatus();
    }
  }, [chatUser]);



  return (
    <ChatContainer chatContainerStyle={chatcontainerstyle} style={{ height: "100vh" }}>
      {/* Setting Conversation_Header */}
      <ConversationHeader >
        <ConversationHeader.Back onClick={handleBackClick} />
        <ConversationHeader.Content userName={chatUser.name || `Welcome`} info={status} />
        <ConversationHeader.Actions>
          <VoiceCallButton />
          <VideoCallButton />
          <InfoCircleFilled style={{
            fontSize: "1.3em",
            color: ' #6ea9d7'
          }} />
        </ConversationHeader.Actions>
      </ConversationHeader>
      {/* Getting Messages */}
      <MessageList scrollBehavior='smooth'>
        {Messages.length > 0
          ? (Messages.map((msg, index) => {
            return (
              <>
                {index === 0 || msg.sentTime !== Messages[index - 1].sentTime ? (
                  <MessageSeparator content={msg.sentTime} />
                ) : null}
                <Message
                  itemRef={Ref}
                  key={index}
                  model={{
                    sentTime: msg.sentTime,
                    sender: msg.senderId,
                    direction: msg.senderId == user?.uid
                      ? "outgoing"
                      : "incoming",
                    position: "single"
                  }}
                >
                  {msg?.chat && <Message.TextContent text={msg.chat} />}
                  {msg?.img && <Message.ImageContent src={msg.img} alt={msg.img} width={300} height={400} />}
                  <Message.Footer sentTime={msg.timeAgo} />
                </Message>
              </>
            );
          }))
          // Show when there is no message between user & client
          : (<MessageList.Content style={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            height: "70vh",
            fontSize: "50vh"
          }} className='wave'>
            👋
          </MessageList.Content>)
        }
      </MessageList>
      {/* Message_Input */}
      <MessageInput placeholder="Type message here"
        onAttachClick={handleAttachClick}
        onSend={handleSend}
        ref={inputRef} autoFocus
      />
    </ChatContainer>
  )
}

export default Chatfeed
