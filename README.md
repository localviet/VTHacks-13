# Ignite
### Streamlined match between UGC creators and businesses
User-generated content is the most effective form of modern marketing—customers trust it more than ads, and it drives engagement and conversions up to 6x higher. Traditional advertising is expensive, impersonal, and increasingly ignored. But connecting with content creators manually is time consuming and difficult. That’s why we built Ignite: a platform that connects brands directly with creators to produce authentic, scalable content at a fraction of the cost of typical ads.

# Set up
1. clone the repository on to your local device.
``` git clone <repository url>```
### Backend
1. cd into the backend folder.
2. create a .env file. Add these variables:
```
MONGO_URI = <Your mongodb URI here>
PORT = <any 4 digit number>
ACCESS_TOKEN_SECRET = <(generate 64 bit hex key with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")>
REFRESH_TOKEN_SECRET = <(use the same method to create another key)>
```
4. `npm i` to install dependencies
5. to locally host backend server.
```
npm run dev 
```
### Frontend
1. cd into the frontend folder.
2. create a .env file. add this variable:
```
VITE_API_URL = <http link to backend>
```
4. `npm i` to install dependencies
5. To locally host frontend server:
```
npm run dev
```
# Project Structure
.
└── VTHacks-13/
    ├── backend/                     #to host backend server
    │   ├── config/                  #connect to Mongodb database
    │   ├── controllers/             #controllers for the API endpoints
    │   ├── models/                  #Mongodb models for objects
    │   ├── node_modules/            #dependencies
    │   └── routes/                  #API endpoints
    ├── frontend/                    #to host frontend server
    │   ├── node_modules/            #dependencies 
    │   ├── public/                  #contains logo
    │   └── src/                     #contains code for project
    │       ├── assets/              #unimportant React sample svg
    │       ├── components/          #React components
    │       └── pages/               #web pages
    │           └── Business/        #web pages for businesses
