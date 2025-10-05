import { Button } from "@chakra-ui/button";
import { Link as RouterLink } from "react-router-dom";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import axios from "axios";
import { useToast, Divider, Box, Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import Text_Box from "../Elements/text_box";
import RememberMe from "./remember";
import GoogleLoginButton from "./loginwithgoogle";
import Signup from "./Signup"
import { API_URL } from "../../config/api.config";

console.log("Current API URL:", API_URL);

const Login = () => {
  const [show, setShow] = useState(false);
  const handleClick = (e) => {
    e.preventDefault();
    setShow(!show);
  };
  const navigate = useNavigate();
  const handelSignup = (e) => {
    e.preventDefault();
    navigate("/signup");
  };
  const toast = useToast();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const { setUser } = ChatState();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!email || !password) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting login with URL:', `${API_URL}/user/login`);

      const { data } = await axios({
        method: 'post',
        url: `${API_URL}/user/login`,
        data: { email, password },
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        withCredentials: false, // Important for CORS
        timeout: 50000
      });

      console.log('Login response:', data);

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/workspace");
    } catch (error) {
      console.error('Login Error Details:', {
        url: `${API_URL}/user/login`,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
        code: error.code
      });

      let errorMessage;
      if (error.code === 'ECONNABORTED') {
        errorMessage = "Connection timeout - Server might be busy, please try again";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = "Network error - Please check your connection";
      } else {
        errorMessage = "Unable to connect to server - Please try again later";
      }

      toast({
        title: "Login Failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    } finally {
      setLoading(false); // Ensure loading is always turned off
    }
  };

  return (
    <VStack spacing="10px">
    {showSignup ? (
      <Signup />
    ) : (
      <>
        <FormControl id="email" isRequired>
          <FormLabel display="inline-flex">
            <Text_Box children="Email" />
          </FormLabel>
          <Input
            value={email}
            type="email"
            placeholder="Enter Your Email Address"
            onChange={(e) => setEmail(e.target.value)}
            bg="white"
            color="black"
            _placeholder={{ color: "gray.500" }}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel display="inline-flex">
            <Text_Box children="Password" />
          </FormLabel>
          <InputGroup size="md">
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={show ? "text" : "password"}
              placeholder="Enter password"
              bg="white"
              color="black"
              _placeholder={{ color: "gray.500" }}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={handleClick}
                border="gray.700"
              >
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          <Text_Box  
          fontSize={["10px"]}
          children="By signing up, you are creating a COMCONNECT account, and you agree to COMCONNECT's Term of Use and Privacy Policy." />
          <RememberMe />
          <Button
            colorScheme="#FBB03B;"
            color="#04539D"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            isLoading={loading}
          >
            Login
          </Button>
          <Flex align="center" my={1} width="100%">
            <Divider
              orientation="horizontal"
              flex="1"
              borderColor="#E2E8F0"
              borderWidth={"1px"}
            />
            <Box as="span" color="#7E8B9E" fontSize="sm" lineHeight="1.2" mx={2}>
              OR
            </Box>
            <Divider orientation="horizontal" flex="1" borderColor="#E2E8F0" />
          </Flex>
          <GoogleLoginButton />
          
        </FormControl>
        {/* <Box  display="flex" alignItems="center" justifyContent="center">
          <Text_Box fontSize="sm" color="gray.600">
            Don't have an account?{" "}
            <Button
              variant="link"
              colorScheme="blue"
              onClick={() => setShowSignup(true)}
            >
              Sign Up here!
            </Button>
          </Text_Box>
        </Box> */}

      
      </>
    )}
  </VStack>
  );
};

export default Login;


