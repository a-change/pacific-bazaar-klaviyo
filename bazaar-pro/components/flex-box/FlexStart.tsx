import { Box, BoxProps } from "@mui/material";

const FlexStart: React.FC<BoxProps> = ({ children, ...props }) => (
  <Box
    display="flex"
    justifyContent="flex-start"
    alignItems="flex-start"
    {...props}
  >
    {children}
  </Box>
);

export default FlexStart;
