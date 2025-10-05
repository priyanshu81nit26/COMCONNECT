import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { Avatar } from "@chakra-ui/avatar";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  flexbox,
  IconButton,
  Spinner,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import animationData from "../animations/typing.json";
import "./styles.css";
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import TaskDialog from "./task_allocator/TaskDialog";
import { useDisclosure } from "@chakra-ui/react";
import SideDrawer from "./miscellaneous/SideDrawer";
import { API_URL } from "../config/api.config";
const ENDPOINT = "";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `${API_URL}/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const token = user.token;
  console.log(token);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          `${API_URL}/message`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
        setNewMessage("");
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
      }
    });

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("message recieved");
    };
  }, [selectedChat, notification, fetchAgain]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (e.target.value === "/task") {
      onOpen();
      setNewMessage("");
    }

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    window.location.href = "/";
  };

  return (
    <Box>
      <SideDrawer />
      {selectedChat ? (
        <>
          <Box d="flex" flexDir="column" bg="#000" w="100%" height="100vh">
            <Box
              bg="transparent"
              display="flex"
              flexDirection="row"
              alignItems={"center"}
              width="100%"
            >
              <Text
                fontSize={{ base: "28px", md: "30px" }}
                pb={3}
                px={3}
                fontFamily="Work sans"
                d="flex"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
                color="#fff"
              >
                <IconButton
                  d={{ base: "flex", md: "none" }}
                  mx={"1.5"}
                  icon={<ArrowBackIcon />}
                  onClick={() => setSelectedChat("")}
                />
                {messages &&
                  (!selectedChat.isGroupChat ? (
                    <>
                      {getSender(user, selectedChat.users)}
                      <ProfileModal
                        user={getSenderFull(user, selectedChat.users)}
                      />
                    </>
                  ) : (
                    <>
                      {selectedChat.chatName.toUpperCase()}
                      <UpdateGroupChatModal
                        fetchMessages={fetchMessages}
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                      />
                    </>
                  ))}
              </Text>
              <div>
                <Menu>
                  <MenuButton
                    as={Button}
                    mx={"5px"}
                    bg="white"
                    rightIcon={<ChevronDownIcon />}
                  >
                    <Avatar
                      size="sm"
                      cursor="pointer"
                      name={user.name}
                      src={user.pic}
                    />
                  </MenuButton>
                  <MenuList>
                    <ProfileModal user={user}>
                      <MenuItem>My Profile</MenuItem>{" "}
                    </ProfileModal>
                    <MenuDivider />
                    <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              </div>
            </Box>
            <Box
              d="flex"
              flexDir="column"
              // justifyContent="flex-end"
              p={3}
              mb={3}
              bg="transparent"
              w="100%"
              h="90%" // Adjust height to fit the viewport
              position="relative"
            >
              {loading ? (
                <Spinner
                  size="xl"
                  w={20}
                  h={20}
                  alignSelf="center"
                  margin="auto"
                />
              ) : (
                <div className="messages-container" pb={20}>
                  <div className="messages">
                    <ScrollableChat messages={messages} />
                  </div>
                </div>
              )}

              <FormControl
                onKeyDown={sendMessage}
                id="first-name"
                isRequired
                mt={3}
                position="sticky"
                bottom="0"
                width="100%"
                bg="transparent"
                p={3}
              >
                {istyping ? <div>typing...</div> : <></>}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Input
                    width="90%" // Adjust width to accommodate the button
                    variant="filled"
                    bg="#21364a"
                    placeholder="Type Here"
                    value={newMessage}
                    onChange={typingHandler}
                    borderColor="grey"
                    color={"white"}
                    className="enteramsg"
                  />
                  <Button
                    ml={2}
                    bg="#05549e"
                    color="#fff"
                    onClick={(e) => {
                      e.preventDefault();
                      sendMessage();
                    }}
                  >
                    Send
                  </Button>
                </div>
              </FormControl>
            </Box>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box d="flex" alignItems="center" bg="#0f1924" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} textColor="#fff" fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
      <TaskDialog
        isOpen={isOpen}
        onClose={onClose}
        workspaceId={selectedChat?.workspace}
        selectedChat={selectedChat}
      />
    </Box>
  );
};

export default SingleChat;
