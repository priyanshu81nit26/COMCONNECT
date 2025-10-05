import React, { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { joinspace } from "../../utils/media/media";
import { API_URL } from "../../config/api.config";

const JoinWorkspaceModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [workspaceId, setWorkspaceId] = useState("");
  const [roleName, setRoleName] = useState("");
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const toast = useToast();
  const { user, setChats } = ChatState();
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchGroups = async () => {
      if (user?.token && workspaceId) {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };

          // Ensure you have a workspaceId to use in the API call
          if (!workspaceId) {
            console.error("Workspace ID is required to fetch groups.");
            return;
          }

          const url = `${API_URL}/workspace/${workspaceId}/groups`;
          const { data } = await axios.get(url, config);
          setGroups(data);
        } catch (error) {
          console.error("Failed to fetch groups:", error);
        }
      }
    };

    // Fetch groups when component mounts
    fetchGroups();
  }, [workspaceId, user?.token]);

  const findGroupIdByRoleName = (roleName) => {
    const group = groups.find((group) => group.chatName === roleName);
    return group ? group._id : null;
  };

  const joinWorkspace = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const groupId = findGroupIdByRoleName(roleName);
      if (!groupId) {
        throw new Error("Group ID not found for the given role name.");
      }

      const { data } = await axios.post(
        `${API_URL}/workspace/join`,
        { workspaceId, groupId },
        config
      );

      toast({
        title: "Successfully joined the workspace.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setChats(data.group); // Update chats with the joined group
      onClose();

      navigate(`/workspace/${workspaceId}/chats`); // Redirect to the workspace chat
    } catch (error) {
      toast({
        title: "Error occurred!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    setLoading(false);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <img
            className="join_workspace_img"
            width={350}
            height={200}
            src={joinspace}
            alt="workspace"
          />
          <ModalHeader>Join Workspace</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="workspace-id" isRequired>
              <Input
                placeholder="Enter Workspace ID"
                onChange={(e) => setWorkspaceId(e.target.value)}
              />
            </FormControl>
            <FormControl id="role" isRequired mt={4}>
              <Input
                placeholder="Enter Role Name"
                onChange={(e) => setRoleName(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={joinWorkspace}
              isLoading={loading}
            >
              Join
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default JoinWorkspaceModal;