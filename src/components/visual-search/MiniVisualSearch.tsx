import {VisualSearchContext} from '@/contexts/VisualSearchContext';
import {BrProps} from '@bloomreach/react-sdk';
import {ChevronRight, UploadOutlined} from '@mui/icons-material';
import {Alert, Button, Grid, Typography} from '@mui/material';
import {useRouter} from 'next/router';
import {useContext, useEffect, useState} from 'react';
import {FlexBox} from '../common/flex-box';
import {ProductCard} from '../product/templates/ProductCard';
import useSettings from '@/hooks/useSettings';
import {getUrl} from '@/utils/UrlUtils';
import {useCookies} from 'react-cookie';
import {DEFAULT_UID_COOKIE, UID_COOKIE_NAME} from '@/hocs/HocUtils';
import {handleImageUpload, uploadImage} from './utils';
import {ImageUploadState} from './VisualSearchComponent';

interface SideNavProps {
  toggleSidenav: () => void;
}

const MiniVisualSearch = (props: BrProps & SideNavProps) => {
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

  const [products, setProducts] = useState<any[] | null>();

  const {setVisualSearchParams} = useContext(VisualSearchContext);
  const router = useRouter();
  const query = router.query;
  const startingUrl = query?.imgUrl?.toString() ?? null;

  const channelParams = page?.getChannelParameters() ?? {};
  const {
    visualSearchWidgetID,
    discoveryFields,
    discoveryAccountId,
    discoveryDomainKey,
  } = channelParams;
  const [cookies] = useCookies([UID_COOKIE_NAME]);
  const uidCookie = cookies[UID_COOKIE_NAME];
  const _br_uid_2 = uidCookie || DEFAULT_UID_COOKIE;

  useEffect(() => {
    if (imageUploadState.imageId) {
      fetch(
        `https://pathways.dxpapi.com/api/v2/widgets/visual/search/${visualSearchWidgetID}?account_id=${discoveryAccountId}&domain_key=${discoveryDomainKey}&api_type=visual_search&url=${window.location.href}&_br_uid_2=${_br_uid_2}&fields=${discoveryFields}&rows=50&image_id=${imageUploadState.imageId}&object_id=-1`,
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
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <FlexBox
      flexDirection={'column'}
      alignItems={'center'}
      justifyContent={'center'}
      width={300}
      padding={2}
    >
      <FlexBox width={'100%'} alignItems={'flex-start'} marginBottom={2}>
        <Typography variant={'h6'}>Visual Search</Typography>
      </FlexBox>
      <FlexBox flexDirection={'column'}>
        {imageUploadState.image && (
          <img
            src={URL.createObjectURL(imageUploadState.image)}
            alt='Uploaded image'
            width={200}
            height={200}
            style={{objectFit: 'contain'}}
          />
        )}
      </FlexBox>
      <FlexBox
        flexDirection={'column'}
        width='100%'
        justifyContent={'center'}
        gap={1}
        marginTop={2}
      >
        <Button variant='contained' component='label' fullWidth style={{padding: 10}}>
          {imageUploadState.image ? 'Replace this image' : 'Upload an image'}
          <input
            type='file'
            accept='image/*'
            onChange={(e) => {
              handleImageUpload(
                e.target.files?.[0],
                channelParams,
                setImageUploadState,
                setProducts,
              );
            }}
            hidden
          />
          <UploadOutlined></UploadOutlined>
        </Button>
        {imageUploadState.error && (
          <FlexBox justifyContent={'center'}>
            <Alert severity='error'>
              {'Your image upload has encountered an error: ' + imageUploadState.error}
            </Alert>
          </FlexBox>
        )}

        {imageUploadState.image && products?.length === 0 && (
          <FlexBox justifyContent={'center'}>
            <Typography variant={'body2'}>No results found</Typography>
          </FlexBox>
        )}
        {imageUploadState.image &&
          products?.length > 0 &&
          products.slice(0, 3).map((product, key) => {
            return (
              <Grid item lg={4} md={4} xs={4} key={key}>
                <ProductCard
                  previewDisabled
                  productContent={{
                    ...product,
                    sale_price: product.price,
                    sale_price_range: [],
                    price_range: [],
                    description: '',
                    variants: [],
                  }}
                  productParams={{
                    template: 'card',
                  }}
                />
              </Grid>
            );
          })}
        {imageUploadState.image && products?.length > 3 ? (
          <Button
            variant='contained'
            component='label'
            fullWidth
            style={{padding: 10}}
            onClick={() => {
              setVisualSearchParams({image: imageUploadState.image});
              const newUrl = getUrl('/visual-search', page!);
              router.push(newUrl);
            }}
          >
            View all results
            <ChevronRight></ChevronRight>
          </Button>
        ) : null}
      </FlexBox>
    </FlexBox>
  );
};

export default MiniVisualSearch;
