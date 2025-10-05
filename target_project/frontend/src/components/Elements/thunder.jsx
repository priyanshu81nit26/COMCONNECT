
import { Image } from "@chakra-ui/react";

const Thunder = ({ top, left, right,filter,width,height}) => (
    <Image
      src='/images/thunder.png'
      alt="Wave"
      position="absolute"
      top={top}
      left={left}
      right={right}
      zIndex={1}
      w={width}
      h={height}
      filter={filter}
      bg="transparent" 
    />
  );
  
  export default Thunder;