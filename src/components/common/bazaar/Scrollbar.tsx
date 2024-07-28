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
import {FC, ReactNode} from 'react';
import {alpha, styled, SxProps} from '@mui/material';
import SimpleBar from 'simplebar-react';

const StyledScrollBar = styled(SimpleBar)(({theme}) => ({
  maxHeight: '100%',
  '& .simplebar-scrollbar': {
    '&.simplebar-visible:before': {opacity: 1},
    '&:before': {backgroundColor: alpha(theme.palette.grey[400], 0.6)},
  },
  '& .simplebar-track.simplebar-vertical': {width: 9},
  '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': {height: 6},
  '& .simplebar-mask': {zIndex: 'inherit'},
}));

// =============================================================
interface ScrollbarProps extends SimpleBar.Props {
  sx?: SxProps;
  children: ReactNode;
}

// =============================================================

const Scrollbar: FC<ScrollbarProps> = ({children, sx, ...props}) => {
  return (
    <StyledScrollBar sx={sx} {...props}>
      {children}
    </StyledScrollBar>
  );
};

export default Scrollbar;
