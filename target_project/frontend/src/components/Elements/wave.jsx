
import { Image } from "@chakra-ui/react";

const Wave = ({ top, left, right,filter,width,height}) => (
    <Image
      src='/images/wave.png'
      alt="Wave"
      position="absolute"
      top={top}
      left={left}
      right={right}
      zIndex={0}
      w={width}
      h={height}
      filter={filter} 
      bg="transparent" 
    />
  );
  
  export default Wave;