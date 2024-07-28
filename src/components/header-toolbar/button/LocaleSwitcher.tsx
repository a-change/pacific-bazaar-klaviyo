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
import {Fragment, useState} from 'react';
//next
import {useRouter} from 'next/router';
import {usePathname} from 'next/navigation';
//mui
import {Button, Fade, ListItemIcon, ListItemText, Menu, MenuItem, SvgIcon} from '@mui/material';
import {ExpandMore} from '@mui/icons-material';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
import {Document} from '@bloomreach/spa-sdk';
//functions
import {ENDPOINT_PARAMETER} from '@/utils/CommonUtils';

export interface LocalIconProps {
  code: string;
}

export const LocalIcon = ({code}: LocalIconProps) => {
  switch (code.toLowerCase()) {
    case 'de_de':
      return (
        <SvgIcon fontSize='small'>
          <svg xmlns='http://www.w3.org/2000/svg' id='flag-icons-de' viewBox='0 0 640 480'>
            <path fill='#ffce00' d='M0 320h640v160H0z' />
            <path fill='#000' d='M0 0h640v160H0z' />
            <path fill='#d00' d='M0 160h640v160H0z' />
          </svg>
        </SvgIcon>
      );
    case 'en_us':
    default:
      return (
        <SvgIcon fontSize='small'>
          {/* credit: plus icon from https://heroicons.com/ */}
          <svg xmlns='http://www.w3.org/2000/svg' id='flag-icons-us' viewBox='0 0 640 480'>
            <path fill='#bd3d44' d='M0 0h640v480H0' />
            <path stroke='#fff' strokeWidth='37' d='M0 55.3h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640' />
            <path fill='#192f5d' d='M0 0h364.8v258.5H0' />
            <marker id='us-a' markerHeight='30' markerWidth='30'>
              <path fill='#fff' d='m14 0 9 27L0 10h28L5 27z' />
            </marker>
            <path fill='none' markerMid='url(#us-a)'
                  d='m0 0 16 11h61 61 61 61 60L47 37h61 61 60 61L16 63h61 61 61 61 60L47 89h61 61 60 61L16 115h61 61 61 61 60L47 141h61 61 60 61L16 166h61 61 61 61 60L47 192h61 61 60 61L16 218h61 61 61 61 60L0 0' />
          </svg>
        </SvgIcon>
      );
  }
};
export const LocaleSwitcher = (props: BrProps) => {
  const {page} = props;
  const locale = page.getLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const {translations, legacyTranslations} = page.getChannelParameters();

  const switchChannel = (channelId: string, channelLocale: string) => {
    const {translationLink: translationLinks} = page.getDocument<Document>()?.getData();
    const translationLink = translationLinks?.find(link => link?.locale?.toLowerCase() === channelLocale?.toLowerCase());

    const pathSeparator = '/';

    let pathSegments = pathname.split(pathSeparator);
    const beforeChannelId = pathSegments[1];
    pathSegments[1] = channelId;

    let baseUrl;
    if (translationLink?.link) {
      baseUrl = pathSeparator + channelId + translationLink?.link;
    } else {
      baseUrl = legacyTranslations ? pathSeparator + channelId : pathSegments.join(pathSeparator);
    }

    if (page.isPreview()) {
      const urlSearchParams = new URLSearchParams(window.location.search);
      if (urlSearchParams.has(ENDPOINT_PARAMETER)) {
        urlSearchParams.set(ENDPOINT_PARAMETER, urlSearchParams.get(ENDPOINT_PARAMETER).replace(beforeChannelId, pathSegments[1]));
      }

      router.push(`${baseUrl}?${urlSearchParams}`);
    } else {
      router.push(`${baseUrl}${window.location.search}`);
    }

    setTimeout(() => {
      //Need this reload in order for preview control buttons to show up.
      if (page.isPreview()) {
        router.reload();
      }
    }, 1000);
  };

  if (!translations) {
    return null;
  }

  const translationPairs = translations.split(',');

  return (
    <Fragment>
      <Button
        id='locale-button'
        aria-controls={open ? 'locale-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          textTransform: 'uppercase',
        }}
        startIcon={<LocalIcon code={locale} />}
        endIcon={<ExpandMore />}
      >
        {locale.substring(0, 2)}
      </Button>
      <Menu
        id='locale-menu'
        MenuListProps={{
          'aria-labelledby': 'locale-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem disabled={true} dense>
          <ListItemIcon>
            <LocalIcon code={locale} />
          </ListItemIcon>
          <ListItemText>{locale?.substring(0, 2)?.toUpperCase()}</ListItemText>
        </MenuItem>
        {translationPairs.map((translation, key) => {
          const values = translation.split(':');
          const channelId = values?.[0];
          const channelLocale = values?.[1];
          return (
            <MenuItem dense key={key} onClick={() => switchChannel(channelId, channelLocale)}>
              <ListItemIcon>
                <LocalIcon code={channelLocale} />
              </ListItemIcon>
              <ListItemText>{channelLocale?.substring(0, 2)?.toUpperCase()}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </Fragment>
  );
};

