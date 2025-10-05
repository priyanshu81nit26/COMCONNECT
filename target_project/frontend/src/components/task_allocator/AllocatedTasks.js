import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Box, VStack, Text, useToast, Spinner, Center } from "@chakra-ui/react";
import TaskCard from "./TaskCard";
import { ChatState } from "../../Context/ChatProvider";
import { API_URL } from "../../config/api.config";

const AllocatedTasks = () => {
  const { user } = ChatState();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
      "Content-Type": "application/json"
    },
    timeout: 5000
  };

  const fetchAllocatedTasks = useCallback(async () => {
    if (!user?.token) return;

    try {
      setLoading(true);
      console.log('Fetching allocated tasks from:', `${API_URL}/tasks/allocated-tasks`);

      const { data } = await axios.get(
        `${API_URL}/tasks/allocated-tasks`,
        config
      );

      console.log('Allocated tasks response:', data);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching allocated tasks:', {
        url: `${API_URL}/tasks/allocated-tasks`,
        error: error.message,
        response: error.response?.data
      });

      toast({
        title: "Error fetching allocated tasks",
        description: error.response?.data?.message || "Failed to load tasks",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right"
      });
    } finally {
      setLoading(false);
    }
  }, [user?.token, toast]);

  useEffect(() => {
    fetchAllocatedTasks();
  }, [fetchAllocatedTasks]);

  if (loading) {
    return (
      <Center h="200px">
        <Spinner 
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
    );
  }

  return (
    <Box p={5}>
      <Text fontSize="4xl" mb={4} fontWeight="500" fontFamily="head" textColor="#fff">
        Tasks I've Allocated
      </Text>
      {tasks.length === 0 ? (
        <Text color="gray.500" textAlign="center">
          No tasks allocated yet
        </Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              fetchTasks={fetchAllocatedTasks}
              config={config}
            />
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default AllocatedTasks; 