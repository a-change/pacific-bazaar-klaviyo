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
import React, {Fragment, useState} from 'react';
//mui
import {Avatar, IconButton, Menu, MenuItem, Tooltip} from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import AppsIcon from '@mui/icons-material/Apps';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import ImageIcon from '@mui/icons-material/Image';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';

export interface SortViewSwitcherProps {
  view: string;
  toggleView: Function;
  queryType?: string;
}

export const SorterViewSwitcher = (props: SortViewSwitcherProps) => {
  const {view, toggleView, queryType} = props;

  const views = queryType === 'content' || queryType === 'groupBy' ?
    [
      {
        id: 'grid',
        label: 'Grid',
        icon: <AppsIcon
          color={'inherit'}
          fontSize='small'
        />,
      },
      {
        id: 'list',
        label: 'List',
        icon: <ViewListIcon
          color={'inherit'}
          fontSize='small'
        />,
      },
    ]
    :
    [
      {
        id: 'grid',
        label: 'Grid',
        icon: <AppsIcon
          color={'inherit'}
          fontSize='small'
        />,
      },
      {
        id: 'list',
        label: 'List',
        icon: <ViewListIcon
          color={'inherit'}
          fontSize='small'
        />,
      },
      {
        id: 'image-list',
        label: 'Image List',
        icon: <ImageIcon
          color={'inherit'}
          fontSize='small'
        />,
      },
      {
        id: 'carousel',
        label: 'Carousel',
        icon: <ViewCarouselIcon
          color={'inherit'}
          fontSize='small'
        />,
      },
      {
        id: 'marquee',
        label: 'Marquee',
        icon: <AutoAwesomeMotionIcon
          color={'inherit'}
          fontSize='small'
        />,
      },
    ];

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewSelect = (viewId: string) => {
    toggleView(viewId);
    setAnchorEl(null);
  };

  const selectedViewId = view === 'default' ? 'grid' : view;

  return (
    <Fragment>
      <Tooltip title='Switch view'>
        <IconButton
          onClick={handleClick}
          size='small'
          aria-controls={open ? 'view-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
        >
          {views.find(item => item.id === selectedViewId)?.icon}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id='view-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
      >
        {views.filter(item => item.id !== selectedViewId).map((view, key) => {
          const {id, icon, label} = view;
          return (
            <MenuItem onClick={() => handleViewSelect(id)} key={key}>
              <Avatar>
                {icon}
              </Avatar> {label}
            </MenuItem>
          );
        })}
      </Menu>
    </Fragment>
  );
};