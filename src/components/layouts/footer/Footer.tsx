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
import {FC} from 'react';
//mui
import {Box, Grid} from '@mui/material';
import {Breakpoint, useTheme} from '@mui/material/styles';
//bloomreach sdk
import {BrComponent, BrProps} from '@bloomreach/react-sdk';
//hooks
import useSettings from '@/hooks/useSettings';
//components
import {JustifiedFlexContainer} from '@/components/common/flex-box';
import {FooterComponent} from '@/components/footer/FooterComponent';

type FooterProps = {};

const Footer: FC<BrProps & FooterProps> = (): React.ReactElement => {
  const theme = useTheme();
  const {settings} = useSettings();
  const footer = settings.layouts.footer;

  return (
    <Box component='footer' bgcolor={footer.bgColor} borderTop={footer.borderTop} borderColor={footer.borderColor}
         color={footer.color} mb={footer.mb} mt={footer.mt} pb={footer.pb} pt={footer.pt} width='100%'>
      {/* single footer implementation */}
      <BrComponent path='footer-static'>
        <FooterComponent />
      </BrComponent>
      {/* single footer cross-pillar implementation */}
      <BrComponent path='footer-menu'>
        <FooterComponent />
      </BrComponent>

      {/* grid footer implementation */}
      <JustifiedFlexContainer maxWidth={footer.maxWidth as Breakpoint}>
        <Grid container spacing={3}>
          <Grid item lg={3} md={3} sm={12} xs={12} order={{xs: 3, md: 1}} sx={{
            display: 'flex',
            [theme.breakpoints.down('md')]: {
              justifyContent: 'center',
            },
          }}>
            <BrComponent path='footer/row1__col1' />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12} order={{xs: 1, md: 2}} sx={{
            display: 'flex',
            justifyContent: 'center',
          }}>
            <BrComponent path='footer/row1__col2' />
          </Grid>
          <Grid item lg={3} md={3} sm={12} xs={12} order={{xs: 2, md: 3}} sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            [theme.breakpoints.down('md')]: {
              justifyContent: 'center',
            },
          }}>
            <BrComponent path='footer/row1__col3' />
          </Grid>
          <Grid item lg={3} md={3} sm={12} xs={12} order={{xs: 4}} sx={{
            display: 'flex',
            [theme.breakpoints.down('md')]: {
              justifyContent: 'center',
            },
          }}>
            <BrComponent path='footer/row3__col1' />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12} order={{xs: 5}} sx={{
            display: 'flex',
            justifyContent: 'center',
          }}>
            <BrComponent path='footer/row3__col2' />
          </Grid>
          <Grid item lg={3} md={3} sm={12} xs={12} order={{xs: 6}} sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            [theme.breakpoints.down('md')]: {
              justifyContent: 'center',
            },
          }}>
            <BrComponent path='footer/row3__col3' />
          </Grid>
        </Grid>
      </JustifiedFlexContainer>
    </Box>
  );
};

export default Footer;
