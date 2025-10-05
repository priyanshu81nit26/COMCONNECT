import { Text } from "@chakra-ui/react";

const Text_Box = ({ children}) => (
    <Text
    fontFamily="Inter"
    fontWeight="500"
    lineHeight={{ base: "18px", md: "20px", lg: "22.22px" }}  // Responsive line height
    fontSize={{ base: "12px", md: "13px", lg: "14.81px" }}     // Responsive font size
    letterSpacing="0.01em"
    textAlign="left"
    color="#FAFAFC"
   
  >
    {children}
  </Text>
  );
  
  export default Text_Box;