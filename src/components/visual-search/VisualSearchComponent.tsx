//A react component that allows a user to upload a image file and then show the image in the browser

import {VisualSearchContext} from '@/contexts/VisualSearchContext';
import {BrProps} from '@bloomreach/react-sdk';
import {Alert, Button, Card, CircularProgress, Grid, Typography} from '@mui/material';
import {useRouter} from 'next/router';
import React, {useContext, useEffect, useState} from 'react';
import {FlexBox} from '../common/flex-box';
import {ProductCard} from '../product/templates/ProductCard';
import {set} from 'nprogress';
import {useCookies} from 'react-cookie';
import {DEFAULT_UID_COOKIE, UID_COOKIE_NAME} from '@/hocs/HocUtils';
import imageCompression from 'browser-image-compression';
import {handleImageUpload, uploadImage} from './utils';

export interface ImageUploadState {
  image: File | null;
  imageId: string | null;
  loading: boolean;
  error: string | null;
  originalDims: {width: number; height: number};
  objects: any[];
  objectId: string | null;
}

export const VisualSearchComponent = (props: BrProps) => {
  const {page} = props;

  const [imageUploadState, setImageUploadState] = useState<ImageUploadState>({
    image: null,
    imageId: null,
    error: null,
    loading: false,
    originalDims: {width: 0, height: 0},
    objects: [],
    objectId: '-1',
  });

  const [products, setProducts] = useState<any[] | null>(null);

  const {visualSearchParams} = useContext(VisualSearchContext);

  const router = useRouter();
  const [cookies] = useCookies([UID_COOKIE_NAME]);

  //Get the UID cookie from the browser
  const uidCookie = cookies[UID_COOKIE_NAME];
  const _br_uid_2 = uidCookie || DEFAULT_UID_COOKIE;

  //Check url for a query parameter imgUrl
  const query = router.query;
  const startingUrl = query?.imgUrl?.toString() ?? null;

  //get channel parameters from the page
  const channelParams = page?.getChannelParameters() ?? {};
  const {visualSearchWidgetID, discoveryFields, discoveryAccountId, discoveryDomainKey} =
    channelParams;

  useEffect(() => {
    if (imageUploadState.imageId) {
      fetch(
        `https://pathways.dxpapi.com/api/v2/widgets/visual/search/${visualSearchWidgetID}?account_id=${discoveryAccountId}&domain_key=${discoveryDomainKey}&api_type=visual_search&url=${window.location.href}&_br_uid_2=${_br_uid_2}&fields=${discoveryFields}&rows=50&image_id=${imageUploadState.imageId}&object_id=${imageUploadState.objectId}`,
      )
        .then((response) => response.json())
        .then((data) => {
          setProducts(data.response?.docs ?? []);
          setImageUploadState((prevState) => {
            return {
              ...prevState,
              objects: data?.objects ?? [],
            };
          });
        });
    }
  }, [
    imageUploadState.imageId,
    imageUploadState.objectId,
    visualSearchWidgetID,
    discoveryAccountId,
    discoveryDomainKey,
    discoveryFields,
    _br_uid_2,
  ]);


  useEffect(() => {
    if (startingUrl) {
      fetch('/api/fetchProductImage?url=' + startingUrl).then(async (resp) => {
        const blob = await resp.blob();
        const file = new File([blob], 'product-image');
        handleImageUpload(file, channelParams, setImageUploadState, setProducts);
      });
    } else if (visualSearchParams.image) {
      setImageUploadState((prevState) => {
        return {
          ...prevState,
          image: visualSearchParams.image,
        };
      });
      handleImageUpload(visualSearchParams.image, channelParams, setImageUploadState, setProducts);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Grid container width='100%' minHeight={'50vh'} paddingTop={5} spacing={2} paddingX={5}>
      <Grid item xs={12} sm={12} md={3} minHeight='100%'>
        <FlexBox flexDirection={'row'} justifyContent={'center'} minWidth={230}>
          <Card sx={{width: '100%', maxWidth: 250}}>
            <FlexBox flexDirection={'column'} width='100%' maxWidth={250} padding={2}>
              <FlexBox flexDirection={'column'} position='relative'>
                {drawObjectIndicators(imageUploadState, setImageUploadState)}
                {startingUrl || imageUploadState.image ? (
                  <img
                    src={startingUrl ?? URL.createObjectURL(imageUploadState.image)}
                    alt='Uploaded image'
                    style={{
                      aspectRatio:
                        imageUploadState.originalDims.width / imageUploadState.originalDims.height,
                    }}
                  />
                ) : (
                  <FlexBox
                    minHeight='300px'
                    width='100%'
                    flexGrow={1}
                    justifyContent={'center'}
                    alignItems={'center'}
                  >
                    {imageUploadState.loading ? <CircularProgress /> : 'No image selected'}
                  </FlexBox>
                )}
              </FlexBox>

              <FlexBox width='100%' justifyContent={'center'} gap={2} paddingTop={2}>
                <Button variant='contained' component='label'>
                  Upload File
                  <input
                    type='file'
                    accept='image/*'
                    onChange={(e) => {
                      handleImageUpload(e.target.files?.[0], channelParams, setImageUploadState, setProducts);
                      if (query.imgUrl) {
                        const {imgUrl, ...queries} = query;
                        console.log('replacing');
                        router.push({
                          query: {...queries},
                        });
                      }
                    }}
                    hidden
                  />
                </Button>
                {(startingUrl || imageUploadState.image) && (
                  <Button
                    variant='contained'
                    onClick={() => {
                      setImageUploadState((prevState) => {
                        return {
                          ...prevState,
                          image: null,
                          imageId: null,
                          error: null,
                          loading: false,
                          originalDims: {width: 0, height: 0},
                          objects: [],
                          objectId: '-1',
                        };
                      });
                      if (query.imgUrl) {
                        const {imgUrl, ...queries} = query;
                        console.log('replacing');
                        router.push({
                          query: {...queries},
                        });
                      }
                    }}
                  >
                    Clear
                  </Button>
                )}
              </FlexBox>
            </FlexBox>
          </Card>
        </FlexBox>
      </Grid>
      <Grid item xs={12} sm={12} md={9}>
        <Grid container spacing={1}>
          {imageUploadState.loading && (
            <FlexBox
              width='100%'
              height={'100%'}
              flexGrow={1}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <CircularProgress />{' '}
            </FlexBox>
          )}
          {imageUploadState.error && (
            <FlexBox justifyContent={'center'}>
              <Alert severity='error'>
                {'Your image upload has encountered an error: ' + imageUploadState.error}
              </Alert>
            </FlexBox>
          )}

          {imageUploadState.image && products?.length === 0 && (
            <FlexBox justifyContent={'center'}>
              <Alert severity='warning'>No results found</Alert>
            </FlexBox>
          )}
          {imageUploadState.image && products?.length > 0 && (
            <Grid sm={12}>
              <Typography variant={'h5'} paddingBottom={1}>
                Items Similar to Your Image
              </Typography>
            </Grid>
          )}
          {imageUploadState.imageId &&
            products?.map((product, key) => {
              return (
                <Grid item lg={4} sm={6} md={4} xs={12} key={key}>
                  <ProductCard
                    productContent={{
                      ...product,
                      sale_price: product.price,
                      sale_price_range: [],
                      price_range: [],
                      description: '',
                    }}
                    productParams={{
                      template: 'card',
                    }}
                  />
                </Grid>
              );
            })}
        </Grid>
      </Grid>
    </Grid>
  );
};

/**
 * Draws identified objects on the image and returns the JSX. Handles active selection and click events.
 * @param objects
 * @param objectId
 * @param originalDims
 * @param setObjectId
 * @param image
 * @returns
 */
function drawObjectIndicators(
  state: ImageUploadState,
  setState: React.Dispatch<React.SetStateAction<ImageUploadState>>,
): React.ReactNode {
  return (
    <>
      {state.image && state.objects.length
        ? state.objects.map((object, key) => {
          const active = object.id === state.objectId;
          const [l, b, r, t] = object.bbox;
          const leftActiveBoundary = (l / state.originalDims.width) * 100;
          const rightActiveBoundary = (r / state.originalDims.width) * 100;
          const topActiveBoundary = (t / state.originalDims.height) * 100;
          const bottomActiveBoundary = (b / state.originalDims.height) * 100;

          const xCoordinate = ((l + r) / (2 * state.originalDims.width)) * 100;
          const yCoordinate = ((t + b) / (2 * state.originalDims.height)) * 100;

          if (!active) {
            return (
              <div
                onClick={() => setState((prevState) => ({...prevState, objectId: object.id}))}
                key={key}
                style={{
                  zIndex: 4,
                  cursor: 'pointer',
                  position: 'absolute',
                  left: `${xCoordinate}%`,
                  bottom: `${100 - yCoordinate}%`,
                  height: '10px',
                  width: '10px',
                  transform: 'translate(-50%, 50%)',
                  border: '2px solid yellow',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.4)',
                }}
              />
            );
          } else {
            return (
              <img
                key={key}
                src={URL.createObjectURL(state.image)}
                alt='Uploaded image'
                style={{
                  width: '100%',
                  height: '100%',
                  zIndex: 3,
                  position: 'absolute',
                  aspectRatio: state.originalDims.width / state.originalDims.height,
                  border: '2px solid yellow',
                  clipPath: `polygon(${leftActiveBoundary}% ${topActiveBoundary}%, ${rightActiveBoundary}% ${topActiveBoundary}%, ${rightActiveBoundary}% ${bottomActiveBoundary}%, ${leftActiveBoundary}% ${bottomActiveBoundary}%)`,
                }}
              />
            );
          }
        })
        : null}
      {state.objectId !== '-1' && (
        <div
          onClick={() => setState((prevState) => ({...prevState, objectId: '-1'}))}
          style={{
            zIndex: 2,
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          }}
        />
      )}
    </>
  );
}
