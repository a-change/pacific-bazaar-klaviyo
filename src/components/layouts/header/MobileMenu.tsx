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
import {FC, Fragment, useState} from 'react';
//mui
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import {Accordion, AccordionSummary, Box, Drawer, IconButton} from '@mui/material';
//components
import Scrollbar from '@/components/common/bazaar/Scrollbar';
import {H6} from '@/components/common/bazaar/Typography';
import {NavLink} from '@/components/common/nav-link';
//Config JSONs
import menus from '../../../../mocks/data/menus';

type MobileMenuProps = {};

const MobileMenu: FC<MobileMenuProps> = (): React.ReactElement => {
  const [openDrawer, setOpenDrawer] = useState(false);

  // MODIFY THE NAVIGATION WITH NEW STRUCTURE
  // const updateNavigations = menus.navbar.reduce((prev: any, curr: any) => {
  //   const newArr = [...prev];

  //   if (!curr.children) {
  //     newArr.push({ ...curr, extLink: true });
  //   } else if (curr.megaMenu || curr.megaMenuWithSub) {
  //     const flated = curr.children.flat();
  //     newArr.push({ name: curr.name, children: flated });
  //   } else {
  //     newArr.push(curr);
  //   }

  //   return newArr;
  // }, []);

  const renderLevels = (data: any) => {
    if (!data) return;
    return data.map((item: any, index: any) => {

      if (item.children && item.children.length > 0) {
        return (
          <Accordion
            square
            key={index}
            elevation={0}
            disableGutters
            sx={{
              '&:not(:last-child)': {borderBottom: 0},
              '&:before': {display: 'none'},
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                padding: 0,
                minHeight: 48,
                boxShadow: 'none',
                '& .Mui-expanded': {color: 'primary.main', margin: 0},
                '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                  margin: 0,
                  '& .MuiSvgIcon-root': {color: 'primary.main'},
                },
              }}
            >
              <H6>{item.name}</H6>
            </AccordionSummary>

            <Box mx={2}>{renderLevels(item.children)}</Box>
          </Accordion>
        );
      }

      if (item.extLink) {
        return (
          <H6 key={index} py={1}>
            <NavLink href={item.href ?? ''}>{item.name}</NavLink>
          </H6>
        );
      }

      return (
        <Box key={index} py={1}>
          <NavLink href={item.href ?? ''}>{item.name}</NavLink>
        </Box>
      );
    });
  };

  return (
    <Fragment>
      <IconButton
        onClick={() => setOpenDrawer(true)}
        sx={{flexShrink: 0, color: 'grey.600'}}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor='left'
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        sx={{zIndex: 15001}}
      >
        <Box sx={{width: '100vw', height: '100%', position: 'relative'}}>
          <Scrollbar autoHide={false} sx={{height: '100vh'}}>
            <Box
              maxWidth={500}
              margin='auto'
              position='relative'
              height='100%'
              px={5}
              py={8}
            >
              <IconButton
                onClick={() => setOpenDrawer(false)}
                sx={{position: 'absolute', right: 30, top: 15}}
              >
                <ClearIcon fontSize='small' />
              </IconButton>

              {menus.main && renderLevels(menus.main)}
            </Box>
          </Scrollbar>
        </Box>
      </Drawer>
    </Fragment>
  );
};

export default MobileMenu;
