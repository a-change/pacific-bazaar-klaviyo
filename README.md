# Pacific Demo Bazaar

Pacific Demo NextJS App is a Single-page SSR React Application using the BloomReach Experience SDK.

## Installation

1. Install NVM by following instruction in https://github.com/nvm-sh/nvm
2. Set Node version to 16.16.0
   ```bash
   nvm use 16.16.0
   ```
3. Install YARN by following instruction in https://yarnpkg.com/getting-started/install
4. Set Yarn Version to 1.22.19
   ```bash
   yarn policies set-version 1.22.19
   ```
5. Install all dependencies
   ```bash
   yarn
   ```    
## Node Upgrade
```bash
nvm install 18.17.0
nvm use 18.17.0
npm install -g yarn
```

## Available run scripts

In the project directory, you can run one of the following scripts and then

open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn run dev`
Runs the SPA app in the development mode with dev saas instance.<br>

### `yarn start`
Runs the SPA app in the production mode with dev saas instance.<br> This will start an express server to
serve the app from the `.next` folder.

### `./node_modules/.bin/env-cmd -e XXXXX yarn run dev`
Runs the SPA app in the development mode with a selected saas instance.<br>

### `./node_modules/.bin/env-cmd -e XXXXX yarn start`
Runs the SPA app in the production mode with a selected saas instance.<br> This will start an express server to
serve the app from the `.next` folder.

### Available saas instances

| Env        | Saas Server                     |  
|------------|---------------------------------|
| production | pacific-saas.bloomreach.io      | 
| qa         | sandbox-sales00.bloomreach.io   | 
| sales01    | sandbox-sales01.bloomreach.io   | 
| sales02    | sandbox-sales02.bloomreach.io   | 
| sales03    | sandbox-sales03.bloomreach.io   | 
| sales04    | sandbox-sales04.bloomreach.io   | 
| sales05    | sandbox-sales05.bloomreach.io   | 
| sales06    | sandbox-sales06.bloomreach.io   | 
| sales07    | sandbox-sales07.bloomreach.io   | 
| sales08    | sandbox-sales08.bloomreach.io   | 
| sales09    | sandbox-sales09.bloomreach.io   | 
| sales10    | sandbox-sales10.bloomreach.io   | 
| sales11    | sandbox-sales11.bloomreach.io   | 
| sales12    | sandbox-sales12.bloomreach.io   | 
| sales13    | sandbox-sales13.bloomreach.io   | 
| sales14    | sandbox-sales14.bloomreach.io   | 
| sales15    | sandbox-sales15.bloomreach.io   | 
| sales16    | sandbox-sales16.bloomreach.io   | 
| sales17    | sandbox-sales17.bloomreach.io   | 
| sales18    | sandbox-sales18.bloomreach.io   | 
| sales19    | sandbox-sales19.bloomreach.io   | 
| product01  | sandbox-product01.bloomreach.io | 
| product02  | sandbox-product02.bloomreach.io | 


### Other common scripts

### `yarn run build`

Builds the app for production to the `.next` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Customization

### Stylesheets

#### Add a new theme
#### Customize the existing theme CSS

## Notes

### Deep cleaning of the project in case of unexpected error(s)

```
npm cache clear --force
rm -rf node_modules
rm package-lock.json
npm install --force
npm update
```

### Test credit card numbers for demo

``` 
Fake credit card numbers for all major brands
These credit card numbers DO NOT work! They are for testing purposes only. Without a valid owner name, an expiration date and a valid CVV code, they can't be used for real transactions. You should use these numbers only to test your validation strategies and for bogus data. Note that the algorithm used here is freely available across the web even Wikipedia.org. These numbers were generated randomly.You can refresh the page to get new numbers.

VISA:
4916674319158256
4539367992761721
4539338057790906511

MasterCard:
5126789507961049
2720994545143652
5512022830690800

American Express (AMEX):
340003679546500
379767177849442
344861299993949

Discover:
6011649691940173
6011583170518095
6011074951540855778
```       

### Switch engagement project settings

When we switch to different channel with different engagement project settings, we need to clear up browser
application data including third-party cookies.

### Invalid yarn version

if you see error message similar to

```shell
The engine "yarn" is incompatible with this module. Expected version "1.22.18". Got "1.19.1"
```

run the following command

```shell
yarn policies set-version 1.22.18
```

### ImageSet mappings

| Size\Data Source | BR ImageSet | Bynder | Unsplash | 
| --- | --- | --- |  --- |
| Thumbnail | thumbnail | mini (60x60) | thumb (width of 200 pixels) |
| Small | small | thumbnail (250x250) | small (width of 400 pixels) |
| SmallSquare | smallsquare |  |  |
| MediumSquare | mediumsquare | webImage(600x600) | regular (width of 1080 pixels) |
| Large | large | large(1200x1200) | full (maximum dimensions) |
| LargeSquare | largesquare |  |  |
| Banner | banner |  |  |
| Original | original | online(1400x1400) | raw |

### Sample Bynder Image JSON
```json
[
 {
  "__typename": "Image",
  "id": "KEFzc2V0X2lkIDI5MUQzREU3LTMwQTgtNEY1Qi04MTkwMzREMzk3Q0EyRDZCKQ==",
  "name": "Problem Solving Storage",
  "description": null,
  "databaseId": "291D3DE7-30A8-4F5B-819034D397CA2D6B",
  "createdAt": "2020-04-17T15:38:24Z",
  "originalUrl": null,
  "publishedAt": "2020-04-17T15:37:37Z",
  "tags": [],
  "type": "IMAGE",
  "updatedAt": "2021-10-05T16:52:10Z",
  "url": "https://bloomreach.getbynder.com/media/?mediaId=291D3DE7-30A8-4F5B-819034D397CA2D6B",
  "metaproperties": {
    "nodes": []
  },
  "textMetaproperties": [],
  "derivatives": {
    "thumbnail": "https://bloomreach.getbynder.com/m/1fa52a6b134032ef/thul-Problem-Solving-Storage.png",
    "webImage": "https://bloomreach.getbynder.com/m/1fa52a6b134032ef/webimage-Problem-Solving-Storage.png"
  },
  "files": {
    "webImage": {
      "url": "https://bloomreach.getbynder.com/m/1fa52a6b134032ef/webimage-Problem-Solving-Storage.png",
      "width": 600,
      "height": 600,
      "fileSize": null
    },
    "thumbnail": {
      "url": "https://bloomreach.getbynder.com/m/1fa52a6b134032ef/thul-Problem-Solving-Storage.png",
      "width": 250,
      "height": 250,
      "fileSize": null
    },
    "mini": {
      "url": "https://bloomreach.getbynder.com/m/1fa52a6b134032ef/mini-Problem-Solving-Storage.png",
      "width": 80,
      "height": 80,
      "fileSize": null
    },
    "transformBaseUrl": {
      "url": "https://bloomreach.getbynder.com/transform/291d3de7-30a8-4f5b-8190-34d397ca2d6b/Problem-Solving-Storage",
      "width": null,
      "height": null,
      "fileSize": null
    },
    "ForIntegrations": {
      "url": "https://bloomreach.getbynder.com/m/1fa52a6b134032ef/ForIntegrations-Problem-Solving-Storage.jpg",
      "width": 1400,
      "height": 1400,
      "fileSize": 234837
    },
    "large": {
      "url": "https://bloomreach.getbynder.com/m/1fa52a6b134032ef/large-Problem-Solving-Storage.jpg",
      "width": 1200,
      "height": 1200,
      "fileSize": 169938
    },
    "online": {
      "url": "https://bloomreach.getbynder.com/m/1fa52a6b134032ef/online-Problem-Solving-Storage.png",
      "width": 1400,
      "height": 1400,
      "fileSize": 1848956
    }
  }
}
]
```
### Sample Unsplash Image JSON
```json
{
  "id": "gM8sMbx5K1E",
  "created_at": "2021-12-27T11:29:32-05:00",
  "updated_at": "2022-01-09T07:27:11-05:00",
  "promoted_at": null,
  "width": 6000,
  "height": 4000,
  "color": "#c0c0c0",
  "blur_hash": "LVKnYm8^nNZ~?baeV?oe%gbHIUWC",
  "description": null,
  "alt_description": null,
  "urls": {
    "raw": "https://images.unsplash.com/photo-1640622307951-4ca1e4804e58?ixid=Mnw4ODk1MXwxfDF8c2VhcmNofDF8fG9mZmljZXxlbnwwfHx8fDE2NDE3ODI2MzI&ixlib=rb-1.2.1",
    "full": "https://images.unsplash.com/photo-1640622307951-4ca1e4804e58?crop=entropy&cs=srgb&fm=jpg&ixid=Mnw4ODk1MXwxfDF8c2VhcmNofDF8fG9mZmljZXxlbnwwfHx8fDE2NDE3ODI2MzI&ixlib=rb-1.2.1&q=85",
    "regular": "https://images.unsplash.com/photo-1640622307951-4ca1e4804e58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw4ODk1MXwxfDF8c2VhcmNofDF8fG9mZmljZXxlbnwwfHx8fDE2NDE3ODI2MzI&ixlib=rb-1.2.1&q=80&w=1080",
    "small": "https://images.unsplash.com/photo-1640622307951-4ca1e4804e58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw4ODk1MXwxfDF8c2VhcmNofDF8fG9mZmljZXxlbnwwfHx8fDE2NDE3ODI2MzI&ixlib=rb-1.2.1&q=80&w=400",
    "thumb": "https://images.unsplash.com/photo-1640622307951-4ca1e4804e58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw4ODk1MXwxfDF8c2VhcmNofDF8fG9mZmljZXxlbnwwfHx8fDE2NDE3ODI2MzI&ixlib=rb-1.2.1&q=80&w=200"
  },
  "links": {
    "self": "https://api.unsplash.com/photos/gM8sMbx5K1E",
    "html": "https://unsplash.com/photos/gM8sMbx5K1E",
    "download": "https://unsplash.com/photos/gM8sMbx5K1E/download?ixid=Mnw4ODk1MXwxfDF8c2VhcmNofDF8fG9mZmljZXxlbnwwfHx8fDE2NDE3ODI2MzI",
    "download_location": "https://api.unsplash.com/photos/gM8sMbx5K1E/download?ixid=Mnw4ODk1MXwxfDF8c2VhcmNofDF8fG9mZmljZXxlbnwwfHx8fDE2NDE3ODI2MzI"
  },
  "categories": [],
  "likes": 20,
  "liked_by_user": false,
  "current_user_collections": [],
  "sponsorship": {
    "impression_urls": [
      "https://secure.insightexpressai.com/adServer/adServerESI.aspx?script=false&bannerID=9710750&rnd=[timestamp]&redir=https://secure.insightexpressai.com/adserver/1pixel.gif"
    ],
    "tagline": "Original by design",
    "tagline_url": "https://www.microsoft.com/surface?ocid=UnsplashFY22_soc_pmc_sur_",
    "sponsor": {
      "id": "N-JSeSTCz68",
      "updated_at": "2022-01-09T20:52:41-05:00",
      "username": "surface",
      "name": "Surface",
      "first_name": "Surface",
      "last_name": null,
      "twitter_username": "surface",
      "portfolio_url": "http://surface.com",
      "bio": "Follow us @Surface. #OriginalByDesign",
      "location": null,
      "links": {
        "self": "https://api.unsplash.com/users/surface",
        "html": "https://unsplash.com/@surface",
        "photos": "https://api.unsplash.com/users/surface/photos",
        "likes": "https://api.unsplash.com/users/surface/likes",
        "portfolio": "https://api.unsplash.com/users/surface/portfolio",
        "following": "https://api.unsplash.com/users/surface/following",
        "followers": "https://api.unsplash.com/users/surface/followers"
      },
      "profile_image": {
        "small": "https://images.unsplash.com/profile-1587651800415-20eed2ec0209image?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32",
        "medium": "https://images.unsplash.com/profile-1587651800415-20eed2ec0209image?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64",
        "large": "https://images.unsplash.com/profile-1587651800415-20eed2ec0209image?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128"
      },
      "instagram_username": "surface",
      "total_collections": 6,
      "total_likes": 0,
      "total_photos": 210,
      "accepted_tos": true,
      "for_hire": false,
      "social": {
        "instagram_username": "surface",
        "portfolio_url": "http://surface.com",
        "twitter_username": "surface",
        "paypal_email": null
      }
    }
  },
  "topic_submissions": {
    "business-work": {
      "status": "approved",
      "approved_on": "2021-12-28T09:01:18-05:00"
    }
  },
  "user": {
    "id": "N-JSeSTCz68",
    "updated_at": "2022-01-09T20:52:41-05:00",
    "username": "surface",
    "name": "Surface",
    "first_name": "Surface",
    "last_name": null,
    "twitter_username": "surface",
    "portfolio_url": "http://surface.com",
    "bio": "Follow us @Surface. #OriginalByDesign",
    "location": null,
    "links": {
      "self": "https://api.unsplash.com/users/surface",
      "html": "https://unsplash.com/@surface",
      "photos": "https://api.unsplash.com/users/surface/photos",
      "likes": "https://api.unsplash.com/users/surface/likes",
      "portfolio": "https://api.unsplash.com/users/surface/portfolio",
      "following": "https://api.unsplash.com/users/surface/following",
      "followers": "https://api.unsplash.com/users/surface/followers"
    },
    "profile_image": {
      "small": "https://images.unsplash.com/profile-1587651800415-20eed2ec0209image?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32",
      "medium": "https://images.unsplash.com/profile-1587651800415-20eed2ec0209image?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64",
      "large": "https://images.unsplash.com/profile-1587651800415-20eed2ec0209image?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128"
    },
    "instagram_username": "surface",
    "total_collections": 6,
    "total_likes": 0,
    "total_photos": 210,
    "accepted_tos": true,
    "for_hire": false,
    "social": {
      "instagram_username": "surface",
      "portfolio_url": "http://surface.com",
      "twitter_username": "surface",
      "paypal_email": null
    }
  },
  "tags": [
    {
      "type": "search",
      "title": "notebook"
    },
    {
      "type": "search",
      "title": "remote working"
    },
    {
      "type": "landing_page",
      "title": "windows",
      "source": {
        "ancestry": {
          "type": {
            "slug": "wallpapers",
            "pretty_slug": "HD Wallpapers"
          },
          "category": {
            "slug": "desktop",
            "pretty_slug": "Desktop"
          },
          "subcategory": {
            "slug": "windows",
            "pretty_slug": "Windows"
          }
        },
        "title": "HD Windows Wallpapers",
        "subtitle": "Download Free Windows Wallpapers",
        "description": "Choose from a curated selection of Windows wallpapers for your mobile and desktop screens. Always free on Unsplash.",
        "meta_title": "Windows Wallpapers: Free HD Download [500+ HQ] | Unsplash",
        "meta_description": "Choose from hundreds of free Windows wallpapers. Download HD wallpapers for free on Unsplash.",
        "cover_photo": {
          "id": "R9OS29xJb-8",
          "created_at": "2017-07-13T19:38:01-04:00",
          "updated_at": "2022-01-08T00:00:19-05:00",
          "promoted_at": "2017-07-14T22:49:56-04:00",
          "width": 3456,
          "height": 2304,
          "color": "#f3d9c0",
          "blur_hash": "LdPGHfMyRjj@B@WXfka}M{affQfk",
          "description": "Ergh Jebbi",
          "alt_description": "sand landscape",
          "urls": {
            "raw": "https://images.unsplash.com/photo-1499988921418-b7df40ff03f9?ixlib=rb-1.2.1",
            "full": "https://images.unsplash.com/photo-1499988921418-b7df40ff03f9?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb",
            "regular": "https://images.unsplash.com/photo-1499988921418-b7df40ff03f9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max",
            "small": "https://images.unsplash.com/photo-1499988921418-b7df40ff03f9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max",
            "thumb": "https://images.unsplash.com/photo-1499988921418-b7df40ff03f9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max"
          },
          "links": {
            "self": "https://api.unsplash.com/photos/R9OS29xJb-8",
            "html": "https://unsplash.com/photos/R9OS29xJb-8",
            "download": "https://unsplash.com/photos/R9OS29xJb-8/download",
            "download_location": "https://api.unsplash.com/photos/R9OS29xJb-8/download"
          },
          "categories": [],
          "likes": 1995,
          "liked_by_user": false,
          "current_user_collections": [],
          "sponsorship": null,
          "topic_submissions": {
            "wallpapers": {
              "status": "approved",
              "approved_on": "2020-04-06T10:20:09-04:00"
            }
          },
          "user": {
            "id": "zpgEV0k9XAA",
            "updated_at": "2022-01-07T12:00:25-05:00",
            "username": "m______________e",
            "name": "Mark Eder",
            "first_name": "Mark",
            "last_name": "Eder",
            "twitter_username": null,
            "portfolio_url": "http://www.markeder.photography",
            "bio": null,
            "location": "Vienna",
            "links": {
              "self": "https://api.unsplash.com/users/m______________e",
              "html": "https://unsplash.com/@m______________e",
              "photos": "https://api.unsplash.com/users/m______________e/photos",
              "likes": "https://api.unsplash.com/users/m______________e/likes",
              "portfolio": "https://api.unsplash.com/users/m______________e/portfolio",
              "following": "https://api.unsplash.com/users/m______________e/following",
              "followers": "https://api.unsplash.com/users/m______________e/followers"
            },
            "profile_image": {
              "small": "https://images.unsplash.com/profile-1488557507434-790fb0197775?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32",
              "medium": "https://images.unsplash.com/profile-1488557507434-790fb0197775?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64",
              "large": "https://images.unsplash.com/profile-1488557507434-790fb0197775?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128"
            },
            "instagram_username": "m_______________________e",
            "total_collections": 0,
            "total_likes": 19,
            "total_photos": 14,
            "accepted_tos": false,
            "for_hire": false,
            "social": {
              "instagram_username": "m_______________________e",
              "portfolio_url": "http://www.markeder.photography",
              "twitter_username": null,
              "paypal_email": null
            }
          }
        }
      }
    }
  ]
}
```
## Development

### Import sequence
```
//react
//next
//mui
//bloomreach sdk
//other libs
//contexts
//hooks
//hocs
//components
//types
//functions
//templates
//Component Props
//Config JSON
//Custom styled components
```
