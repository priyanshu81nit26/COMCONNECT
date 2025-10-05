import React, { useEffect, useState } from "react";
import { Box, Stack, Text, Button,Flex, Grid } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/toast";
import { ChatState } from "../Context/ChatProvider";
import { useParams, useNavigate } from "react-router-dom";
import { fetchChats } from "../utils/api";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { getSender } from "../config/ChatLogics";
import "./chatbox.css";
import { API_URL } from "../config/api.config";
import { IoChatbubblesSharp } from "react-icons/io5";
import { CiBoxList } from "react-icons/ci";
import { FaLocationDot } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const { workspaceId } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  const handleFetchChats = async () => {
    try {
      if (!workspaceId) {
        throw new Error("No workspace selected.");
      }
      const data = await fetchChats(user.token, workspaceId);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    handleFetchChats();
  }, [fetchAgain, workspaceId]);

  const sortedChats = Array.isArray(chats)
    ? [...chats].sort((a, b) => a.chatName.length - b.chatName.length)
    : [];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 3,
        boxSizing: "border-box",
        background: "#0f1924",
        border: "none",
      }}
    >
      <Box w="100%" >
        <Flex
          justifyContent="flex-start"
          alignItems="center"
          w="100%"
          
        >
          <Text
            fontFamily="head"
            fontSize="3xl"
            textAlign="left"
            color="#fff"
            pl={{ base: "5vw", md: "5vw" }}
          >
            COMCONNECT
          </Text>
        </Flex>
      </Box>

    
      <Box
        py={3}
        
        fontFamily="subhead"
        display="flex"
        flexDirection="column"
        w="100%"
        justifyContent="left"
        alignItems={"left"}
        gap={4}
      >
        <Grid templateColumns="1fr 1fr" gap={5} w="100%" mb={2}>
          <Button
            width="100%"
            fontSize={{ base: "15px", md: "17px", lg: "17px" }}
            sx={{
              backgroundColor: "transparent",
              color: "#fff",
              _hover: { backgroundColor: "#21364a" },
            }}
          >
            <IoChatbubblesSharp style={{ marginRight: "8px", color: "#fff" }} />
            My Chats
          </Button>
          <GroupChatModal>
            <Button
              width="100%"
              fontSize={{ base: "15px", md: "17px", lg: "17px" }}
              sx={{
                backgroundColor: "transparent",
                color: "#fff",
                _hover: { backgroundColor: "#21364a" },
              }}
            >
              <FaPlus style={{ marginRight: "8px", color: "#fff" }} /> New Group Chat
            </Button>
          </GroupChatModal>
        </Grid>

        <Grid templateColumns="1fr 1fr" gap={5} w="100%">
          <Button
            width="100%"
            fontSize={{ base: "15px", md: "17px", lg: "17px" }}
            sx={{
              backgroundColor: "transparent",
              color: "#fff",
              _hover: { backgroundColor: "#21364a" },
            }}
            onClick={() => navigate(`/tasks/${workspaceId}`)}
          >
            <CiBoxList style={{ marginRight: "8px", color: "#fff" }} />
            Go to Tasks
          </Button>
          <Button
            width="100%"
            fontSize={{ base: "15px", md: "17px", lg: "17px" }}
            sx={{
              backgroundColor: "transparent",
              color: "#fff",
              _hover: { backgroundColor: "#21364a" },
            }}
            onClick={() => navigate(`/geo-location`)}
          >
            <FaLocationDot style={{ marginRight: "8px", color: "#fff" }} />
            Map
          </Button>
        </Grid>
      </Box>
      <Box
      d="flex"
      flexDir="column"
      w="100%"
      h="100%"
      overflowY="auto"
      sx={{
        paddingTop: "30px",
        paddingRight: "10px",
        paddingLeft: "10px",
        paddingBottom: "20px",
        boxSizing: "border-box",
      }}
    >
        
      <Box
        d="flex"
        flexDir="column"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="auto"
        background="transparent"
        sx={{
          flexDirection: "column",
          color: "#04539D",
          width: "100%",
          borderRadius: "12px",
          padding: "15px",
          flexGrow: 1,
          overflowX: "hidden",
          // Custom scrollbar styles
          "&::-webkit-scrollbar": {
            width: "15px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#D9D9D9",
            borderRadius: "8px",
            border: "1px solid #6d6a6a",
            margin: "2px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#3C87CD",
            borderRadius: "8px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#1f449c",
          },
        }}
      >
        {Array.isArray(chats) ? (
          <Stack >
            {sortedChats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}

                cursor="pointer"
                bg={selectedChat === chat ? "#21364a" : "#transparent"}
                color={selectedChat === chat ? "#fff" : "#fff"}
              

                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text
                  fontFamily="subhead"
                  fontSize={{ base: "15px", md: "17px", lg: "17px" }}
                >
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize={{ base: "12px", md: "15px", lg: "17px" }} fontFamily="subhead">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
      </Box>
    </Box>
  );
};

export default MyChats;
