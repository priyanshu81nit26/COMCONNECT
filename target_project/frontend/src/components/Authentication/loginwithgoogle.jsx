import React from 'react'; 
import { Button,Image,Text} from "@chakra-ui/react"; 


const GoogleLoginButton = () => {
  return (
    <Button 
    colorScheme="gray" 
    borderColor="#FBB03B"
    variant="outline" 
    width="full" 
    mt={0} 
    display="flex" 
    alignItems="center" 
  >
    <Image 
      src="./images/google.png" 
      alt="Google logo" 
      boxSize="20px" 
      mr={3} 
    />
    <Text fontSize="sm" color="#FBB03B">
      Login with Google
    </Text>
  </Button>
  );
};

export default GoogleLoginButton;