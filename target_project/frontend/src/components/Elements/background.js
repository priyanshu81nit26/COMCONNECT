import { Box, Text, Flex, Grid, Container } from "@chakra-ui/react";
import Wave from "./wave";
import Spring from "./spring";
import Thunder from "./thunder";
import Semi from "./semi"
const BackgroundComponent = ({ children, ...props }) => {
  return (
    <Box
      position="relative"
      bg="#04539D"
      bgSize="cover"
      //   bgPosition="center"
      height="100vh"
      width="100%"
      // overflow="hidden"
      {...props}
    >
      <Wave
         top={{
          base: "5vh",  
          sm: "4vh",    
          md: "3.5vh",   
          lg: "3.3vh", 
        }}
        left={{
          base: "5vw",             
          sm: "4vw",
          md: "3.75vw",  
          lg: "3.5vw",   
        }}
        height={{
          base: "6vh",            
           sm: "5vh",   
           md: "4.75vh",  
          lg: "4.75vh", 
        }}
        width={{
          base: "10vw", 
          sm: "9vw",   
          md: "8.5vw",  
          lg: "8.25vw",
        }}
        filter="drop-shadow(0px 2.85px 10.67px rgba(0, 0, 0, 0.5))"
      />
      <Wave top="9.2vh" left="6.5vw" height="4.75vh" width="8.25vw" />

      <Spring
        top="55.4vh"
        left="95vw"
        height="25.03vh"
        width="9.54vw"
        // filter="drop-shadow(0px 2.85px 10.67px rgba(0, 0, 0, 0.5))"
      />
      <Semi
        bottom="0vh"
        left="1vh"
        height="9vh"
        width="8.25vw"
        filter="drop-shadow(0px 2.85px 10.67px rgba(0, 0, 0, 0.5))"
      />




      <Flex
        direction="column"
        height="100vh"
        alignItems="center"
        px={4}
       
      >
        <Box>
          <Flex
            position={"absolute"}
            top="0"
            left="0"
            right="0"
            margin="0 auto"
            justifyContent="center"
            alignItems="center"
          >
            <Text
              fontFamily="Arial"
              fontSize={["5vh","8vh","12vh","14vh","14vh"]}
              fontWeight="900"
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
              fontSize={["5vh","8vh","12vh","14vh","14vh"]}
              fontWeight="900"
              textAlign="left"
              color="transparent"
              sx={{
                WebkitTextStroke: "2.47px rgba(203, 220, 243, 1)",
                WebkitTextFillColor: "transparent",
              }}
              zIndex={2}
            >
              CONNECT
            </Text>
            <Thunder top="17.95vh" height="10.03vh" width="9.54vw" zIndex={1} />
          </Flex>
        </Box>

        <Box
          borderRadius="10px"
          width={["95%","90%","85%","75%"]}
          position="relative" 
          top={["5vh","8vh","10vh","14.5vh"]}
          zIndex={3}
          className="translucent-box"
        >
          {children}
        </Box>
      </Flex>
    </Box>
  );
};

export default BackgroundComponent;
