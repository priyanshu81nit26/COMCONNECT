import {
  Box,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react"; // Import useState
import { useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup"; // Import Signup component
import "./home.css"
import BackgroundComponent from "../components/Elements/background";
import Text_Box from "../components/Elements/text_box";

function Homepage() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false); // State to track if it's signup

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) navigate("/workspace");
  }, [navigate]);

  return (
    <BackgroundComponent>
      <Box
        d="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
    
      >
        <Box  width="100%" className="container">
          <Box className="left-box" flex="1" display="flex" flexDirection="column" bottom="0px">
            <Box position="relative" mb="0px">
              {/* Conditionally render text only when it's not signup */}
              {!isSignup && (
                <>
                  <Text
                    fontFamily="Inter"
                    fontWeight="700"
                    lineHeight={{ base: "40px", md: "55px", lg: "66.65px" }}
                    fontSize={{ base: "24px", md: "34px", lg: "44.43px" }}
                    textAlign="left"
                    color="#FAFAFC"
                    mb={{ base: "4px", md: "6px", lg: "8px" }}
                    mt={"0px"}
                  >
                    Hey, <br />
                    Welcome Back!
                  </Text>
                  <Box position="relative" mt="0px">
                    <Text_Box children="We are very happy to see you again!" />
                  </Box>
                </>
              )}
            </Box>

            <Tabs isFitted variant="soft-rounded">
              <TabPanels>
                <TabPanel>
                  {isSignup ? <Signup /> : <Login />} 
                </TabPanel>
              </TabPanels>
            </Tabs>

      
            <Box mt={3} display="flex" justifyContent="center">
              <Text_Box>
                {isSignup
                  ? "Already have an account? "
                  : "Don’t have an account? "}
                <Box
                  as="button"
                  color="#FBB03B"
                  onClick={() => setIsSignup(!isSignup)} // Toggle the state
                >
                  {isSignup ? "Login" : "Sign Up"} {/* Text changes based on the state */}
                </Box>
              </Text_Box>
            </Box>
          </Box>

          <Box className="right-box">
            <img src="images/Frame.png" alt="Decorative" padding="auto" />
          </Box>
        </Box>
      </Box>
    </BackgroundComponent>
  );
}

export default Homepage;

