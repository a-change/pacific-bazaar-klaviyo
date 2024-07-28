/*
 * Copyright 2023 Bloomreach (http://www.bloomreach.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
      sx={{
        ...{
          width: 'calc(100vw - 10px)',
          marginLeft: '-50vw',
          left: '50%',
          position: 'relative',
        },
        ...imageSx,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default FlexFullScreen;
