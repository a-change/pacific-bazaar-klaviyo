import { Box, BoxProps } from '@mui/material';

const JustifiedFlexBox: React.FC<BoxProps> = ({ children, ...props }) => (
  <Box
    display='flex'
    justifyContent='space-between'
    alignItems='center'
    width='100%'
    {...props}
  >
    {children}
  </Box>
);

export default JustifiedFlexBox;
