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
import {FC} from 'react';
import {styled, Switch, SwitchProps} from '@mui/material';

// styled component
const StyledSwitch = styled(Switch)(({theme}) => ({
  padding: 8,
  '& .MuiSwitch-switchBase.MuiButtonBase-root': {
    backgroundColor: 'transparent',
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    borderRadius: 22 / 2,
    backgroundColor: theme.palette.grey[400],
    '&:before, &:after': {
      width: 16,
      height: 16,
      top: '50%',
      content: '""',
      position: 'absolute',
      transform: 'translateY(-50%)',
    },
  },
  '& .MuiSwitch-thumb': {
    width: 16,
    height: 16,
    margin: '2px',
    boxShadow: 'none',
    backgroundColor: theme.palette.grey[600],
  },
  '& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb': {
    backgroundColor: theme.palette.info.main,
  },
}));

const BazaarSwitch: FC<SwitchProps> = (props) => <StyledSwitch {...props} />;

export default BazaarSwitch;
