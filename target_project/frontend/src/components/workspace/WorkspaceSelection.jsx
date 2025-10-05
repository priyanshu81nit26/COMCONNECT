import React from "react";
import { Box, Button, Flex, Text, Image } from "@chakra-ui/react";
import { useWorkspace } from "../../Context/WorkspaceProvider";
import { useNavigate } from "react-router-dom";
import CreateWorkspaceModal from "./CreateWorkspaceModal"; // Add this import

import "./workspace.css";
import JoinWorkspaceModal from "./JoinWorkspaceModal";

const WorkspaceSelection = () => {
  const { userWorkspaces, setUserWorkspaces } = useWorkspace();
  console.log("workspaces", userWorkspaces);
  const navigate = useNavigate();

  const handleSelectWorkspace = (workspace) => {
    setUserWorkspaces(workspace);
    let workspaceId = workspace._id;
    console.log("worksapce_id", workspace._id);
    navigate(`/workspace/${workspaceId}/chats`);
  };

  return (
    <div className="workspace_main">
     
        <div>
          <Box 
          width={"90vw"}>

          <Flex
              position={"relative"}
              top="0"
              left="0"
              right="0"
              margin="0 auto"
              direction={"column"}
              justifyContent="center"
              alignItems="center"
            >
            <Flex
              position={"relative"}
              top="0"
              left="0"
              right="0"
              margin="0 auto"
              justifyContent="center"
              alignItems="center"
            >
              <Text
                fontFamily="Arial"
                fontSize={["12vw", "6vw", "120px"]}
                fontWeight="900"
                lineHeight={["9vw", "7vw", "180px"]}
                textAlign="left"
                bg="linear-gradient(0deg, rgba(0, 122, 255, 0.15), rgba(0, 122, 255, 0.15)), linear-gradient(0deg, #CBDCF3, #CBDCF3)"
                bgClip="text"
                color="transparent"
                zIndex={2}
              >
                COM
              </Text>
              <Text
                fontFamily="Arial"
                fontSize={["12vw", "6vw", "120px"]}
                fontWeight="900"
                lineHeight={["9vw", "7vw", "180px"]}
                textAlign="left"
                color="transparent"
                padding="0 8px"
                sx={{
                  WebkitTextStroke: "2.47px rgba(203, 220, 243, 1)",
                  WebkitTextFillColor: "transparent",
                }}
                zIndex={2}
              >
                CONNECT
              </Text>
              
            </Flex>
            <div className="workspace_lol">
          <CreateWorkspaceModal>Create Workspace</CreateWorkspaceModal>
        </div>
        <div className="join_workspace_modal translucent-box">
          <JoinWorkspaceModal>
            <div className="join_workspace_btn">Join Workspace</div>
          </JoinWorkspaceModal>
          <div className="join_workspace_lol">
            {Array.isArray(userWorkspaces) && userWorkspaces.length > 0 ? (
              userWorkspaces.map((workspace) => (
                <Button
                  className="cnt"
                  key={workspace._id}
                  onClick={() => handleSelectWorkspace(workspace)}
                >
                  {workspace.workspaceName}
                </Button>
              ))
            ) : (
              <Box>
                <div className="simple">"No workspaces available"</div>
              </Box>
            )}
          </div>
        </div>
        </Flex>
          
           
          </Box>
        </div>

       
        
      
    </div>

  );
};

export default WorkspaceSelection;
