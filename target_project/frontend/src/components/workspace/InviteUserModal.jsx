import React, { useState } from "react";
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
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useWorkspace } from "../../Context/WorkspaceProvider";

const InviteUserModal = ({ roleId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = useState("");
  const toast = useToast();
  const { user, selectedWorkspace } = useWorkspace();

  const handleInvite = async () => {
    if (!email) {
      toast({
        title: "Please enter an email",
        status: "warning",
        duration: 5001,
        isClosable: true,
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.post(
        `/api/workspace/${selectedWorkspace._id}/invite`,
        { email, roleId },
        config
      );

      toast({
        title: "Invitation Sent",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button onClick={onOpen}>Invite User</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invite User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Input
                placeholder="User Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleInvite}>Invite</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default InviteUserModal;
