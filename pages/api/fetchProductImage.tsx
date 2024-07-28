const handler = async (req: any, res: any): Promise<any> => {
  // take the image url from the request and fetch it, returning the blob of image data
  try {
    const response = await fetch(req.query.url);
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
    if(response.headers.get('content-length') === '0') throw new Error('no content-length');
    if (parseInt(response.headers.get('content-length') )> 1000000) throw new Error('image too large');
    
    
    const imageBlob = await response.blob();
    const buff = await imageBlob.arrayBuffer();
    const arr = new Uint8Array(buff);


    res.setHeader('content-type', response.headers.get('content-type') || 'image/*');

    res.setHeader('content-length', response.headers.get('content-length') || arr.length);

    res.setHeader('Content-Disposition', 'attachment; filename="tomato.jpeg"');

    res.write(arr);

    return res.status(200).end();
  } catch (e) {
    console.error(e);
  }
};

export default handler;
