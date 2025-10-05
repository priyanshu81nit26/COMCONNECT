
import { Image } from "@chakra-ui/react";

const Semi = ({ bottom, left, right,filter,width,height}) => (
    <Image
      src='/images/semi.png'
      alt="Wave"
      position="absolute"
      bottom={bottom}
      left={left}
      right={right}
      zIndex={1}
      w={width}
      h={height}
      filter={filter}
      bg="transparent" 
    />
  );
  
  export default Semi;