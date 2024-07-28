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
import {Fragment, useContext, useEffect, useState} from 'react';
//next
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
//mui
import {Badge, Box, Button, Dialog, Drawer, Tooltip, useTheme} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import {styled} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//contexts
import {useAppContext} from '@/contexts/AppContext';
import {UserContext} from '@/contexts/UserContext';
//hocs
import {GtmEventProps, withGtmEvent} from '@/hocs/gtm/GtmEventHoc';
//functions
import {showCart} from '@/components/cart/CartComponentUtils';
//components
import {FlexBox} from '@/components/common/flex-box';
import ShoppingBagOutlined from '@/components/common/icons/ShoppingBagOutlined';
//templates
import Login from '@/components/header-toolbar/dialogs/Login';
import {LocaleSwitcher, MiniCart, UserButton} from '@/components/header-toolbar/button';

function HeaderToolbarBase(props: BrProps & GtmEventProps) {
  const {page, component, setGtmEventUser} = props;

  const {
    userState: {user},
  } = useContext(UserContext);

  const componentId = component.getId();
  useEffect(() => {
    setGtmEventUser(componentId, {});
  }, [user, componentId]); // eslint-disable-line react-hooks/exhaustive-deps

  const theme = useTheme();
  const router = useRouter();
  const {t} = useTranslation('common');

  const {state} = useAppContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const downMd = useMediaQuery(theme.breakpoints.down('md'));

  const toggleDialog = () => setDialogOpen(!dialogOpen);
  const toggleSidenav = () => setSidenavOpen(!sidenavOpen);

  // LOGIN AND MINICART DRAWER
  const DIALOG_DRAWER = (
    <Fragment>
      {!user?.username && (
        <Dialog
          scroll='body'
          open={dialogOpen}
          fullWidth={isMobile}
          onClose={toggleDialog}
          sx={{zIndex: 9999}}
        >
          <Login {...props} page={page!} component={component!} toggleDialog={toggleDialog} />
        </Dialog>
      )}

      {/* TODO: CART NOT FUNCTIONAL */}
      <Drawer open={sidenavOpen} anchor='right' onClose={toggleSidenav} sx={{zIndex: 9999}}>
        <MiniCart toggleSidenav={toggleSidenav} />
      </Drawer>
    </Fragment>
  );

  const HeaderToolbarContainer = styled(Box)({
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 10,
    justifyContent: 'flex-start',
    gap: '15px',
    position: 'sticky',
    top: 10,
    width: 'fit-content',
  });

  if (downMd) {
    return (
      <HeaderToolbarContainer>
        {/* LOGIN AND CART BUTTON */}
        <FlexBox gap={0.5} alignItems='center'>
          <LocaleSwitcher page={page!} component={component!} />
          <UserButton page={page!} component={component!} toggleDialog={toggleDialog} />
          {showCart(user) && (
            <Tooltip title={t('view-cart')} placement={'bottom-start'}>
              <Badge
                suppressHydrationWarning={true}
                badgeContent={state.cart.reduce((qty, item) => (qty += item.qty), 0)}
                color='primary'
              >
                <Box p={1.25} bgcolor='grey.200' component={IconButton} onClick={toggleSidenav}>
                  <ShoppingBagOutlined />
                </Box>
              </Badge>
            </Tooltip>
          )}
          <Tooltip title={t('download-mobile-app')} placement={'bottom-start'}>
            <Box
              p={1.25}
              component={Button}
              onClick={() => {
                router.push(page.getUrl('/download-app'));
              }}
              startIcon={<SmartphoneIcon />}
            />
          </Tooltip>
        </FlexBox>
        {/* LOGIN FORM DIALOG AND CART SIDE BAR  */}
        {DIALOG_DRAWER}
      </HeaderToolbarContainer>
    );
  }

  return (
    <HeaderToolbarContainer>
      {/* LOGIN AND CART BUTTON */}
      <FlexBox gap={0.5} alignItems='center'>
        <LocaleSwitcher page={page!} component={component!} />
        <UserButton page={page!} component={component!} toggleDialog={toggleDialog} />
        {showCart(user) && (
          <Tooltip title={t('view-cart')} placement={'bottom-start'}>
            <Badge
              suppressHydrationWarning={true}
              badgeContent={state.cart.reduce((qty, item) => (qty += item.qty), 0)}
              color='primary'
            >
              <Box bgcolor='grey.200' component={IconButton} onClick={toggleSidenav}>
                <ShoppingBagOutlined fontSize={'small'} />
              </Box>
            </Badge>
          </Tooltip>
        )}
        <Tooltip title={t('download-mobile-app')} placement={'bottom-start'}>
          <Box
            component={Button}
            onClick={() => {
              router.push(page.getUrl('/download-app'));
            }}
            startIcon={<SmartphoneIcon />}
          >
            {t('pacific-app')}
          </Box>
        </Tooltip>
      </FlexBox>
      {/* LOGIN FORM DIALOG AND CART SIDE BAR  */}
      {DIALOG_DRAWER}
    </HeaderToolbarContainer>
  );
}

export const HeaderToolbar = withGtmEvent(HeaderToolbarBase);