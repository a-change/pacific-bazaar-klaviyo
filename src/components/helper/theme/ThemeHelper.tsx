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
//next
import {useTranslation} from 'next-i18next';
//mui
import {styled} from '@mui/material/styles';
import {Badge, Button, FormControl, FormControlLabel, FormGroup, FormLabel, Stack, Switch} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
//bloomreach sdks
import {BrProps} from '@bloomreach/react-sdk';
//hooks
import useSettings from '@/hooks/useSettings';
//components
import {SmallAvatar} from '@/components/product/templates/ProductSelectedAttribute';
//types
import {THEMES, themesOptions} from '@/theme/themeOptions';

const ControlsWrapper = styled(Stack)({
  justifyContent: 'flex-start',
  alignItems: 'center',
  width: 'fit-content',
  padding: '1rem',
});

const ThemeHelperFormLabel = styled(FormLabel)(({theme}) => ({
  width: '5rem',
  fontWeight: 'bold',
  textTransform: 'uppercase',
}));

//Custom styled components
const ThemeHelperButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'code',
})<{code?: string}>(({theme, code}) => ({
  color: theme.palette.getContrastText(code),
  backgroundColor: code,
}));

export const ThemeHelper = (props: BrProps) => {
  const {t} = useTranslation('common');

  const {settings, toggleDirection, toggleMode, switchTheme} = useSettings();
  const {selectedTheme} = settings;

  return (
    <FormControl component='fieldset' variant='standard'>
      <ControlsWrapper direction={'row'} spacing={2}>
        <ThemeHelperFormLabel>{t('theme')}</ThemeHelperFormLabel>
        <FormGroup>
          <Stack direction='row' useFlexGap flexWrap='wrap' spacing={1}>
            {Object.keys(themesOptions).filter(item => item !== THEMES.DEFAULT).map((item) => {
              return item === selectedTheme ?
                <Badge
                  overlap='circular'
                  anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                  badgeContent={
                    <SmallAvatar>
                      <CheckCircleIcon color={'success'} />
                    </SmallAvatar>
                  }
                  key={item}
                >
                  <ThemeHelperButton size={'small'} variant={'contained'} color={'primary'}
                                     code={themesOptions[item].palette.primary.main}
                                     onClick={() => switchTheme(item)}>
                    {item}
                  </ThemeHelperButton>
                </Badge>
                :
                <ThemeHelperButton size={'small'} variant={'contained'} color={'primary'} key={item}
                                   code={themesOptions[item].palette.primary.main}
                                   onClick={() => switchTheme(item)}>
                  {item}
                </ThemeHelperButton>;
            })}
          </Stack>
        </FormGroup>
      </ControlsWrapper>
      <ControlsWrapper direction={'row'} spacing={2}>
        <ThemeHelperFormLabel>{t('mode')}</ThemeHelperFormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Switch color='info' checked={settings.mode === 'dark'} onChange={() => {
              toggleMode();
            }} size='small' />}
            label={settings.mode} />
        </FormGroup>
      </ControlsWrapper>
      <ControlsWrapper direction={'row'} spacing={2}>
        <ThemeHelperFormLabel>{t('direction')}</ThemeHelperFormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                color='info'
                checked={settings.direction === 'rtl'}
                onChange={toggleDirection}
                size='small'
              />
            }
            label={settings.direction.toLocaleUpperCase()}
          />
        </FormGroup>
      </ControlsWrapper>
    </FormControl>
  );
};
