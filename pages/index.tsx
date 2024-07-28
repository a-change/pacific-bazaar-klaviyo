/*
 * Copyright 2023 Bloomreach (http://www.bloomreach.com)
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//import SEO from '@/components/SEO';
import {PreferenceContext} from '@/contexts/PreferenceContext';
import {Channel, useChannels} from '@/hooks/useChannels';
import {channelsUrl} from '@/utils/ChannelUtils';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  styled,
} from '@mui/material';
import {useRouter} from 'next/router';
import {Fragment, MouseEvent, useContext, useEffect, useState} from 'react';
import Head from 'next/head';

const ChannelPickerBox = styled(Box)({
  borderRadius: '16px',
  borderStyle: 'solid',
  borderWidth: '1px',
  bottom: 0,
  height: 'fit-content',
  left: 0,
  margin: 'auto',
  padding: '16px',
  position: 'absolute',
  right: 0,
  top: 0,
  width: 'fit-content',
});


const HomePage = () => {
  const [results, loading] = useChannels(channelsUrl());
  const {preference, setPreference} = useContext(PreferenceContext)!;
  const [loaded, setLoaded] = useState(false);

  const [selectedChannel, setSelectedChannel] = useState<string | null | undefined>(
    preference?.channel,
  );
  const [rememberAsDefault, setRememberAsDefault] = useState(!!preference?.channel);
  const router = useRouter();
  const {pathname: path, query} = router;

  const showSelector = query['selector'] ?? false;

  if (!showSelector && preference?.channel) {
    router.push(`/${preference?.channel}`);
  }

  const endpoint = query.endpoint as string;
  // console.log('[DEBUG]', endpoint, results, loading);

  useEffect(() => {
    if (endpoint) {
      const segments = endpoint.split('/');
      const channelId = segments[segments.length - 2];
      // Preview: Forward to channel page
      // console.log('[DEBUG]', path);
      if (!path.startsWith(`/${channelId}`)) {
        router.push({
          pathname: `/${channelId}${path.substring(1)}`,
          query,
        });
      }
    } else {
      setLoaded(true);
    }
  }, [endpoint]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return <CircularProgress color='info' sx={{margin: '1rem auto'}} />;
  }

  const handleSelect = (event: SelectChangeEvent<string | null>) => {
    setSelectedChannel(event?.target.value);
  };

  const handleCheckboxClick = () => {
    setRememberAsDefault(!rememberAsDefault);
  };

  const handleButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (selectedChannel) {
      rememberAsDefault && setPreference({channel: selectedChannel});
      window.location.assign(window.location.origin + `/${selectedChannel}`);
    }
  };

  return (
    loaded && results && !endpoint &&
    <Fragment>
      <Head>
        <title>{'Channel Selector'}</title>
      </Head>
      <ChannelPickerBox>
        <Typography variant='h6'>Channel Selector</Typography>
        <FormControl component='form' margin='none' size='small' variant='standard'>
          <InputLabel id='channel-select-label'>channels</InputLabel>
          <Select
            id='channel-select'
            label='Select Channel'
            labelId='channel-select-label'
            onChange={(e) => handleSelect(e)}
            value={selectedChannel}
          >
            <MenuItem value=''>
              <em>channels</em>
            </MenuItem>
            {results?.map((channel: Channel, key: number) => {
              return (
                <MenuItem
                  key={key}
                  disabled={channel.name === selectedChannel}
                  value={channel.name}
                >
                  {channel.name}
                </MenuItem>
              );
            })}
          </Select>
          <FormControlLabel
            control={<Checkbox />}
            label='Remember as default'
            defaultChecked={rememberAsDefault}
            onClick={() => handleCheckboxClick()}
          />
          <Button
            color='primary'
            disabled={!selectedChannel}
            onClick={(e) => handleButtonClick(e)}
            endIcon={<ArrowCircleRightOutlinedIcon />}
            variant='contained'
          >
            CONTINUE TO CHANNEL
          </Button>
        </FormControl>
      </ChannelPickerBox>
    </Fragment>
  );
};

export default HomePage;
