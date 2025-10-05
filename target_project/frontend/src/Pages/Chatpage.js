import SplitPane from "react-split-pane";
import { Box, useBreakpointValue, Drawer, DrawerOverlay, DrawerContent, DrawerBody, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";

import "./chat.css";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  // Responsive mode: "mobile", "medium", "large"
  const mode = useBreakpointValue({
    base: "mobile",
    md: "medium",
    lg: "large",
  });

  return (
    <div className="chats-sec" style={{ width: "100%", height: "100vh" }}>
      {/* {user && <SideDrawer />} */}

      {(mode === "mobile" || mode === "medium") && (
        <>
          <IconButton
            icon={<FiMenu />}
            aria-label="Open My Chats"
            position="fixed"
            top={4}
            left={4}
            zIndex={2000}
            onClick={() => setDrawerOpen(true)}
            colorScheme="blue"
          />
          <Drawer isOpen={isDrawerOpen} placement="left" onClose={() => setDrawerOpen(false)}>
            <DrawerOverlay />
            <DrawerContent bg="#0f1924" maxWidth={"60vw"} width="60vw" >
              <DrawerBody>
                {user && <MyChats fetchAgain={fetchAgain} />}
              </DrawerBody>
            </DrawerContent>
          </Drawer>
          <Box className="chatting" w="100%" h="100vh">
            {user && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
          </Box>
        </>
      )}

      {mode === "large" && (
        <SplitPane
          split="vertical"
          minSize={200}
          defaultSize={550}
          style={{ height: "100vh" }}
        >
          <div className="sidebar" style={{ background: "#0f1924", height: "100%", overflowX: "hidden" }}>
            {user && <MyChats fetchAgain={fetchAgain} />}
          </div>
          <div className="chatting">
            {user && (
              <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            )}
          </div>
        </SplitPane>
      )}
    </div>
  );
};

export default Chatpage;
