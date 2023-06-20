// import React, { useState, useEffect } from "react";
// import { Sidebar, ConversationList, Conversation, Avatar, Search, Message } from "@chatscope/chat-ui-kit-react";
// import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
// import { LogoutOutlined } from '@ant-design/icons'
// import { auth, db, logout } from '../../Firebase'
// import { useAuthState } from "react-firebase-hooks/auth";
// import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
// import ScrollableFeed from 'react-scrollable-feed';

// const Chatlist = ({ sidebarStyle, conversationContentStyle, conversationAvatarStyle, handleClick, handleSend }) => {
//   const [name, setName] = useState('Undefined')
//   const [avatar, setAvatar] = useState(null)
//   const [chatUser, setChatUser] = useState(null)
//   const [users, setUsers] = useState([])
//   const [user, loading] = useAuthState(auth)

//   async function fetchUserName() {
//     try {
//       console.log("Fetching user data...");
//       const q = query(collection(db, "users"), where("uid", "==", user?.uid));
//       const doc = await getDocs(q);
//       if (doc.empty) {
//         console.error("No matching documents found.");
//         alert("An error occurred while fetching user data");
//         return;
//       }
//       const data = doc.docs[0].data();
//       setName(data.name);
//     } catch (err) {
//       console.error('fetchUserName error:', err);
//       alert("An error occurred while fetching user data");
//     }
//   }

//   const getAvatar = async (name) => {
//     try {
//       const nameArray = name.split(" ");
//       const firstName = nameArray[0];
//       const lastName = nameArray[nameArray.length - 1];
//       const firstInitial = firstName.charAt(0).toUpperCase();
//       const lastInitial = lastName.charAt(0).toUpperCase();
//       const avatar = `https://ui-avatars.com/api/?name=${firstInitial}${lastInitial}&size=200`;
//       return avatar;
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const getLastMessage = async (clientId) => {
//     try {
//       const chatId = user.uid > clientId
//         ? user.uid + clientId
//         : clientId + user.uid
//       const infoMessage = await getDoc(doc(db, "userChats", clientId))
//       const lastChat = infoMessage.data()[chatId]?.lastMessage?.text || "";
//       return lastChat;
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const logoutAndSetOffline = async () => {
//     try {
//       // Set user status to "offline"
//       if (user) {
//         const q = query(collection(db, "users"), where("uid", "==", user?.uid));
//         const querySnapshot = await getDocs(q);
//         const docRef = doc(db, "users", querySnapshot.docs[0].id);
//         await updateDoc(docRef, {
//           status: "offline",
//         });
//       }

//       // Logout
//       logout();
//     } catch (error) {
//       console.error("Error setting offline status and logging out:", error);
//     }
//   };

//   useEffect(() => {
//     fetchUserName();

//     const getUsers = () => {
//       try {
//         const usersCollection = collection(db, 'users');
//         const q = query(usersCollection, where('uid', '!=', user?.uid));

//         return onSnapshot(q, (snapshot) => {
//           const updatedUsers = snapshot.docs.map(async (doc) => {
//             const userData = doc.data();
//             const userAvatar = await getAvatar(userData.name);
//             const userLastMessage = await getLastMessage(userData.uid);
//             return { ...userData, avatar: userAvatar, lastChat: userLastMessage };
//           });

//           Promise.all(updatedUsers)
//             .then((updatedUsersData) => {
//               setUsers(updatedUsersData);
//             })
//             .catch((error) => {
//               console.error('Error fetching user details:', error);
//             });
//         });
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };

//     const unsubscribe = getUsers();
    
//     const handleBeforeUnload = async () => {
//       await logoutAndSetOffline();
//     };

//     // Add event listener for beforeunload
//     window.addEventListener("beforeunload", handleBeforeUnload);

//     // Clean up the event listener on component unmount
//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//       unsubscribe;
//     };
//   }, [user]);


//   return (
//     <Sidebar position="left" scrollable={true} style={{ ...sidebarStyle, height: "100vh" }}>
//       <button disabled="disabled">
//         Welcome {name}</button>
//       <ConversationList scrollable>
//         {/* <ScrollableFeed  style={{ height: "100%", width: "100%", overflow: "auto" }}> */}
//         {user && users.map((user) => (
//           <Conversation key={user.uid} lastActivityTime={""}
//             onClick={() => { handleClick(user.uid) }}>
//             <Avatar src={user.avatar} name={user.name} status="available" style={conversationAvatarStyle} />
//             <Conversation.Content
//               name={user.name}
//               info={user.lastChat}
//               style={conversationContentStyle}
//             />
//           </Conversation>
//         ))}
//         {/* </ScrollableFeed> */}
//       </ConversationList>
//       <button type="submit"
//         onClick={logoutAndSetOffline}> Logout
//         <LogoutOutlined /> </button>
//     </Sidebar>
//   );
// };

// export default Chatlist;

const [userLastMessage, setUserLastMessage] = useState({ user: null, lastChat: "" });


const updateLastChat = (user, lastChat) => {
  setUserLastMessages(prevState => {
    // If the user is new or not present previously, add a new data
    if (!prevState.hasOwnProperty(user)) {
      return { ...prevState, [user]: lastChat };
    }
    // If the user exists, update the lastChat value
    return { ...prevState, [user]: lastChat };
  });
};


const getLastMessage = async (clientId) => {
  try {
    const chatId = user.uid > clientId
      ? user.uid + clientId
      : clientId + user.uid
    const infoMessage = await getDoc(doc(db, "userChats", clientId))
    const lastChat = infoMessage.data()[chatId]?.lastMessage?.text || "";
    setLastChat()
  } catch (error) {
    console.error(error);
  }
};
