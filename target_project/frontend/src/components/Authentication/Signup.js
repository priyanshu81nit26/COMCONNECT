import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api.config";
import { Box, Flex, Stack, Text, Image } from "@chakra-ui/react";
import signupimg from "../../assets/signup.png";

const Signup = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);

  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000
        ,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(name, email, password, pic);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${API_URL}/user`,
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      navigate("/workspace");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "piyushproj");
      fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

  return (
    <Flex 
      minHeight="100vh"
      width="100%"
      align="center"
      justify="center"
      bg="#0f1924"
    >
      <Box
        bg="#1b3046ff"
        width={["90%", "90%","90%","70%"]}
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        
      >
        <Text
          textAlign="center"
          fontSize="4xl"
          fontWeight="600"
          fontFamily="head"
          textColor="#fff"
        >Create Your Account</Text>
        <Stack
          direction={["column", "column", "row"]} 
          spacing={8} 
          align="center" 
          justify="center"
        >
          <Box
            width={["100%", "100%", "60%"]}
          >
            <VStack spacing="5px" >
              <FormControl id="first-name" isRequired>
                <FormLabel mb={0} mt={3} fontFamily="subhead" textColor="lgrey">Name</FormLabel>
                <Input
                  fontFamily="content"
                  bg="#21364a"
                  border="none"
                  placeholder="Enter Your Name"
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <FormControl id="email" isRequired>
                <FormLabel mb={0} mt={3} fontFamily="subhead" textColor="lgrey">Email Address</FormLabel>
                <Input
                  fontFamily="content"
                  type="email"
                  bg="#21364a"
                  border="none"
                  placeholder="Enter Your Email Address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel mb={0} mt={3} fontFamily="subhead" textColor="lgrey">Password</FormLabel>
                <InputGroup size="md">
                  <Input
                    fontFamily="content"
                    bg="#21364a"
                    border="none"
                    type={show ? "text" : "password"}
                    placeholder="Enter Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel mb={0} mt={3} fontFamily="subhead" textColor="lgrey">Confirm Password</FormLabel>
                <InputGroup size="md">
                  <Input
                    fontFamily="content"
                    bg="#21364a"
                    border="none"
                    type={show ? "text" : "password"}
                    placeholder="Confirm password"
                    onChange={(e) => setConfirmpassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl id="pic">
                <FormLabel mb={0} mt={3} fontFamily="subhead" textColor="lgrey">Upload your Picture</FormLabel>
                <Box position="relative" width="100%">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => postDetails(e.target.files[0])}
                    position="absolute"
                    left={0}
                    top={0}
                    width="100%"
                    height="100%"
                    opacity={0}
                    zIndex={2}
                    cursor="pointer"
                  />
                  <Button
                    as="span"
                    bg="#05549e"
                    color="white"
                    width="100%"
                    fontFamily="subhead"
                    _hover={{ bg: "#0c77dbff" }}
                    zIndex={1}
                  >
                    Choose Profile Photo
                  </Button>
                </Box>
              </FormControl>
              
            </VStack>
          </Box>
          <Box
            width={["100%", "100%", "60%"]}
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={[8, 8, 0]}
          >
            <Image
              src={signupimg}
              alt="Description"
              boxSize={["270px", "300px", "350px"]}
              objectFit="cover"
              borderRadius="lg"  
            />
          </Box>
          
         
          
        </Stack>
        <Button
          bg="#05549e"
          width="80%"
          alignItems="center"
          justifyContent="center"
          rounded={50}
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={picLoading}
          textColor="white"
          fontFamily="subhead"
          _hover={{ bg: "#025fb6ff" }}
          mx="auto"
          display="block"
        >
          Sign Up
        </Button>
      </Box>
      
    </Flex>
    
  );
};

export default Signup;
