import React, { useState, useEffect } from "react";
import { Sidebar, ConversationList, Conversation, Avatar } from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { LogoutOutlined } from '@ant-design/icons'
import { auth, db, logout } from '../../Firebase'
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import 'bootstrap/dist/css/bootstrap.min.css'

const Chatlist = ({ sidebarStyle, conversationContentStyle, conversationAvatarStyle, handleClick }) => {
  const [user] = useAuthState(auth)
  const [name, setName] = useState('Undefined')
  const [users, setUsers] = useState([])
  const [lastChat, setLastChat] = useState({})


  //* A function to fetch the name of the logged in user
  async function fetchUserName() {
    try {
      // Creating query to 'users' database to get the logged-in user
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      if (doc.empty) {
        //^ Hadle what to do if fetched document is empty
        //console.error("No matching documents found.");
        return; // Return if fetched dicument is empty
      }
      const data = doc.docs[0].data();
      setName(data.name); // Set users name
    } catch (err) {
      //^ handle error
      //console.error('fetchUserName error:', err);
    }
  }

  //* Function to create users Avatar on the basis of user's name
  const getAvatar = async (name) => {
    try {
      const nameArray = name.split(" ");
      const firstName = nameArray[0];
      const lastName = nameArray[nameArray.length - 1];
      const firstInitial = firstName.charAt(0).toUpperCase();
      const lastInitial = lastName.charAt(0).toUpperCase();
      // TUsing "ui-avatars.com" for this purpose
      const avatar = `https://ui-avatars.com/api/?name=${firstInitial}${lastInitial}&size=200`;
      return avatar;
    } catch (error) {
      //^ Handle error
      //console.error(error);
    }
  };

  //* Function to make user_status 'offline' on logOut
  const logoutAndSetOffline = async () => {
    try {
      // Set user status to "offline"
      if (user) {
        // Creating query to 'users' database to get the user
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const querySnapshot = await getDocs(q);
        const docRef = doc(db, "users", querySnapshot.docs[0].id);

        // Updating the 'users' database for only-user
        await updateDoc(docRef, {
          status: 'Ofline',
        });
      }

      // Logout
      logout();
    } catch (error) {
      //^ Hande error
      //console.error("Error setting offline status and logging out:", error);
    }
  };

  //* useEffect-hook for general purpose works need to be done on page load
  useEffect(() => {
    // Calling function to fetch the user name and show it
    fetchUserName();

    // Function to get all the other users [can be reffered as 'client' to our '']
    const getUsers = () => {
      try {
        // Fetching all the users except of 'user'
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, where('uid', '!=', user?.uid));

        // Returning the changes done in app on being loaded
        return onSnapshot(q, (snapshot) => {
          const updatedUsers = snapshot.docs.map(async (doc) => {
            const userData = doc.data();
            const userAvatar = await getAvatar(userData.name);
            return { ...userData, avatar: userAvatar };
          });

          // Promissing the changes to set-users
          Promise.all(updatedUsers)
            .then((updatedUsersData) => {
              setUsers(updatedUsersData);
            })
            .catch((error) => {
              //^ Handle errors
              //console.error('Error fetching user details:', error);
            });
        });
      } catch (error) {
        //^ Handle errors
        //console.error('Error fetching users:', error);
      }
    };

    // Adding reference to the function
    const unsubscribe = getUsers();

    // This ensures proper cleanup and updates the user's status in the system.
    const handleBeforeUnload = async () => {
      await logoutAndSetOffline();
    };

    // Add event listener for beforeunload
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      unsubscribe;
    };
  }, [user]);

  //* useEffect-hook to fetch the last message between 'user' and 'client' in Real-Time
  useEffect(() => {
    // Mapping from the users to get 'last chat' for each 'user'->'client' Chat
    users.map((client) => {
      // Creating a specefic 'chatId' for one 'user'->'client' Chat
      const chatId = user?.uid > client.uid
        ? user?.uid + client.uid
        : client.uid + user?.uid

      // Function to fetch the last Message
      const getLastMessage = async () => {
        try {
          // Fetching the data from the 'userChats' database
          const infoMessage = await getDoc(doc(db, "userChats", client.uid))
          const lastChat = infoMessage.data()[chatId]?.lastMessage?.text || "";
          setLastChat(prevState => {
            // If the user is new or not present previously, add a new data
            if (!prevState.hasOwnProperty(client.uid)) {
              return { ...prevState, [client.uid]: lastChat };
            }
            // If the user exists, update the lastChat value
            return { ...prevState, [client.uid]: lastChat };
          });

        } catch (error) {
          //^ Handle error
          //console.error(error);
        }
      };
      // Calling the function
      getLastMessage()
    })
  })


  return (
    <Sidebar position="left" scrollable={true} style={{ ...sidebarStyle, height: "100vh" }}>
      {/* Showing User Name */}
      <button disabled className="btn btn-primary px-2">{name}</button>
      {/* Showing Other Users (clients) */}
      <ConversationList scrollable>
        {user && users.map((user) => (
          <Conversation key={user.uid} lastActivityTime={""}
            onClick={() => { handleClick(user.uid) }}>
            <Avatar src={user.avatar} name={user.name} status="available" style={conversationAvatarStyle} />
            <Conversation.Content
              name={user.name}
              info={lastChat[user.uid]}
              style={conversationContentStyle}
            />
          </Conversation>
        ))}
      </ConversationList>
      {/* Button to 'logOut' user */}
      <button type="submit" className="btn btn-primary px-2"
        onClick={logoutAndSetOffline}> Logout
        <LogoutOutlined /> </button>
    </Sidebar>
  );
};

export default Chatlist;
