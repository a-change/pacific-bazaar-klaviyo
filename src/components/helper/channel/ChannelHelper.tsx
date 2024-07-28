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
import React from 'react';
import {useTranslation} from 'next-i18next';
//next
import {useRouter} from 'next/router';
//mui
import {Avatar, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
import {Channel, useChannels} from '@/hooks/useChannels';
import {channelsUrl} from '@/utils/ChannelUtils';

export const ChannelHelper = (props: BrProps) => {
  const {page} = props;
  const locale = page?.getLocale() ?? 'en_US';
  const router = useRouter();
  const {t} = useTranslation('common');

  const [results, loading] = useChannels(channelsUrl());

  const currentChannel = router.query.channelId;
  const updateChannel = (newChannel: string) => {
    if (currentChannel !== newChannel) {
      router.push(`/${newChannel}`).then(() => router.reload());
    }
  };

  return (
    <Box sx={{width: '100%'}}>
      <nav aria-label='main mailbox folders'>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => router.push(`/?selector=true`).then(() => router.reload())}>
              <ListItemIcon>
                <PlaylistAddCheckIcon />
              </ListItemIcon>
              <ListItemText primary={t('channel-selector')} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Avatar variant='square' sx={{
                  bgcolor: 'error.main',
                  width: 24,
                  height: 24,
                  fontSize: 'small',
                }}>{locale.substring(0, 2)}</Avatar>
              </ListItemIcon>
              <ListItemText primary={currentChannel} />
            </ListItemButton>
          </ListItem>
          {!loading && results?.filter(channel => channel.name !== currentChannel)?.map((channel: Channel, key: number) => {
            return (
              <ListItem disablePadding key={key}>
                <ListItemButton onClick={() => updateChannel(channel.name)}>
                  <ListItemIcon>
                    <ViewQuiltIcon />
                  </ListItemIcon>
                  <ListItemText primary={channel.name} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </nav>
    </Box>
  );
};