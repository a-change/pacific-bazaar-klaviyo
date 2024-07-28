import axios from 'axios';

async (req: any, res: any) => {
  try {
    const response = await axios({
      method: 'post',
      url: `https://api-demoapp.exponea.com/data/v2/projects/${req.query.token}/customers/attributes`,

      headers: {'Content-Type': 'application/json', Authorization: req.headers.authorization},
      withCredentials: true,
      data: {
        customer_ids: {registered: req.query.hardId},
        attributes: [
          {
            type: 'property',
            property: 'country',
          },
          {
            type: 'property',
            property: 'first_name',
          },
        ],
      },
    });
    res.json(response.data);
  } catch (e) {
    console.log('[ERROR] ', e);
  }
};
