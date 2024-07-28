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
import {FC, useContext} from 'react';
//mui
import {Breakpoint, Container, Grid, GridProps} from '@mui/material';
//bloomreach sdks
import {BrComponent, BrPageContext} from '@bloomreach/react-sdk';
import {Component} from '@bloomreach/spa-sdk';
//components
import PacificContainerWrapper from './PacificContainerWrapper';
//functions
import {
  getContainerName,
  getContainerParameters,
  getContainers,
  getDocumentParameters,
  getGridProps,
  getLayoutParameters,
} from '../PageUtils';
//Config JSON
import styles from '../../../../mocks/styles/page-examples.json';

type PageContainersProps = {};

export type StylePropsType = {
  bgColor?: string,
  border?: string,
  borderColor?: string,
  color?: string,
  elevation?: number,
  pt?: number,
  pl?: number,
  pb?: number,
  pr?: number
};

const PageContainers: FC<PageContainersProps> = (): React.ReactElement => {
  const page = useContext(BrPageContext);
  const isPreview = page.isPreview();

  const containers = getContainers(page, ['header', 'footer']);
  const pageDocumentParams = getDocumentParameters(page);
  const pageLayoutParams = getLayoutParameters(page);
  const containerProps: GridProps = getGridProps(pageLayoutParams, pageDocumentParams);

  const page_style = 'with-defaults';
  const style = styles[page_style];

  const maxWidth = (pageLayoutParams?.maxPageWidth ?? false) as Breakpoint;

  return (
    <Container disableGutters maxWidth={maxWidth}>
      <Grid container {...containerProps}>

        {containers.map((entry: Component, key: number) => {
          const name = getContainerName(entry);
          //TODO: hack for cross pillar demo
          if (name === 'menu-container') {
            return null;
          }
          const containerParams = getContainerParameters(entry);
          return (
            <Grid item
                  key={key}
                  gridArea={containerParams.gridArea || name}
                  gridColumn={!pageDocumentParams.gridTemplateAreas && containerParams.gridColumnStart && JSON.parse(containerParams.gridColumnStart)}
                  gridRow={!pageDocumentParams.gridTemplateAreas && containerParams.gridRowStart && JSON.parse(containerParams.gridRowStart)}
                  sx={{width: '100%'}}
            >
              <PacificContainerWrapper {...{
                name,
                style: style[name] as StylePropsType,
                height: '100%',
                width: '100%',
                isPreview,
              }}>
                {/*isPreview && <Box display='flex' justifyContent='center' width='100%'>{name}</Box>*/}
                <BrComponent path={name} />
              </PacificContainerWrapper>
            </Grid>
          );
        })}

      </Grid>
    </Container>
  );
};

export default PageContainers;