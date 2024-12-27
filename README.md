# Social-Media-App
A full-stack MERN application built with React (using Vite for the development environment), Redux Toolkit for state management, an Express.js and Node.js backend, and MongoDB as the database.

Steps to Start the Client Server Locally
     1. mkdir into client
     2. create a .env file inside the client root folder
          Inside .env add the below code
          VITE_API_URL= "http://localhost:5000/api" 
     
     3. npm install
     4. npm run dev
         server will start at http://localhost:5173/


Steps to Start the Backend Server Locally
     1. mkdir into server
     2. create a .env file inside the client root folder
         Inside .env add the below code
         MONGOURI=mongodb+srv://sandeepm1298:TL3T34VgVDs4M14u@social-media-demo.ftugq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority (Replace with your own Mongo URI)
         JWT_SECRET=sandeep1298abilash1298 (Replace with Your Secret Key)
     
     3. npm install
     4. npm start
         server will start at 5000 Port no.

Login Credentials 1
Email - sam@gmail.com
password - sandeep

Login Credentials 2
Email - rock@gmail.com
password - sandeep


Code Flow:
1. To begin, you need to either log in or register an account.
2. After a successful login or registration, you will be redirected to the Home Page. Here, you can view posts created by other users along with the comments on those posts.
3. You can like, dislike, or comment on other users' posts.
4. You can also create your own posts by clicking the "Create Post" button in the header and filling out the provided form.
5. Only the user who created a post has the ability to update or delete it.
6. To log out, hover over the user icon in the header and click the Logout button.
