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
import React, {useContext, useState} from 'react';
//mui
import {
  Box,
  Chip,
  Container,
  Divider,
  Grid, ImageList, ImageListItem,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon, ListItemText,
  styled,
  useTheme,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
//next
import {useTranslation} from 'next-i18next';
//components
import {NavLink} from '@/components/common/nav-link';
import BazaarCard from '@/components/common/bazaar/BazaarCard';
import {H3} from '@/components/common/bazaar/Typography';
import {FlexBox, FlexRowCenter} from '@/components/common/flex-box';
//types
import {
  CategoryNavigatorItem,
  CategoryNavigatorTemplateProps,
} from '@/components/category-navigator/CategoryNavigatorComponentTypes';
import {useRouter} from 'next/router';
import {BrPageContext} from '@bloomreach/react-sdk';
import {CategoryPreviewer} from '@/components/category-navigator/CategoryPreviewer';

// style components
const navLinkStyle = {
  cursor: 'pointer',
  transition: 'color 150ms ease-in-out',
  '&:hover': {color: 'primary.main'},
  '&:last-child': {marginRight: 0},
};

const CategoryNavLink = styled(NavLink)({...navLinkStyle});

const CategoryNavBarWrapper = styled(BazaarCard, {
  shouldForwardProp: (props) => props !== 'isLeft',
})<{border: number, isLeft: boolean}>(
  ({theme, border, isLeft}) => ({
    backgroundColor: theme.palette.background.default,
    height: '60px',
    display: 'block',
    borderRadius: '0px',
    position: 'relative',
    marginRight: isLeft ? '16px' : '0px',
    marginBottom: '2px',
    ...(border && {borderBottom: `1px solid ${theme.palette.grey[200]}`}),
    [theme.breakpoints.down('md')]: {display: 'none'},
  }),
);

const CategoryInnerContainer = styled(Container)({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const CategoryChildBox = styled(Box)(({theme}) => ({
  cursor: 'pointer',
  position: 'relative',
  transition: 'color 150ms ease-in-out',
  ':hover': {
    color: theme.palette.primary.main,
    '& .menu-list': {display: 'block'},
  },
}));

const CategoryMenusContainer = styled(ListItem, {
  shouldForwardProp: (props) => props !== 'hasBanner' && props !== 'isLeft',
})<{hasBanner?: boolean, isLeft?: boolean}>(({theme, hasBanner, isLeft}) => ({
  zIndex: 2,
  top: '100%',
  left: isLeft ? '0px' : '-900px',
  minWidth: hasBanner ? 1200 : 800,
  display: 'none',
  position: 'absolute',
  transform: `translate(-10%, 0%)`,
  [theme.breakpoints.down('md')]: {minWidth: 1200},
}));

const CategoryListItem = styled(ListItem)(({theme}) => ({
  padding: '.7rem 2rem',
  ':hover': {backgroundColor: theme.palette.action.hover},
}));

export const CategoryNavigatorBrowser = (props: CategoryNavigatorTemplateProps) => {
  const {
    categoryNavigatorContent: {categoryItem: {name, url, childCategoryItems}},
    categoryNavigatorParams: {isLeft},
  } = props;
  const theme = useTheme();
  const {t} = useTranslation('product');
  const router = useRouter();
  const page = useContext(BrPageContext);

  const hasChildren = childCategoryItems && childCategoryItems.length > 0;
  const [selectedItem, setSelectedItem] = useState<CategoryNavigatorItem | null>(hasChildren ? childCategoryItems?.[0] : null);

  const RenderSubCategories = () => {
    const {name, count} = selectedItem ?? {};
    return <Grid item xs={8}>
      <H3 sx={{textTransform: 'capitalize', textAlign: 'center', marginTop: '16px'}}>
        {name} <Chip label={count} size={'small'} />
      </H3>
      <CategoryPreviewer categoryId={selectedItem.id}
                         page={page}
                         pageSize={32}
      />
    </Grid>;
  };

  const SubCategoryNav = () => {
    const {name, count, childCategoryItems} = selectedItem ?? {};
    return (
      <Grid item md={10}>
        <Grid container>
          {!isLeft && RenderSubCategories()}
          <Grid item xs={4}>
            <List>
              {childCategoryItems?.slice(0, 12)?.map((child, key) =>
                <CategoryListItem key={child.name ?? key}>
                  <CategoryNavLink href={child.url ?? ''}
                                   sx={{textTransform: 'capitalize'}}>
                    {child?.name} <Chip label={child?.count} size={'small'} />
                  </CategoryNavLink>
                </CategoryListItem>,
              )}
            </List>
          </Grid>
          {isLeft && RenderSubCategories()}
        </Grid>
      </Grid>
    );
  };

  return (
    <CategoryNavBarWrapper hoverEffect={false} elevation={0} border={0} isLeft={isLeft}>
      <CategoryInnerContainer disableGutters>
        <FlexBox gap={4}>
          <CategoryChildBox>
            <FlexRowCenter alignItems={'flex-end'} gap={0.3} whiteSpace={'nowrap'}>
              {!hasChildren && url ? (
                <NavLink href={url ?? ''}>{name}</NavLink>
              ) : (
                `${name} `
              )}
              {hasChildren && (
                <KeyboardArrowDownIcon sx={{color: 'grey.500', fontSize: '1.1rem'}} />
              )}
            </FlexRowCenter>
            {hasChildren && (
              <CategoryMenusContainer className='menu-list' isLeft={isLeft} hasBanner={true}>
                <BazaarCard elevation={3} sx={{mt: 1.5, overflow: 'hidden', minWidth: '600px'}}>
                  <Grid container>
                    {!isLeft && <SubCategoryNav />}
                    <Grid item md={2} sx={{
                      py: 1,
                      backgroundColor: theme.palette.background.default,
                    }}>
                      <List disablePadding>
                        {childCategoryItems.map((sub, key) => {
                          const {name, isDynamic} = sub ?? {};
                          return name ? (
                              <ListItem disablePadding disableGutters key={`${key}-${name}`}>
                                <ListItemButton disableGutters selected={name === selectedItem?.name}
                                                href={sub.url ?? ''} onMouseOver={() => setSelectedItem(sub)}>
                                  {!isLeft && name === selectedItem?.name && !isDynamic && <ListItemIcon>
                                    <KeyboardArrowLeftIcon />
                                  </ListItemIcon>}
                                  <ListItemText inset={isLeft || name !== selectedItem?.name || isDynamic}
                                                primary={name}
                                                sx={{textTransform: 'capitalize'}} />
                                  {isLeft && name === selectedItem?.name && !isDynamic && <ListItemIcon>
                                    <KeyboardArrowRightIcon />
                                  </ListItemIcon>}
                                </ListItemButton>
                              </ListItem>
                            )
                            :
                            <Divider key={key}>
                              <Chip label={t('custom')} sx={{
                                textTransform: 'uppercase',
                              }} />
                            </Divider>;
                        })}
                      </List>
                    </Grid>
                    {isLeft && <SubCategoryNav />}
                  </Grid>
                </BazaarCard>
              </CategoryMenusContainer>
            )}
          </CategoryChildBox>
        </FlexBox>
      </CategoryInnerContainer>
    </CategoryNavBarWrapper>
  );
};
