import {Clear, KeyboardArrowDown, PersonOutline} from '@mui/icons-material';
import {Badge, Box, Button, Dialog, Drawer, styled} from '@mui/material';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import clsx from 'clsx';
import Image from '../BazaarImage';
import MiniCart from '../MiniCart';
import {Paragraph} from '../Typography';
import CategoryMenu from '../categories/CategoryMenu';
import {FlexBetween, FlexBox} from '../flex-box';
import Icon from '../icons';
import Category from '../icons/Category';
import ShoppingBagOutlined from '../icons/ShoppingBagOutlined';
import MobileMenu from '../navbar/MobileMenu';
import {useAppContext} from '@/contexts/AppContext';
import Link from 'next/link';
import Login from '../../pages-sections/sessions/Login';
import {FC, Fragment, ReactElement, useState} from 'react';
import {layoutConstant} from '../../utils/constants';

// styled component
export const HeaderWrapper = styled(Box)(({theme}) => ({
  zIndex: 3,
  position: 'relative',
  height: layoutConstant.headerHeight,
  transition: 'height 250ms ease-in-out',
  background: theme.palette.background.paper,
  [theme.breakpoints.down('sm')]: {
    height: layoutConstant.mobileHeaderHeight,
  },
}));

const StyledContainer = styled(Container)({
  gap: 2,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

// ==============================================================
type HeaderProps = {
  isFixed?: boolean;
  className?: string;
  searchInput: ReactElement;
};
// ==============================================================

const Header: FC<HeaderProps> = ({isFixed, className, searchInput}) => {
  const theme = useTheme();
  const {state} = useAppContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const downMd = useMediaQuery(theme.breakpoints.down(1150));

  const toggleDialog = () => setDialogOpen(!dialogOpen);
  const toggleSidenav = () => setSidenavOpen(!sidenavOpen);
  const toggleSearchBar = () => setSearchBarOpen(!searchBarOpen);

  // LOGIN AND MINICART DRAWER
  const DIALOG_DRAWER = (
    <Fragment>
      <Dialog
        scroll='body'
        open={dialogOpen}
        fullWidth={isMobile}
        onClose={toggleDialog}
        sx={{zIndex: 9999}}
      >
        <Login />
      </Dialog>

      <Drawer open={sidenavOpen} anchor='right' onClose={toggleSidenav} sx={{zIndex: 9999}}>
        <MiniCart toggleSidenav={toggleSidenav} />
      </Drawer>
    </Fragment>
  );

  // FOR SMALLER DEVICE
  if (downMd) {
    const ICON_STYLE = {color: 'grey.600', fontSize: 20};

    return (
      <HeaderWrapper className={clsx(className)}>
        <StyledContainer>
          <FlexBetween width='100%'>
            {/* LEFT CONTENT - NAVIGATION ICON BUTTON */}
            <Box flex={1}>
              <MobileMenu />
            </Box>

            {/* MIDDLE CONTENT - LOGO */}
            <Link href='/' legacyBehavior>
              <a>
                <Image height={44} src='/assets/images/bazaar-black-sm.svg' alt='logo' />
              </a>
            </Link>

            {/* RIGHT CONTENT - LOGIN, CART, SEARCH BUTTON */}
            <FlexBox justifyContent='end' flex={1}>
              <Box component={IconButton} onClick={toggleSearchBar}>
                <Icon.Search sx={ICON_STYLE} />
              </Box>

              <Box component={IconButton} onClick={toggleDialog}>
                <Icon.User sx={ICON_STYLE} />
              </Box>

              <Box component={IconButton} onClick={toggleSidenav}>
                <Badge
                  badgeContent={state.cart.reduce((qty, item) => (qty += item.qty), 0)}
                  color='primary'
                >
                  <Icon.CartBag sx={ICON_STYLE} />
                </Badge>
              </Box>
            </FlexBox>
          </FlexBetween>

          {/* SEARCH FORM DRAWER */}
          <Drawer open={searchBarOpen} anchor='top' onClose={toggleSearchBar} sx={{zIndex: 9999}}>
            <Box sx={{width: 'auto', padding: 2, height: '100vh'}}>
              <FlexBetween mb={1}>
                <Paragraph>Search to Bazaar</Paragraph>

                <IconButton onClick={toggleSearchBar}>
                  <Clear />
                </IconButton>
              </FlexBetween>

              {/* CATEGORY BASED SEARCH FORM */}
              {searchInput}
            </Box>
          </Drawer>

          {/* LOGIN FORM DIALOG AND CART SIDE BAR  */}
          {DIALOG_DRAWER}
        </StyledContainer>
      </HeaderWrapper>
    );
  }

  return (
    <HeaderWrapper className={clsx(className)}>
      <StyledContainer>
        {/* LEFT CONTENT - LOGO AND CATEGORY */}
        <FlexBox mr={2} minWidth='170px' alignItems='center'>
          <Link href='/' legacyBehavior>
            <a>
              <Image height={44} src='/assets/images/logo2.svg' alt='logo' />
            </a>
          </Link>

          {/* SHOW DROP DOWN CATEGORY BUTTON WHEN HEADER FIXED */}
          {isFixed && (
            <CategoryMenu>
              <FlexBox color='grey.600' alignItems='center' ml={2}>
                <Button color='inherit'>
                  <Category fontSize='small' color='inherit' />
                  <KeyboardArrowDown fontSize='small' color='inherit' />
                </Button>
              </FlexBox>
            </CategoryMenu>
          )}
        </FlexBox>

        {/* SEARCH FORM */}
        <FlexBox justifyContent='center' flex='1 1 0'>
          {searchInput}
        </FlexBox>

        {/* LOGIN AND CART BUTTON */}
        <FlexBox gap={1.5} alignItems='center'>
          <Box component={IconButton} p={1.25} bgcolor='grey.200' onClick={toggleDialog}>
            <PersonOutline />
          </Box>

          <Badge
            badgeContent={state.cart.reduce((qty, item) => (qty += item.qty), 0)}
            color='primary'
          >
            <Box p={1.25} bgcolor='grey.200' component={IconButton} onClick={toggleSidenav}>
              <ShoppingBagOutlined />
            </Box>
          </Badge>
        </FlexBox>

        {/* LOGIN FORM DIALOG AND CART SIDE BAR  */}
        {DIALOG_DRAWER}
      </StyledContainer>
    </HeaderWrapper>
  );
};

export default Header;
