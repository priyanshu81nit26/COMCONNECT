import React from "react";
import {
  Box,
  Text,
  VStack,
  Select,
  FormControl,
  Button,
} from "@chakra-ui/react";
import TaskCard from "./TaskCard";

const StatusPanel = ({ title, tasks, fetchTasks, config, onTaskClick }) => {
  return (
    <Box
      w="100%"
      p={4}
      borderWidth="1px"
      borderRadius="md"
      bg="#21364a"
      border="none"
      boxShadow="md"
    >
      <Text fontSize="2xl" mb={4} textColor="#fff">
        {title}
      </Text>
      <VStack spacing={4} align="start">
        {tasks.length === 0 ? (
          <Text textColor="#fff" fontSize="lg" fontFamily="content">
            No tasks
          </Text>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              fetchTasks={fetchTasks}
              config={config}
              onClick={() => onTaskClick(task)}
            />
          ))
        )}
      </VStack>
    </Box>
  );
};

export default StatusPanel;
