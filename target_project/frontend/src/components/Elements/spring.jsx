
import { Image } from "@chakra-ui/react";

const Spring = ({ top, left, right,filter,width,height}) => (
    <Image
      src='/images/spring_f.png'
      alt="Wave"
      position="absolute"
      top={top}
      left={left}
      right={right}
      zIndex={1}
      w={width}
      h={height}
      filter={filter}
      bg='transparent'
    />
  );
  
  export default Spring;