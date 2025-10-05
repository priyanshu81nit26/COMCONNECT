import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Text,
  Tabs,
  TabPanels,
  TabPanel,
  TabList,
  useToast,
  Flex,
  Stack,
  Tab,
} from "@chakra-ui/react";
import StatusPanel from "./StatusPanel";
import { ChatState } from "../../Context/ChatProvider";
import AllocatedTasks from "./AllocatedTasks";
import { API_URL } from "../../config/api.config";

const TaskAllocator = ({ workspaceId }) => {
  const { user } = ChatState();
  const toast = useToast();

  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/tasks/my-tasks?workspaceId=${workspaceId}`,
        config
      );
      setTasks(data);
    } catch (error) {
      toast({
        title: "Error fetching tasks",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [workspaceId, config, toast]);

  useEffect(() => {
    if (user?.token) {
      fetchTasks();
    }
  }, [fetchTasks, user?.token]);

  const allocateTask = async () => {
    try {
      const { data } = await axios.post(
        `${API_URL}/tasks/allocate`,
        { heading, description, email, workspaceId, attachments },
        config
      );
      toast({
        title: "Task Allocated",
        description: "Task has been successfully allocated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setTasks((prevTasks) => [...prevTasks, data]);
      setHeading("");
      setDescription("");
      setEmail("");
      setAttachments([]);
    } catch (error) {
      toast({
        title: "Error allocating task",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  return (
    <Box p={5} width="90%" minHeight="100vh" mx="auto">
      <Flex
        direction={["column", "column", "row", "row"]}
        alignItems="center"
        flexWrap="wrap"
        justifyContent="space-evenly"
        minHeight="100vh"
        gap={[5, 5, 5,10]}
      >
        {/* Left Side - Task Input Form */}
        <Box w={["100%", "100%", "40%", "28%"]}>
          <Stack spacing={4} mb={0} textAlign="center" alignContent="center" justifyContent="center">
            <Text fontFamily="head" fontSize="4xl" textAlign="left" textColor="#fff" fontWeight="500">Allocate new Task</Text>
            <FormControl id="heading" isRequired>
              <FormLabel fontFamily="subhead" textColor="#fff">Heading</FormLabel>
              <Input
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                w="100%"
                bg="#21364a"
                borderColor="transparent"
                textColor="#fff"
                focusBorderColor="transparent"
              />
            </FormControl>
            <FormControl id="description" isRequired>
              <FormLabel fontFamily="subhead" textColor="#fff">Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                w="100%"
                resize="vertical"
                bg="#21364a"
                textColor="#fff"
                borderColor="transparent"
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel fontFamily="subhead" textColor="#fff">Assignee Email</FormLabel>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                w="100%"
                bg="#21364a"
                textColor="#fff"
                borderColor="transparent"
              />
            </FormControl>
            <FormControl id="attachments">
              <FormLabel fontFamily="subhead" textColor="#fff">Attachments</FormLabel>
              <Input
                value={attachments}
                onChange={(e) => setAttachments(e.target.value.split(","))}
                w="100%"
                bg="#21364a"
                textColor="#fff"
                borderColor="transparent"
              />
            </FormControl>
            <Button 
              colorScheme="blue" 
              size="md" 
              width="100%, 100%, 47%, 50%" // Wider button on mobile, controlled on larger screens
              alignSelf="flex-end"
              mb={8}  
              onClick={allocateTask}
              whiteSpace="normal"
              wordBreak="break-word"
              bg="#05549e"
            >
              Allocate Task
            </Button>
          </Stack>
        </Box>

        {/* Right Side - Status Panels */}
        <Box w={["100%", "100%", "55%", "60%"]} ml={[0, 0, 0, 0]}>
          <Flex direction="column" whiteSpace="normal" wordBreak="break-word" gap={6}>
            <Text fontFamily="head" fontSize="4xl" textAlign="left" textColor="#fff" fontWeight="500">Task Status</Text>
            <Tabs variant="soft-rounded" colorScheme="blue"  mt={4}>
              <TabList>
                <Tab fontFamily="subhead" textColor="#fff">To Do</Tab>
                <Tab fontFamily="subhead" textColor="#fff">In Progress</Tab>
                <Tab fontFamily="subhead" textColor="#fff">Done</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <StatusPanel
                    title="To Do"
                    tasks={tasks.filter((task) => task.status === "to-do")}
                    fetchTasks={fetchTasks}
                    config={config}
                    onTaskClick={handleTaskClick}
                  />
                </TabPanel>
                <TabPanel>
                  <StatusPanel
                    title="In Progress"
                    tasks={tasks.filter((task) => task.status === "in-progress")}
                    fetchTasks={fetchTasks}
                    config={config}
                    onTaskClick={handleTaskClick}
                  />
                </TabPanel>
                <TabPanel>
                  <StatusPanel
                    title="Done"
                    tasks={tasks.filter((task) => task.status === "done")}
                    fetchTasks={fetchTasks}
                    config={config}
                    onTaskClick={handleTaskClick}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
            {/* Allocated Tasks Section */}
            <Box my={8}>
              <AllocatedTasks />
            </Box>
          </Flex>
        </Box>
      </Flex>

      
    </Box>
  );
};

export default TaskAllocator;
