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

import {GridProps} from '@mui/material';
import {Component, Document, Page} from '@bloomreach/spa-sdk';
import {getSelectValue, getSelectValueAsInt} from '@/utils/SelectUtils';

export const defaults: GridProps = {
  columns: {xs: 4, sm: 8, md: 12, lg: 12, xl: 16},
  columnSpacing: {xs: 1, sm: 1, md: 1, lg: 2, xl: 2},
  direction: 'row',
  rowSpacing: {xs: 1, sm: 1, md: 1, lg: 2, xl: 2},
  sx: {
    alignContent: 'start',
    alignItems: 'stretch',
    display: 'grid',
    gridAutoColumns: '1fr',
    gridTemplateAreas: null,
    gridTemplateColumns: {
      xs: 'repeat(4, 1fr)',
      sm: 'repeat(8, 1fr)',
      md: 'repeat(12, 1fr)',
      lg: 'repeat(12, 1fr)',
      xl: 'repeat(16, 1fr)',
    },
    justifyContent: 'start',
    justifyItems: 'stretch',
  },
};

export const getContainers = (page: Page, excludeList: string[]): Component[] | null => {
  if (!page) return;
  const containers: Component[] = page.getComponent().getChildren();
  return containers.filter((entry) => {
    return excludeList.findIndex((item) => {
      return item === entry.getName();
    }) < 0 && entry;
  });
};

export const getContainerName = (container: Component) => {
  return container.getName();
};

export const getContainerParameters = (container: Component) => {
  return container.getParameters();
};

export const getDocumentParameters = (page: Page): any => {
  let pageDocumentParams = {
    gridTemplateAreas: {},
    spacing: {},
  };

  const doc: Document = page.getDocument();
  const layouts = doc?.getData().layouts;

  layouts?.forEach((entry) => {
    const size = getSelectValue(entry.size);
    pageDocumentParams.spacing[size] = getSelectValueAsInt(entry.gap);
    pageDocumentParams.gridTemplateAreas[size] = entry.templateArea.replaceAll('\n', ' ');
  });

  return pageDocumentParams;
};

export const getLayoutParameters = (page: Page): any => {
  return page.getComponent().getParameters();
};


export const getGridProps = (pageLayoutParams: any, pageDocumentParams: any): GridProps => {
  return {
    columns: pageLayoutParams.columns ? JSON.parse(pageLayoutParams.columns) : defaults.columns,
    columnSpacing: Object.entries(pageDocumentParams.spacing).length > 0 ? pageDocumentParams.spacing : pageLayoutParams.columnGap ? JSON.parse(pageLayoutParams.columnGap) : defaults.columnGap,
    direction: pageLayoutParams.gridAutoFlow || defaults.gridAutoFlow,
    rowSpacing: Object.entries(pageDocumentParams.spacing).length > 0 ? pageDocumentParams.spacing : pageLayoutParams.rowGap ? JSON.parse(pageLayoutParams.rowGap) : defaults.rowGap,
    sx: {
      alignContent: pageLayoutParams.alignContent || defaults.alignContent,
      alignItems: pageLayoutParams.alignItems || defaults.alignItems,
      display: defaults.display, //pageLayoutParams.display || defaults.display,
      gridAutoColumns: pageLayoutParams.gridAutoColumns || defaults.gridAutoColumns,
      gridTemplateAreas: Object.entries(pageDocumentParams.gridTemplateAreas).length > 0 ? pageDocumentParams.gridTemplateAreas : pageLayoutParams.gridTemplateAreas ? JSON.parse(pageLayoutParams.gridTemplateAreas) : null,
      gridTemplateColumns: pageLayoutParams.gridTemplateColumns ? JSON.parse(pageLayoutParams.gridTemplateColumns) : defaults.gridTemplateColumns,
      justifyContent: pageLayoutParams.justifyContent || defaults.justifyContent,
      justifyItems: pageLayoutParams.justifyItems || defaults.justifyItems,
    },
  };
};