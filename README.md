### Real-Time Chat App API 

#####  This is a real-time chat application built using Node.js, Express, Socket.IO, and MongoDB. It supports multiple chat rooms, private messaging, user authentication, and real-time notifications.

#### Features:
- User Authentication: Register, login, and secure routes using JWT-based authentication.
- Chat Rooms: Users can join chat rooms and send/receive messages in real-time.
- Private Messaging: Send direct messages to other users.
- Real-time Notifications: See when a user is typing and receive real-time messages.
- Chat History: Retrieve chat history for both rooms and private conversations.

#### Tech Stack
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Real-time Communication: Socket.IO for WebSocket connections
- Authentication: JWT (JSON Web Tokens)
- Database: MongoDB

### Installation

- ##### Prerequisites
  - [Node.js](https://nodejs.org/) (v14.x or higher)
  - [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
  - [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas)

- ##### Clone the Repository

  ```bash
  git clone https://github.com/MennaAllahZakaria/chat-app-api.git 
  cd chat-app-api
  ```

- Install Dependencies

```bash
npm install
# or
yarn install
 ```

- ##### Set Up Environment Variables
Create a .env file in the root directory and add the following:
```plaintext
PORT=5000
BASE_URL=http://localhost:5000.
NODE_ENV=development
DB_USER=your data base user 
DB_PASSWORD=data base password
DB_NAME=data base name
DB_URI=data base url

SALT=Salt number

JWT_SECRET=jwt secret string
JWT_EXPIRE_IN=90d

```
- ##### Running the Server
Start the server using:
```bash
npm start
# or
yarn start

```

- Access the app at http://localhost:5000.

- ----------------

### API Endpoints
##### Authentication
`POST /api/v1/auth/signup`
Create a new user.
Payload: `{ "username": "string", "email": "string", "password": "string" }`

`POST /api/v1/auth/login`
Log in an existing user.
Payload:` { "email": "string", "password": "string" }`

`POST /api/v1/auth/forgotPassword`
Forgot password

`POST /api/v1/auth/verifyResetCode`
verify Password Reset Code 
Payload: `{ "code": "string" }`

`POST /api/v1/auth/resetPassword `
reset Password 
Payload: `{ "password": "string" }`

- ----------------

##### User Management (Admin & Logged Users)
`POST  /api/v1/users`
Create user  (Only Admin or manager)
Payload: `{ "username": "string", "email": "email", "phone":"number","password":"string","passwordConfirm":"string"}`

` GET /api/v1/users/:id` 
Get specific User by id (Only Admin or manager)

`GET /api/v1/users`
Get list of users  (Only Admin or manager)

`PUT /api/v1/users/:id`
Update specific User (Only Admin or manager)
Payload: `{ "username": "string", "email": "email", "phone":"number","password":"string","passwordConfirm":"string"}`

`DELETE /api/v1/users/changePassword/:id`
Change user password (Only Logged User)
Payload: `{"currentPassword":"string", "password":"string","passwordConfirm":"string"}`

`DELETE /api/v1/users/:id`
Delete specific User  (Only Admin)

`GET /api/v1/users/getMe`
Get logged user data (Only Logged User)

`PUT /api/v1/users/updateMyPassword`
Update user password  (Only Logged User)
Payload:`{"currentPassword":"string", "password":"string","passwordConfirm":"string"}`

`PUT /api/v1/users/updateMe`
Update logged user data without [password,role] (Only Logged User)

Payload: `{ "username": "string", "email": "email", "phone":"number"`


`PUT /api/v1/users/deleteMe`
Deactvate logged user (Only Logged User)

- ----------------

##### Rooms
`POST  /api/v1/rooms`
Create room 
Payload: `{ "name": "string", "description": "string"}`

`GET /api/v1/rooms/:id`
Get specific room by id 

`GET /api/v1/rooms`
Get list of rooms 

`PUT /api/v1/rooms/:id`
Update specific room 
Payload: `{ "name": "string", "description": "string" }`

`DELETE /api/v1/rooms/:id`
Delete specific room 

- ----------------

##### Messages

###### Rooms messages
`POST  /api/v1/messages`
Create message 
Payload: `{ "userId": "string", "roomId": "string","content":"string"}`

`GET /api/v1/messages/:id`
Get specific message by id 

`GET /api/v1/messages`
Get list of messages 

`PUT /api/v1/messages/:id`
Update specific message 
Payload: `{ "userId": "string", "roomId": "string","content":"string"}`

`DELETE /api/v1/messages/:id`
Delete specific message 

- ----------------

###### Private messages
`POST  /api/v1/messages/private`
Create private message 
Payload: `{ "senderId": "string", "recipientId": "string","content":"string"}`

`GET /api/v1/messages/private/:id`
Get specific private message by id 

`GET /api/v1/messages/private`
Get list of private messages 

`PUT /api/v1/messages/private/:id`
Update specific private message 
Payload: `{"content":"string"}`

`DELETE /api/v1/messages/private/:id`
Delete specific private message 

- ----------------

##### Chat History
`GET /api/v1/chats/`

Retrieve chat history for a specific room.
Requires Authentication

`GET /api/v1/chats/private/`

Retrieve private chat history between the logged-in user and another user.
Requires Authentication

- ----------------

##### WebSocket Events
- ##### Room Events
  - ##### room

      Join a chat room.
      Payload: `{ "roomId": "string" }`

  - message

      Send a message to a room.
      Payload: `{ "roomId": "string", "content": "string" }`

  - message

    Receive messages in real-time for a room.
    Payload: `{ "roomId": "string", "content": "string", "userId": "string", "timestamp": "Date" }`

- ----------------

- ##### Private Messaging Events
  - private

      Send a private message to another user.
      Payload: `{ "recipientId": "string", "content": "string" }`

  - private

      Receive a private message.
      Payload: `{ "senderId": "string", "content": "string", "timestamp": "Date" }`

- ----------------

- ##### Typing Indicator
  - typing

      Triggered when a user starts typing.
      Payload: `{ "roomId": "string" }`

  - typing

      Triggered when a user stops typing.
      Payload: `{ "roomId": "string" }`

- ----------------

- ##### Usage
  - Room Messaging: Users can join rooms, send real-time messages, and view message history for the room.
  - Private Messaging: Users can send direct messages to other users and retrieve message history between them.
  - Typing Indicator: See when someone is typing in a room.

- ----------------

### Contributing
Contributions are welcome! Please follow these steps:

- 1) Fork the repository.
- 2) Create a new branch (git checkout -b feature/your-feature-name).
- 3) Make your changes.
Commit your changes (git commit -m 'Add some feature').
- 4) Push to the branch (git push origin feature/your-feature-name).
- 5) Create a Pull Request.
