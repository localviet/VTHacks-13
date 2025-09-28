# Ignite
### Streamlined match between UGC creators and businesses
User-generated content is the most effective form of modern marketing—customers trust it more than ads, and it drives engagement and conversions up to 6x higher. Traditional advertising is expensive, impersonal, and increasingly ignored. But connecting with content creators manually is time consuming and difficult. That’s why we built Ignite: a platform that connects brands directly with creators to produce authentic, scalable content at a fraction of the cost of typical ads.

# Set up
1. clone the repository on to your local device.
``` git clone <repository url>```
### Backend
1. cd into the backend folder.
2. create a .env file. Add these variables:
  a. MONGO_URI (create a mongodb database and add the link to it here)
  b. PORT (any 4 digit number)
  c. ACCESS_TOKEN_SECRET (generate 64 bit hex key with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
  d. REFRESH_TOKEN_SECRET (use the same method to create another key)
3. `npm i` to install dependencies
4. npm run dev to locally host backend server.
### Frontend
1. cd into the frontend folder.
2. create a .env file. add this variable:
   a. VITE_API_URL (http link to backend)
3. `npm i` to install dependencies
4. npm run dev to locally host frontend server.

