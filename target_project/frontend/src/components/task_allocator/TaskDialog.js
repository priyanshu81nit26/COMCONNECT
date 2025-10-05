import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Stack,
  Box,
  List,
  ListItem,
} from "@chakra-ui/react";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import { debounce } from "lodash";

import { API_URL } from "../../config/api.config";

const TaskDialog = ({ isOpen, onClose, workspaceId, selectedChat }) => {
  const { user } = ChatState();
  const toast = useToast();
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [channelUsers, setChannelUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedChat) {
      // Get users from the current chat/channel
      setChannelUsers(selectedChat.users || []);
    }
  }, [selectedChat]);

  // Debounce email search
  const debouncedEmailSearch = useCallback(
    debounce((searchTerm) => {
      if (searchTerm.trim()) {
        const filteredUsers = channelUsers.filter(user => 
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filteredUsers);
      } else {
        setSearchResults([]);
      }
    }, 300),
    [channelUsers]
  );

  const handleEmailSearch = (searchTerm) => {
    setEmail(searchTerm);
    debouncedEmailSearch(searchTerm);
  };

  const selectUser = (selectedUser) => {
    setEmail(selectedUser.email);
    setSearchResults([]);
  };

  const handleSubmit = async () => {
    if (!heading.trim() || !description.trim() || !email.trim()) {
      toast({
        title: "Please fill all required fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json"
        },
        timeout: 5000, // Set timeout to 5 seconds
      };

      const response = await axios.post(
        `${API_URL}/tasks/allocate`,
        { 
          heading: heading.trim(), 
          description: description.trim(), 
          email: email.trim(), 
          workspaceId, 
          attachments 
        },
        config
      );

      toast({
        title: "Task Allocated",
        description: "Task has been successfully allocated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
      // Reset form
      setHeading("");
      setDescription("");
      setEmail("");
      setAttachments([]);
      setSearchResults([]);
    } catch (error) {
      console.error('Task allocation error:', {
        error: error.message,
        response: error.response?.data
      });

      toast({
        title: "Error allocating task",
        description: error.response?.data?.message || "Failed to allocate task",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Allocate New Task</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Heading</FormLabel>
              <Input
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                disabled={loading}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
              />
            </FormControl>
            <FormControl isRequired position="relative">
              <FormLabel>Assignee Email</FormLabel>
              <Input
                value={email}
                onChange={(e) => handleEmailSearch(e.target.value)}
                placeholder="Type to search users in channel"
                disabled={loading}
              />
              {searchResults.length > 0 && (
                <Box
                  position="absolute"
                  top="100%"
                  left={0}
                  right={0}
                  bg="white"
                  boxShadow="md"
                  borderRadius="md"
                  maxH="200px"
                  overflowY="auto"
                  zIndex={1000}
                >
                  <List spacing={2}>
                    {searchResults.map((user) => (
                      <ListItem
                        key={user._id}
                        p={2}
                        cursor="pointer"
                        _hover={{ bg: "gray.100" }}
                        onClick={() => {
                          setEmail(user.email);
                          setSearchResults([]);
                        }}
                      >
                        {user.email}
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>Attachments</FormLabel>
              <Input
                value={attachments}
                onChange={(e) => setAttachments(e.target.value.split(","))}
                placeholder="Enter attachment URLs separated by commas"
              />
            </FormControl>
            <Button 
              colorScheme="blue" 
              onClick={handleSubmit}
              isLoading={loading}
              loadingText="Allocating..."
            >
              Allocate Task
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TaskDialog; 