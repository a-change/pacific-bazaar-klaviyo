import {Box, BoxProps} from '@mui/material';

export interface FlexFullScreenProps {
  image?: string;
}
const FlexFullScreen: React.FC<BoxProps & FlexFullScreenProps> = ({children, ...props}) => {
  const {sx, image} = props;
  const imageSx = image ? {
    backgroundPosition: '50%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundImage: `url('${image}')`,
  } : {};
  return (
    <Box
      display='flex'
      {...props}
      sx={{...{
          width: 'calc(100vw - 10px)',
          marginLeft: '-50vw',
          left: '50%',
          position: 'relative',
        },
        ...imageSx,
        ...sx}}
    >
      {children}
    </Box>
  );
}

export default FlexFullScreen;
