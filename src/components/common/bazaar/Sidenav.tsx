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
import {cloneElement, FC, ReactNode, useEffect, useState} from 'react';
import {Box, Drawer, styled} from '@mui/material';
import clsx from 'clsx';
import Scrollbar from './Scrollbar';

// styled component
const Wrapper = styled(Box)({'& .handle': {cursor: 'pointer'}});

type SidenavProps = {
  open?: boolean;
  width?: number;
  children: ReactNode;
  handle: React.ReactElement;
  toggleSidenav?: () => void;
  position?: 'left' | 'right';
};

const Sidenav: FC<SidenavProps> = (props) => {
  const {
    position,
    open,
    width = 280,
    handle,
    children,
    toggleSidenav,
  } = props;

  const [sidenavOpen, setSidenavOpen] = useState(open);
  const handleToggleSidenav = () => setSidenavOpen(!sidenavOpen);

  useEffect(() => setSidenavOpen(open), [open]);

  return (
    <Wrapper>
      <Drawer
        anchor={position}
        open={sidenavOpen}
        onClose={toggleSidenav || handleToggleSidenav}
        SlideProps={{style: {width}}}
        sx={{zIndex: 15001}}
      >
        <Scrollbar autoHide={false}>{children}</Scrollbar>
      </Drawer>

      {handle &&
        cloneElement(handle, {
          onClick: toggleSidenav || handleToggleSidenav,
          className: clsx(handle.props?.className, 'handle'),
        })}
    </Wrapper>
  );
};

// set default component props
Sidenav.defaultProps = {width: 280, position: 'left', open: false};

export default Sidenav;
