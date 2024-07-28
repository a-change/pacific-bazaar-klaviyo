import imageCompression from 'browser-image-compression';
import {ImageUploadState} from './VisualSearchComponent';

/**
 * Handles upload of image to endpoint
 * @param url
 * @param image
 * @returns data
 */
export const uploadImage = async (url: string, image: File) => {
  const formData = new FormData();
  let compressedFile;

  if (image.size > 1000000) {
    compressedFile = await compressImage(image);
  } else {
    compressedFile = image;
  }
  formData.append('image', compressedFile);

  const response = await fetch(url, {
    method: 'POST',
    headers: {},
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to send image: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

const compressImage = async (image: File) => {
  const options = {
    maxSizeMB: 1,
    useWebWorker: true,
  };

  try {
    return await imageCompression(image, options);
  } catch (error) {
    console.log(error);
    alert('Image size must be less than 1MB');
  }
};

/**
 * Handles the upload of an image file, sets the image state, and retrieves the image embedding.
 * @param file - The image file to upload.
 */
export const handleImageUpload = async (
  file: File | null,
  params: any,
  setState: React.Dispatch<React.SetStateAction<ImageUploadState>>,
  setProducts: React.Dispatch<React.SetStateAction<any[] | null>>,
) => {
  try {
    const {visualSearchWidgetID, discoveryFields, discoveryAccountId, discoveryDomainKey} = params;
    if (file) {
      setState((prevState) => {
        return {
          ...prevState,
          image: file,
          imageId: null,
          error: null,
          loading: true,
          originalDims: {width: 0, height: 0},
          objects: [],
          objectId: '-1',
        };
      });

      //Load the image to get the original dimensions, used to scale object overlays
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.decode;
      img.onload = function() {
        setState((prevState) => {
          return {
            ...prevState,
            originalDims: {width: img.width, height: img.height},
          };
        });
        URL.revokeObjectURL(img.src);
      };
      img.src = url;

      const response = await uploadImage(
        `https://pathways.dxpapi.com/api/v2/widgets/visual/upload/${visualSearchWidgetID}?account_id=${discoveryAccountId}&domain_key=${discoveryDomainKey}&api_type=visual_search`,
        file,
      );

      setProducts(null);
      setState((prevState) => {
        return {
          ...prevState,
          imageId: response.response.image_id,
        };
      });
    }
  } catch (err) {
    console.error(err);
    setState((prevState) => {
      return {
        ...prevState,
        error: err.message,
      };
    });
  } finally {
    setState((prevState) => {
      return {
        ...prevState,
        loading: false,
      };
    });
  }
};
