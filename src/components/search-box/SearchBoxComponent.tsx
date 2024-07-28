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
import React, {Fragment, useContext, useRef, useState} from 'react';
//next
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
//mui
import {Box, Drawer, Popover, styled, TextField, Tooltip} from '@mui/material';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//contexts
import {UserContext} from '@/contexts/UserContext';
//other libs
import FlexBox from '@/components/common/flex-box/FlexBox';
import {AutoSuggestionComponent} from '@/components/auto-suggestion/AutoSuggestionComponent';
//types
import {QUERY_PARAM_QUERY} from '@/utils/SearchUtil';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import {FlexBetween} from '@/components/common/flex-box';
import {Paragraph} from '@/components/common/bazaar/Typography';
import {Clear, ImageSearchOutlined, SearchOutlined} from '@mui/icons-material';
import Search from '@/components/common/icons/Search';
import {pushGtmEventSearch} from '@/components/gtm/GTMComponentUtils';
import MiniVisualSearch from '../visual-search/MiniVisualSearch';

export interface PopoverState {
  showAutosuggestion: boolean;
  input: string;
}

export const SearchOutlinedIcon = styled(SearchOutlined)(({theme}) => ({
  color: theme.palette.grey[600],
}));

export const ImageSearchOutlinedIcon = styled(ImageSearchOutlined)(({theme}) => ({
  color: theme.palette.grey[600],
  marginRight: 6,
  cursor: 'pointer',
}));

export const Pipe = styled('div')(({theme}) => ({
  width: 2,
  height: 30,
  backgroundColor: theme.palette.grey[300],
  marginRight: 3,
  marginLeft: 3,
}));

export const SearchBoxComponent = (props: BrProps) => {
  const {page, component} = props;
  const {recentSearchesState: {setRecentSearches}} = useContext(UserContext);

  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const toggleSidenav = () => setSidenavOpen(!sidenavOpen);
  const channelParams = page?.getChannelParameters() ?? {};
  const {discoveryDomainKey} = page?.getChannelParameters() ?? {};

  const {t} = useTranslation('search');
  const router = useRouter();
  const keywordInput = useRef<HTMLInputElement>(null);

  const [popoverState, setPopoverState] = useState<PopoverState>({
    showAutosuggestion: false,
    input: '',
  });

  const [searchBarOpen, setSearchBarOpen] = useState(false);

  const toggleSearchBar = () => setSearchBarOpen(!searchBarOpen);

  const handleClose = () => {
    setPopoverState({
      showAutosuggestion: false,
      input,
    });
  };

  const getSearchUrl = (keyword: string) => {
    const baseUrl = '/search';
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.set(QUERY_PARAM_QUERY, keyword);
    return page.getUrl(`${baseUrl}?${urlSearchParams}`);
  };

  const handleSearchInputEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    if (event.key === 'Enter' || event.key === 'NumpadEnter') {
      //globalSearchParams.segment = getCurrentSegment();
      setRecentSearches(target.value);
      pushGtmEventSearch(target.value, discoveryDomainKey);
      (event.target as HTMLElement).blur();
      router.push(getSearchUrl(target.value));
    } else {
      //event.persist();
      const input = target.value;
      setTimeout(() => {
        if (input === keywordInput.current?.value) {
          if (input === '') {
            setPopoverState({
              showAutosuggestion: false,
              input,
            });
          } else {
            if (popoverState.input !== input) {
              setPopoverState({
                showAutosuggestion: true,
                input,
              });
              target.focus();
            }
          }
        }
      }, 100);
    }
  };

  const handleSearchInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.persist();
    const input = event.target.value;
    if (input === keywordInput.current?.value) {
      if (input === '') {
        popoverState.showAutosuggestion &&
        setPopoverState({
          showAutosuggestion: false,
          input,
        });
      } else {
        setPopoverState({
          showAutosuggestion: true,
          input,
        });
      }
    }
  };

  const {showAutosuggestion, input} = popoverState;

  const handleSearchButtonClick = () => {
    setRecentSearches(keywordInput.current?.value);
    pushGtmEventSearch(keywordInput.current?.value, discoveryDomainKey);
    router.push(getSearchUrl(keywordInput.current?.value!));
  };

  const id = showAutosuggestion ? 'auto-suggest-popover' : undefined;

  const drawerComponent = (
    <Drawer open={sidenavOpen} anchor='right' onClose={toggleSidenav} sx={{zIndex: 9999}}>
      <MiniVisualSearch toggleSidenav={toggleSidenav} page={page!} />
    </Drawer>
  );

  if (downMd) {
    return (
      <Fragment>
        <Box p={1.25} mr={2} bgcolor='grey.200' component={IconButton} onClick={toggleSearchBar}>
          <Search />
          {/* SEARCH FORM DRAWER */}
        </Box>
        <Drawer open={searchBarOpen} anchor='top' onClose={toggleSearchBar} sx={{zIndex: 9999}}>
          <Box sx={{width: 'auto', padding: 2, height: '100vh'}}>
            <FlexBetween mb={1}>
              <Paragraph>Search Pacific</Paragraph>
              <IconButton onClick={toggleSearchBar}>
                <Clear />
              </IconButton>
            </FlexBetween>

            {/* CATEGORY BASED SEARCH FORM */}
            <TextField
              fullWidth
              variant='outlined'
              placeholder={t('search-for')}
              autoComplete='off'
              defaultValue={input}
              inputRef={keywordInput}
              onKeyUp={handleSearchInputEnter}
              onFocus={handleSearchInputFocus}
              InputProps={{
                sx: {
                  'height': 44,
                  'paddingRight': 0,
                  'minWidth': {
                    xs: '25vw',
                    md: '40vw',
                    lg: '25vw',
                  },
                  'color': 'grey.700',
                  'overflow': 'hidden',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                },
                endAdornment: (
                  <SearchOutlinedIcon fontSize='small' onClick={handleSearchButtonClick} />
                ),
              }}
            />
          </Box>
        </Drawer>
      </Fragment>
    );
  }

  const {disableContentSuggestion = false} = page.getChannelParameters();

  const vsComponentNotPresent =
    page
      .getComponent('main', 'container')
      ?.getChildren()
      ?.find((c) => c.getName().includes('visual-search')) === undefined;

  const visualSearchBarEnabled =
    process.env.NEXT_PUBLIC_VISUAL_SEARCH === 'true' &&
    channelParams.visualSearchWidgetID &&
    vsComponentNotPresent;

  return (
    <FlexBox sx={{minWidth: '90%'}}>
      <TextField
        fullWidth
        variant='outlined'
        placeholder={channelParams.searchBoxHint || t('search-for')}
        autoComplete='off'
        onKeyUp={handleSearchInputEnter}
        onFocus={handleSearchInputFocus}
        defaultValue={input}
        inputRef={keywordInput}
        InputProps={{
          sx: {
            'height': 44,
            'paddingRight': 0,
            'minWidth': {
              xs: '25vw',
              md: '40vw',
              lg: '25vw',
            },
            'color': 'grey.700',
            'overflow': 'hidden',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
          },
          endAdornment: (
            <FlexBox justifyContent={'center'} alignItems={'center'}>
              <SearchOutlinedIcon fontSize='small' onClick={handleSearchButtonClick}
                                  sx={{marginRight: visualSearchBarEnabled ? 0 : 1}} />
              {visualSearchBarEnabled && (
                <>
                  <Pipe></Pipe>
                  <Tooltip title='Upload an image'>
                    <ImageSearchOutlinedIcon fontSize='small' onClick={toggleSidenav} />
                  </Tooltip>
                </>
              )}
            </FlexBox>
          ),
        }}
      />
      <FlexBox justifyContent={'center'} alignItems={'center'}></FlexBox>
      <Popover
        id={id}
        open={showAutosuggestion}
        anchorEl={keywordInput.current}
        onClose={handleClose}
        disableAutoFocus={true}
        disableEnforceFocus={true}
        PaperProps={{
          style: {
            width: disableContentSuggestion ? '45vw' : '60vw',
            marginTop: '2px',
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {showAutosuggestion && (
          <AutoSuggestionComponent
            {...{
              input,
              keyword: input,
              offset: 0,
              limit: 3,
              setPopoverState,
            }}
            {...props}
          />
        )}
      </Popover>
      {drawerComponent}
    </FlexBox>
  );
};
