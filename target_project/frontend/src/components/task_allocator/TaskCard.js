import React from "react";
import {
  Box,
  Text,
  Textarea,
  Select,
  FormControl,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { Flex } from "@chakra-ui/layout";

const TaskCard = ({ task, fetchTasks, config, onClick }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newStatus, setNewStatus] = React.useState(task.status);
  const [comment, setComment] = React.useState("");

  const updateTaskStatus = async () => {
    try {
      await axios.patch(
        "/api/tasks/update-status",
        { taskId: task._id, status: newStatus },
        config
      );
      fetchTasks();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const addComment = async () => {
    try {
      await axios.post(
        "/api/tasks/add-comment",
        { taskId: task._id, comment },
        config
      );
      fetchTasks();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <Box p={4} shadow="md" border="none" bg="#21364a" cursor="pointer" borderRadius="md">
      <Flex  justifyContent="space-evenly" onClick={onOpen}>
        <Box>
          <Text fontFamily="content" textColor="#fff">{task.heading}</Text>
          <Text fontFamily="content" textColor="#fff">{task.description}</Text>
        </Box>
        <Text fontFamily="content" textColor="#fff">Assignee: {task.assignee.email}</Text>
        <Text fontFamily="content" textColor="#fff">Created By: {task.createdBy.email}</Text>
      </Flex>
      
      <FormControl mt={4}>
        <Select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          border="none"
          bg="#234b75ff"
          color="#fff"
          textColor="#fff"
          _focus={{bg: "#25374bff"}}
          _hover={{ bg: "#232d38ff", color: "#fff" }}
        >
          <option value="to-do" style={{ background: "#234b75ff", borderRadius: "50%", color: "#fff" }}>To Do</option>
          <option value="in-progress" style={{ background: "#234b75ff", borderRadius: "50%", color: "#fff" }}>In Progress</option>
          <option value="done" style={{ background: "#234b75ff", borderRadius: "50%", color: "#fff" }}>Done</option>
        </Select>
        <Button mt={2} bg="#05549e" textColor="#fff" _hover={{ bg: "#0c77dbff" }} onClick={updateTaskStatus}>
          Update Status
        </Button>
      </FormControl>

      {/* Modal for task details */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#0f1924" justifyContent="center">
          <ModalHeader fontFamily="head" textColor="#fff">{task.heading}</ModalHeader>
          <ModalCloseButton color="#fff" />
          <ModalBody>
            <Text fontWeight="bold" fontFamily="subhead" textColor="#fff">Description:</Text>
            <Text mb={4} fontFamily="content" textColor="#fff">{task.description}</Text>
            <Text fontWeight="bold" fontFamily="subhead" textColor="#fff">Assignee:</Text>
            <Text mb={4} fontFamily="content" textColor="#fff">{task.assignee.email}</Text>
            <Text fontWeight="bold" fontFamily="subhead" textColor="#fff">Created By:</Text>
            <Text mb={4} fontFamily="content" textColor="#fff">{task.createdBy.email}</Text>

            <Textarea
              mt={4}
              placeholder="Add a comment"
              value={comment}
              border="none"
              bg="#21364a"
              onChange={(e) => setComment(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button bg="#05549e" textColor="#fff"  _hover={{ bg: "#0c77dbff" }} mr={3} onClick={addComment}>
              Add Comment
            </Button>
            <Button bg="#700303ff" color="#fff" _hover={{ bg: "#9b1c1cff" }} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TaskCard;
