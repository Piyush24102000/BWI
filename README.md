# BWI Assignment
This assignment is developed in Javascript, Node.js , MongoDB and Express.js

## Installation
Either send request to this deployed URL `https://innovate-blush.vercel.app` or setup in local environment
1) You should have node installed on your device.
2) Navigate to the folder and type "npm install" in the terminal of vs-code.
3) Using "npm install" all the dependencies will be installed.
4) Run the server by typing "npm start or node index.js" while in the root directory.
5) Terminal will show "Server started on port 5000".

## Features
- Used JWT token for authentication
- Used Cookies for storing tokens and data
- Used middleware
- File storing in AWS S3
- MVC Pattern
- Joi validations
- bcrypt for password hashing
    
## API Documentation
- Below are the API's , Use Postman or Insomnia for using the queries

## User API's

### POST Signup User
- **Endpoint:** `http://localhost:5000/api/users/signup`
- **Body (JSON):**
Multipart Form Data
```json
{
  "name":"Mr Bean",
  "phoneNumber":"9999955555",
  "password":"bean@123",
  "email":"bean@gmail.com",
  "profileImage" : file
}
```
### POST Login User
- **Endpoint:** `http://localhost:5000/api/users/login`
- **Body (JSON):** Token will be set after login

```json
{
  "phone_number":"9999955555",
  "password":"bean@123"
}
```
### GET View User
- **Enpoint:** `http://localhost:5000/api/users/view/:userId`

### PUT Update User
- **Endpoint:** `http://localhost:5000/api/users/update/:userId`
- **Body (JSON):**
Multipart Form Data
```json
{
  "name": "Mr X",
  "profileImage": file
}
```
### DELETE Delete User
- **Endpoint:** `http://localhost:5000/api/users/delete/:userId`

 
## Admin API's
### POST Signup Admin
Note: Only admin will be able to create another admin, So first login with this credentials
```
{
  "email": "God@gmail.com",
  "password":"God@123"
}
```
- **Endpoint:** `http://localhost:5000/api/admin/create-admin`
- **Body (JSON):** Multipart Form Data 
```json
{
  "name":"Mr Admin",
  "phoneNumber":"9696969696",
  "password":"admin@123",
  "email":"admin123@gmail.com",
  "profileImage" : file
}
```

## UserModel Collection in Database

```
{
  {
    "id" : "65901b39bbd0e28ac98ce490"
    "name" :"admin"
    "profileImage" : "https://buildwithinnovation.s3.ap-south-1.amazonaws.com/desktop-wallpa…"
    "email" : "admin@gmail.com"
    "phoneNumber" : "8329702408"
    "password" : "$2b$05$7iQgPvJJ5.DDyH4F38T2aOhjaOumO1" / Original is "admin@123" 
    "role": "Admin"
  },
  {
    "id" : "659069eb73000231e3de10f4"
    "name" :"God"
    "profileImage" : "https://buildwithinnovation.s3.ap-south-1.amazonaws.com/desktop-wallpa…"
    "email" : "God@gmail.com"
    "phoneNumber" : "9999999999"
    "password" : "$2b$05$7iQgPvJJ5.DDyH4F38T2aOhjaOumO1" / Original is "God@123" 
    "role": "Admin"
  },
  {
    "id" : "65906a6173000231e3de10f8"
    "name" :"Piyush"
    "profileImage" : "https://buildwithinnovation.s3.ap-south-1.amazonaws.com/desktop-wallpa…"
    "email" : "Piyush@gmail.com"
    "phoneNumber" : "8329702409"
    "password" : "$2b$05$7iQgPvJJ5.DDyH4F38T2aOhjaOumO1" / Original is "piyush@123"
    "role": "User"
  },
  {
    "id" : "65916074cf5dca7eaf3d3137"
    "name" :"Rajesh"
    "profileImage" : "https://buildwithinnovation.s3.ap-south-1.amazonaws.com/desktop-wallpa…"
    "email" : "Raju@gmail.com"
    "phoneNumber" : "9421512240"
    "password" : "$2b$05$7iQgPvJJ5.DDyH4F38T2aOhjaOumO1" / Original is "raju@123" 
    "role": "User"
  },
  {
    "id" : "6591b45091d94c54c513506a"
    "name" :"Napolean"
    "profileImage" : "https://buildwithinnovation.s3.ap-south-1.amazonaws.com/desktop-wallpa…"
    "email" : "napolean@gmail.com"
    "phoneNumber" : "8888888888"
    "password" : "$2b$05$7iQgPvJJ5.DDyH4F38T2aOhjaOumO1" / Original is "napolean@123" 
    "role": "Admin"
  },
}
```
## Contact
If you have any questions or suggestions, feel free to contact me at +91 8329702408 piyush20001024@gmail.com
