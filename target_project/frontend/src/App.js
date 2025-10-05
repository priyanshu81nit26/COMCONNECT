import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";
import { ChakraProvider } from "@chakra-ui/react";
import ChatProvider from "./Context/ChatProvider";
import WorkspaceSelection from "./components/workspace/WorkspaceSelection";
import WorkspaceProvider from "./Context/WorkspaceProvider";
import TaskAllocatorPage from "./components/task_allocator/TaskAllocatorPage";
import MyTasks from "./components/task_allocator/MyTasks";
import Signup from "./components/Authentication/Signup";
import Geo from "./components/geolocation/App";
import theme from "./theme";

const App = () => {
  useEffect(() => {
    const requestNotificationPermission = async () => {
      try {
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          console.log('Notification permission:', permission);
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    };

    requestNotificationPermission();
  }, []);

  return (
    <Router>
      <ChakraProvider theme={theme}>
        <ChatProvider>
          <WorkspaceProvider>
            <div className="container">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/geo-location" element={<Geo />} />
                <Route path="/tasks/:workspaceId" element={<TaskAllocatorPage />} /> {/* Updated route */}
                <Route path="/my-tasks" element={<MyTasks />} />
                <Route path="/chats" element={<Chatpage />} />
                <Route path="/workspace" element={<WorkspaceSelection />} />
                <Route path="/workspace/:workspaceId/chats" element={<Chatpage />} />
              </Routes>
            </div>
          </WorkspaceProvider>
        </ChatProvider>
      </ChakraProvider>
    </Router>
  );
};

export default App;
