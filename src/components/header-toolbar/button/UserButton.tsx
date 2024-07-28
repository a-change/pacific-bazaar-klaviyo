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

//react
import {Fragment, useContext, useRef, useState} from 'react';
//next
import Link from 'next/link';
import {useTranslation} from 'next-i18next';
//mui
import {
  Backdrop,
  Badge,
  Button,
  CircularProgress,
  ClickAwayListener,
  Grow,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  styled,
} from '@mui/material';
import {PersonOutline} from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ReplayIcon from '@mui/icons-material/Replay';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//contexts
import {UserContext} from '@/contexts/UserContext';
//hocs
import {LogoutProps, withLogout} from '@/hocs/user/LogoutHoc';
//components
import {FlexBox} from '@/components/common/flex-box';
//functions
import {sessionService} from '@/utils/SessionService';
import {getUrl} from '@/utils/UrlUtils';

interface DialogProps {
  toggleDialog: () => void;
}

//Custom styled components
const UserButtonButton = styled(Button)(({theme}) => ({
  whiteSpace: 'nowrap',
  padding: '.6rem .5rem',
  '& .MuiButton-startIcon': {
    backgroundColor: theme.palette.grey['200'],
    borderRadius: '50%',
  },
}));

function UserButtonBase(props: BrProps & LogoutProps & DialogProps) {
  const {page, logout, loading, toggleDialog} = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const {
    userState: {user, setUser},
    segmentationState: {segmentationStatus, setSegmentationStatus, setSegmentUpdates},
  } = useContext(UserContext)!;
  const {t} = useTranslation('profile');

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    setAnchorEl(null);
    sessionService.saveOrderToSession(null);
    if (!loading) {
      //setCartDetails(null);
      setUser(null);
      window.location.href = page.getUrl('/');
    }
  };

  const renderUserIconButton = () => {
    return <IconButton
      ref={anchorRef}
      onClick={user?.username ? handleClick : toggleDialog}
      sx={{
        backgroundColor: 'grey.200',
      }}
    >
      <PersonOutline id='person-outline' fontSize={'small'} />
    </IconButton>;
  };

  const renderUserIconWithBadge = () => {
    return segmentationStatus > 1 ?
      <Badge badgeContent={'!'} color='error'>
        {renderUserIconButton()}
      </Badge>
      :
      renderUserIconButton();
  };

  const renderUserButton = () => {
    return <UserButtonButton
      ref={anchorRef}
      size={'large'}
      startIcon={<PersonOutline id='person-outline' fontSize={'small'} />}
      onClick={user?.username ? handleClick : toggleDialog}
    >
      {t('hello', {name: user.firstName})}
    </UserButtonButton>;
  };

  return (
    <Fragment>
      {user?.username ? (
        segmentationStatus > 1 ?
          <Badge badgeContent={'!'} color='error'>
            {renderUserButton()}
          </Badge>
          :
          renderUserButton()
      ) : (
        renderUserIconWithBadge()
      )}
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement='bottom'
        transition
        disablePortal
      >
        {({TransitionProps, placement}) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id='composition-menu'
                  aria-labelledby='composition-button'
                >
                  {segmentationStatus > 1 && <MenuItem onClick={() => {
                    setSegmentationStatus(0);
                    setSegmentUpdates([]);
                    setTimeout(() => {
                      window.location.href = page.getUrl('/');
                    }, 500);
                  }}>
                    <ListItemIcon>
                      <ReplayIcon />
                    </ListItemIcon>
                    <ListItemText>{'reload'}</ListItemText>
                  </MenuItem>}
                  <MenuItem onClick={handleClose}>
                    <Link href={getUrl('/profile', page!) ?? ''}>
                      <FlexBox alignItems={'center'}>
                        <ListItemIcon>
                          <AccountCircleIcon />
                        </ListItemIcon>
                        {'profile'}
                      </FlexBox>
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText>{'logout'}</ListItemText>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      <Backdrop sx={{color: '#fff', zIndex: '9999'}} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Fragment>
  );
}

export const UserButton = withLogout(UserButtonBase);
