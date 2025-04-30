# Chat Application API Documentation

This documentation is intended for the frontend team to explain how to interact with the chat application backend.

**API Base URL:** `https://chat-app-api-production-7f75.up.railway.app/api/v1`

**Important Note:** Accessing most endpoints requires user authentication using a JSON Web Token (JWT). The token must be sent in the request header as `Authorization: Bearer <YOUR_JWT_TOKEN>`.

## 1. Authentication

These endpoints handle user registration, login, and token acquisition.

### 1.1. Sign Up New User

*   **Endpoint:** `/auth/signup`
*   **Method:** `POST`
*   **Description:** Create a new user account.
*   **Required Headers:**
    *   `Content-Type: application/json`
*   **Request Body:**
    ```json
    {
        "username": "New Username",
        "email": "newuser@example.com",
        "password": "password",
        "passwordConfirm": "confirm password"
    }
    ```
*   **Validation:**
    *   `username`: Required, at least 3 characters.
    *   `email`: Required, must be a valid and unique email address.
    *   `password`: Required, at least 6 characters.
    *   `passwordConfirm`: Required, must match `password`.
*   **Success Response (201 Created):**
    ```json
    {
        "data": {
            "_id": "user_id",
            "username": "New Username",
            "email": "newuser@example.com",
            "role": "user",
            "active": true,
            "slug": "new-username",
            "createdAt": "creation_date",
            "updatedAt": "update_date",
            "__v": 0,
            "emailVerified": false
        },
        "token": "<EMAIL_VERIFICATION_TOKEN>"
    }
    ```
    *   **Note:** A verification code is sent to the registered email. The user must use this code to activate their account via the `/auth/verifyEmailUser` endpoint.
*   **Error Responses:**
    *   `400 Bad Request`: If input data is invalid (see Validation section) or if the email is already in use.
    ```json
    // Validation error example
    {
        "errors": [
            { "type": "field", "msg": "User name is required", "path": "username", "location": "body" },
            // ... other errors
        ]
    }
    // Email in use example
    {
        "status": "fail",
        "message": "E-mail already exists"
    }
    ```

### 1.2. Verify Email

*   **Endpoint:** `/auth/verifyEmailUser`
*   **Method:** `POST`
*   **Description:** Verify the user's email using the code sent after registration.
*   **Required Headers:**
    *   `Content-Type: application/json`
    *   `Authorization: Bearer <EMAIL_VERIFICATION_TOKEN>` (Use the token received from the signup response)
*   **Request Body:**
    ```json
    {
        "verificationCode": "verification_code_sent_to_email"
    }
    ```
*   **Validation:**
    *   `verificationCode`: Required.
*   **Success Response (200 OK):**
    ```json
    {
        "status": "success",
        "message": "Email verified successfully"
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If the verification code is invalid or expired.
    *   `401 Unauthorized`: If the token is invalid or missing.

### 1.3. Login

*   **Endpoint:** `/auth/login`
*   **Method:** `POST`
*   **Description:** Log in the user and obtain a JWT for authentication.
*   **Required Headers:**
    *   `Content-Type: application/json`
*   **Request Body:**
    ```json
    {
        "email": "user@example.com",
        "password": "password"
    }
    ```
*   **Validation:**
    *   `email`: Required, must be a valid email address.
    *   `password`: Required.
*   **Success Response (200 OK):**
    ```json
    {
        "data": {
            "_id": "user_id",
            "username": "username",
            "email": "user@example.com",
            "role": "user",
            // ... other user data
        },
        "token": "<YOUR_JWT_TOKEN>" // Use this token for authentication in subsequent requests
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If input data is invalid.
    *   `401 Unauthorized`: If the email or password is incorrect, or if the email has not been verified yet.
    ```json
    // Incorrect credentials example
    {
        "status": "fail",
        "message": "Incorrect email or password"
    }
    // Unverified email example
    {
        "status": "fail",
        "message": "Email not verified. Please check your email for verification code."
    }
    ```

### 1.4. Forgot Password

*   **Endpoint:** `/auth/forgotPassword`
*   **Method:** `POST`
*   **Description:** Send a request to reset the password. A reset code is sent to the registered email.
*   **Required Headers:**
    *   `Content-Type: application/json`
*   **Request Body:**
    ```json
    {
        "email": "user@example.com"
    }
    ```
*   **Validation:**
    *   `email`: Required, must be a valid and registered email address.
*   **Success Response (200 OK):**
    ```json
    {
        "status": "Success",
        "message": "Reset code sent to email",
        "token": "<PASSWORD_RESET_TOKEN>" // Temporary token used in the next steps
    }
    ```
*   **Error Responses:**
    *   `404 Not Found`: If no user is found with this email address.

### 1.5. Verify Password Reset Code

*   **Endpoint:** `/auth/verifyResetCode`
*   **Method:** `POST`
*   **Description:** Verify the validity of the password reset code sent to the email.
*   **Required Headers:**
    *   `Content-Type: application/json`
    *   `Authorization: Bearer <PASSWORD_RESET_TOKEN>` (Use the token received from the forgotPassword response)
*   **Request Body:**
    ```json
    {
        "resetCode": "reset_code_sent_to_email"
    }
    ```
*   **Validation:**
    *   `resetCode`: Required.
*   **Success Response (200 OK):**
    ```json
    {
        "status": "Success"
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If the code is invalid or expired.
    *   `401 Unauthorized`: If the token is invalid or missing.

### 1.6. Reset Password

*   **Endpoint:** `/auth/resetPassword`
*   **Method:** `PUT`
*   **Description:** Set a new password for the user after verifying the reset code.
*   **Required Headers:**
    *   `Content-Type: application/json`
    *   `Authorization: Bearer <PASSWORD_RESET_TOKEN>` (Use the token received from forgotPassword and verified in verifyResetCode)
*   **Request Body:**
    ```json
    {
        "newPassword": "new_password",
        "passwordConfirm": "confirm_new_password"
    }
    ```
*   **Validation:**
    *   `newPassword`: Required, at least 6 characters.
    *   `passwordConfirm`: Required, must match `newPassword`.
*   **Success Response (200 OK):**
    ```json
    {
        "token": "<NEW_JWT_TOKEN>" // New JWT token that can be used for direct login
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If input data is invalid.
    *   `401 Unauthorized`: If the token is invalid or missing.

---


## 2. Users

These endpoints relate to managing registered user data.

**Required Header for all endpoints in this section:** `Authorization: Bearer <YOUR_JWT_TOKEN>`

### 2.1. Get Logged-In User Data (Get Me)

*   **Endpoint:** `/users/getMe`
*   **Method:** `GET`
*   **Description:** Get the data of the currently logged-in user.
*   **Success Response (200 OK):**
    ```json
    {
        "data": {
            "_id": "user_id",
            "username": "username",
            "email": "user@example.com",
            "role": "user",
            "active": true,
            "slug": "username-slug",
            "emailVerified": true,
            // ... other user data
        }
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: If the token is invalid or missing.
    *   `404 Not Found`: If the user is not found (rare if the token is valid).

### 2.2. Update Logged-In User Password (Update My Password)

*   **Endpoint:** `/users/changeMyPassword`
*   **Method:** `PUT`
*   **Description:** Change the password for the currently logged-in user.
*   **Required Headers:**
    *   `Authorization: Bearer <YOUR_JWT_TOKEN>`
    *   `Content-Type: application/json`
*   **Request Body:**
    ```json
    {
        "currentPassword": "current_password",
        "password": "new_password",
        "passwordConfirm": "confirm_new_password"
    }
    ```
*   **Validation:**
    *   `currentPassword`: Required.
    *   `password`: Required, at least 6 characters.
    *   `passwordConfirm`: Required, must match `password`.
*   **Success Response (200 OK):**
    ```json
    {
        "data": { /* updated user data */ },
        "token": "<NEW_JWT_TOKEN>" // New token after password change
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If input data is invalid or the current password is incorrect.
    *   `401 Unauthorized`: If the token is invalid or missing.

### 2.3. Update Logged-In User Data (Update Me)

*   **Endpoint:** `/users/updateMe`
*   **Method:** `PUT`
*   **Description:** Update the data of the currently logged-in user (e.g., username, email).
*   **Required Headers:**
    *   `Authorization: Bearer <YOUR_JWT_TOKEN>`
    *   `Content-Type: application/json`
*   **Request Body:**
    ```json
    {
        "username": "New Username (optional)",
        "email": "newemail@example.com (optional)",
        "profileImg": "profile_image_url (optional)"
        // Password or role cannot be updated from here
    }
    ```
*   **Validation:**
    *   `username`: Optional, at least 3 characters if provided.
    *   `email`: Optional, must be a valid and unique email if provided.
*   **Success Response (200 OK):**
    ```json
    {
        "data": { /* updated user data */ }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If input data is invalid or the email is already in use.
    *   `401 Unauthorized`: If the token is invalid or missing.

### 2.4. Delete Logged-In User Account (Delete Me)

*   **Endpoint:** `/users/deleteMe`
*   **Method:** `DELETE`
*   **Description:** Deactivate (Soft Delete) the account of the currently logged-in user.
*   **Success Response (204 No Content):**
    *   No content in the response.
*   **Error Responses:**
    *   `401 Unauthorized`: If the token is invalid or missing.

---

## 3. Chat Rooms

These endpoints relate to managing group chat rooms.

**Required Header for all endpoints in this section:** `Authorization: Bearer <YOUR_JWT_TOKEN>`

### 3.1. Get Room List

*   **Endpoint:** `/rooms`
*   **Method:** `GET`
*   **Description:** Get a list of all available chat rooms.
*   **Success Response (200 OK):**
    ```json
    {
        "results": "number_of_rooms",
        "paginationResult": { /* Pagination details if applied */ },
        "data": [
            {
                "_id": "room_id",
                "name": "Room Name",
                "description": "Room Description",
                "owner": "room_owner_id",
                "users": ["user_ids_in_room"],
                "slug": "room-name-slug",
                "createdAt": "creation_date",
                "updatedAt": "update_date"
            },
            // ... other rooms
        ]
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: If the token is invalid or missing.

### 3.2. Create New Room

*   **Endpoint:** `/rooms`
*   **Method:** `POST`
*   **Description:** Create a new chat room.
*   **Required Headers:**
    *   `Authorization: Bearer <YOUR_JWT_TOKEN>`
    *   `Content-Type: application/json`
*   **Request Body:**
    ```json
    {
        "name": "New Room Name",
        "description": "Room description (optional)"
    }
    ```
*   **Validation:**
    *   `name`: Required, at least 3 characters.
*   **Success Response (201 Created):**
    ```json
    {
        "data": { /* new room data */ }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If input data is invalid.
    *   `401 Unauthorized`: If the token is invalid or missing.

### 3.3. Get Specific Room Data

*   **Endpoint:** `/rooms/:id` (Replace `:id` with the room ID)
*   **Method:** `GET`
*   **Description:** Get the details of a specific chat room.
*   **Success Response (200 OK):**
    ```json
    {
        "data": { /* requested room data */ }
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: If the token is invalid or missing.
    *   `404 Not Found`: If no room is found with the specified ID.

### 3.4. Update Specific Room

*   **Endpoint:** `/rooms/:id` (Replace `:id` with the room ID)
*   **Method:** `PUT`
*   **Description:** Update the data of a specific chat room (only the room owner or admin can update).
*   **Required Headers:**
    *   `Authorization: Bearer <YOUR_JWT_TOKEN>`
    *   `Content-Type: application/json`
*   **Request Body:**
    ```json
    {
        "name": "New Room Name (optional)",
        "description": "New Room Description (optional)"
    }
    ```
*   **Validation:**
    *   `name`: Optional, at least 3 characters if provided.
*   **Success Response (200 OK):**
    ```json
    {
        "data": { /* updated room data */ }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If input data is invalid.
    *   `401 Unauthorized`: If the token is invalid or missing.
    *   `403 Forbidden`: If the user is not the room owner or an admin.
    *   `404 Not Found`: If no room is found with the specified ID.

### 3.5. Delete Specific Room

*   **Endpoint:** `/rooms/:id` (Replace `:id` with the room ID)
*   **Method:** `DELETE`
*   **Description:** Delete a specific chat room (only the room owner or admin can delete).
*   **Success Response (204 No Content):**
    *   No content in the response.
*   **Error Responses:**
    *   `401 Unauthorized`: If the token is invalid or missing.
    *   `403 Forbidden`: If the user is not the room owner or an admin.
    *   `404 Not Found`: If no room is found with the specified ID.

### 3.6. Join Room

*   **Endpoint:** `/rooms/join/:id` (Replace `:id` with the room ID)
*   **Method:** `POST`
*   **Description:** The current user joins a specific chat room.
*   **Success Response (200 OK):**
    ```json
    {
        "message": "User joined the room successfully",
        "data": { /* updated room data with the new user */ }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If the user is already in the room.
    *   `401 Unauthorized`: If the token is invalid or missing.
    *   `404 Not Found`: If no room is found with the specified ID.

### 3.7. Leave Room

*   **Endpoint:** `/rooms/leave/:id` (Replace `:id` with the room ID)
*   **Method:** `POST`
*   **Description:** The current user leaves a specific chat room.
*   **Success Response (200 OK):**
    ```json
    {
        "message": "User left the room successfully",
        "data": { /* updated room data without the leaving user */ }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If the user is not a member of the room.
    *   `401 Unauthorized`: If the token is invalid or missing.
    *   `404 Not Found`: If no room is found with the specified ID.

### 3.8. Get Users in Room

*   **Endpoint:** `/rooms/getUsers/:id` (Replace `:id` with the room ID)
*   **Method:** `GET`
*   **Description:** Get a list of users currently in a specific chat room.
*   **Success Response (200 OK):**
    ```json
    {
        "data": [
            { /* first user data */ },
            { /* second user data */ },
            // ...
        ]
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: If the token is invalid or missing.
    *   `404 Not Found`: If no room is found with the specified ID.

---

## 4. Messages (in Rooms)

These endpoints relate to managing messages within group chat rooms. Messages are primarily sent and received via Socket.IO, but these endpoints can be used for retrieving history or managing individual messages.

**Required Header for all endpoints in this section:** `Authorization: Bearer <YOUR_JWT_TOKEN>`

### 4.1. Create New Message in Room

*   **Endpoint:** `/messages`
*   **Method:** `POST`
*   **Description:** Send a new message to a specific chat room. (Using the `message:send` event via Socket.IO is preferred for this).
*   **Required Headers:**
    *   `Authorization: Bearer <YOUR_JWT_TOKEN>`
    *   `Content-Type: application/json`
*   **Request Body:**
    ```json
    {
        "roomId": "target_room_id",
        "content": "message_content"
    }
    ```
*   **Validation:**
    *   `roomId`: Required, must be a valid room ID.
    *   `content`: Required.
*   **Success Response (201 Created):**
    ```json
    {
        "data": { /* new message data */ }
    }
    ```
    *   **Note:** This message will also be broadcast to all users in the room via the `message:new` event on Socket.IO.
*   **Error Responses:**
    *   `400 Bad Request`: If input data is invalid.
    *   `401 Unauthorized`: If the token is invalid or missing.
    *   `404 Not Found`: If the room is not found with the specified ID.

### 4.2. Get Specific Message

*   **Endpoint:** `/messages/:id` (Replace `:id` with the message ID)
*   **Method:** `GET`
*   **Description:** Get the details of a specific message.
*   **Success Response (200 OK):**
    ```json
    {
        "data": { /* requested message data */ }
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: If the token is invalid or missing.
    *   `404 Not Found`: If no message is found with the specified ID.

### 4.3. Update Specific Message

*   **Endpoint:** `/messages/:id` (Replace `:id` with the message ID)
*   **Method:** `PUT`
*   **Description:** Update the content of a specific message (only the message sender can update).
*   **Required Headers:**
    *   `Authorization: Bearer <YOUR_JWT_TOKEN>`
    *   `Content-Type: application/json`
*   **Request Body:**
    ```json
    {
        "content": "new_message_content"
    }
    ```
*   **Validation:**
    *   `content`: Required.
*   **Success Response (200 OK):**
    ```json
    {
        "data": { /* updated message data */ }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If input data is invalid.
    *   `401 Unauthorized`: If the token is invalid or missing.
    *   `403 Forbidden`: If the user is not the sender of the message.
    *   `404 Not Found`: If no message is found with the specified ID.

### 4.4. Delete Specific Message

*   **Endpoint:** `/messages/:id` (Replace `:id` with the message ID)
*   **Method:** `DELETE`
*   **Description:** Delete a specific message (only the message sender or admin can delete).
*   **Success Response (204 No Content):**
    *   No content in the response.
*   **Error Responses:**
    *   `401 Unauthorized`: If the token is invalid or missing.
    *   `403 Forbidden`: If the user is not the sender of the message or an admin.
    *   `404 Not Found`: If no message is found with the specified ID.

---

## 5. Private Messages

These endpoints relate to managing private messages between specific users.

**Required Header for all endpoints in this section:** `Authorization: Bearer <YOUR_JWT_TOKEN>`

### 5.1. Create New Private Message

*   **Endpoint:** `/messages/private`
*   **Method:** `POST`
*   **Description:** Send a new private message to another user. (Using the `private:send` event via Socket.IO is preferred for this).
*   **Required Headers:**
    *   `Authorization: Bearer <YOUR_JWT_TOKEN>`
    *   `Content-Type: application/json`
*   **Request Body:**
    ```json
    {
        "recipientId": "recipient_user_id",
        "content": "private_message_content"
    }
    ```
*   **Validation:**
    *   `recipientId`: Required, must be a valid user ID.
    *   `content`: Required.
*   **Success Response (201 Created):**
    ```json
    {
        "data": { /* new private message data */ }
    }
    ```
    *   **Note:** This message will also be sent to the recipient user via the `private:new` event on Socket.IO.
*   **Error Responses:**
    *   `400 Bad Request`: If input data is invalid.
    *   `401 Unauthorized`: If the token is invalid or missing.
    *   `404 Not Found`: If the recipient user is not found with the specified ID.

### 5.2. Get Specific Private Message

*   **Endpoint:** `/messages/private/:id` (Replace `:id` with the private message ID)
*   **Method:** `GET`
*   **Description:** Get the details of a specific private message (only the sender or recipient can retrieve it).
*   **Success Response (200 OK):**
    ```json
    {
        "data": { /* requested private message data */ }
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: If the token is invalid or missing.
    *   `403 Forbidden`: If the user is not the sender or recipient of the message.
    *   `404 Not Found`: If no private message is found with the specified ID.

### 5.3. Update Specific Private Message

*   **Endpoint:** `/messages/private/:id` (Replace `:id` with the private message ID)
*   **Method:** `PUT`
*   **Description:** Update the content of a specific private message (only the message sender can update).
*   **Required Headers:**
    *   `Authorization: Bearer <YOUR_JWT_TOKEN>`
    *   `Content-Type: application/json`
*   **Request Body:**
    ```json
    {
        "content": "new_private_message_content"
    }
    ```
*   **Validation:**
    *   `content`: Required.
*   **Success Response (200 OK):**
    ```json
    {
        "data": { /* updated private message data */ }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If input data is invalid.
    *   `401 Unauthorized`: If the token is invalid or missing.
    *   `403 Forbidden`: If the user is not the sender of the message.
    *   `404 Not Found`: If no private message is found with the specified ID.

### 5.4. Delete Specific Private Message

*   **Endpoint:** `/messages/private/:id` (Replace `:id` with the private message ID)
*   **Method:** `DELETE`
*   **Description:** Delete a specific private message (only the message sender can delete).
*   **Success Response (204 No Content):**
    *   No content in the response.
*   **Error Responses:**
    *   `401 Unauthorized`: If the token is invalid or missing.
    *   `403 Forbidden`: If the user is not the sender of the message.
    *   `404 Not Found`: If no private message is found with the specified ID.

---

## 6. Chat History

These endpoints are used to retrieve the history of previous messages in rooms or private conversations.

**Required Header for all endpoints in this section:** `Authorization: Bearer <YOUR_JWT_TOKEN>`

### 6.1. Get Room Chat History

*   **Endpoint:** `/chats`
*   **Method:** `GET`
*   **Description:** Get the message history for a specific chat room.
*   **Query Parameters:**
    *   `roomId` (Required): The ID of the room whose chat history is requested.
    *   `page` (Optional): Page number for pagination.
    *   `limit` (Optional): Number of messages per page.
*   **Success Response (200 OK):**
    ```json
    {
        "results": "number_of_messages",
        "paginationResult": { /* pagination details */ },
        "data": [
            { /* oldest message data */ },
            { /* newest message data */ },
            // ...
        ]
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If `roomId` is missing or invalid.
    *   `401 Unauthorized`: If the token is invalid or missing.
    *   `404 Not Found`: If the room is not found.

### 6.2. Get Private Chat History

*   **Endpoint:** `/chats/private`
*   **Method:** `GET`
*   **Description:** Get the private message history between the current user and another specific user.
*   **Query Parameters:**
    *   `recipientId` (Required): The ID of the other user whose private chat history is requested.
    *   `page` (Optional): Page number for pagination.
    *   `limit` (Optional): Number of messages per page.
*   **Success Response (200 OK):**
    ```json
    {
        "results": "number_of_messages",
        "paginationResult": { /* pagination details */ },
        "data": [
            { /* oldest private message data */ },
            { /* newest private message data */ },
            // ...
        ]
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If `recipientId` is missing or invalid.
    *   `401 Unauthorized`: If the token is invalid or missing.
    *   `404 Not Found`: If the other user is not found.

---

## 7. Real-time Communication (Socket.IO)

The application uses Socket.IO to allow real-time communication and interaction between users (e.g., sending and receiving instant messages, typing indicators).

**Socket.IO Server URL:** `wss://chat-app-api-production-7f75.up.railway.app`

**Important Note:** There is currently an issue connecting to the deployed WebSocket server on Railway (HTTP 502 error). This issue must be resolved on the backend side to enable real-time functionality. This documentation assumes the connection works as expected based on the source code.

### 7.1. Connecting to the Server and Authentication

The client (frontend) must establish a Socket.IO connection to the server.

```javascript
// Example using socket.io-client library
import io from 'socket.io-client';

const socket = io('wss://chat-app-api-production-7f75.up.railway.app', {
  // Additional options if needed
  // !!! Important: Authentication mechanism is not entirely clear in the current code !!!
  // You might need to send the JWT token as part of the connection options
  // or via a custom event after connection. This needs clarification from the backend team.
  // Possible example (verify the correct method):
  auth: {
    token: "<YOUR_JWT_TOKEN>"
  }
});

socket.on('connect', () => {
  console.log('Connected to Socket.IO server:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected from Socket.IO server:', reason);
});

socket.on('error', (error) => {
  console.error('Socket.IO Error:', error);
  // Handle errors received from the server
});
```

**Point for Review:** The mechanism for authenticating the Socket.IO connection and setting `socket.user` on the backend needs precise clarification and documentation. The most common method is sending the JWT token upon connection.

### 7.2. Events Emitted from Client to Server (Client -> Server)

The client emits these events to perform specific actions.

*   **`room:join`**: To join a specific chat room.
    *   **Required Data:** `{ roomId: string }`
    *   **Example:** `socket.emit('room:join', { roomId: 'target_room_id' });`
    *   **Note:** Must join the room to receive messages from it.

*   **`message:send`**: To send a message to a chat room.
    *   **Required Data:** `{ roomId: string, content: string }`
    *   **Example:** `socket.emit('message:send', { roomId: 'room_id', content: 'message_content' });`
    *   **Note:** The user must have joined the room first. The server will save the message and broadcast it to all members in the room (including the sender) via the `message:new` event.

*   **`private:send`**: To send a private message to another user.
    *   **Required Data:** `{ recipientId: string, content: string }`
    *   **Example:** `socket.emit('private:send', { recipientId: 'recipient_user_id', content: 'private_message_content' });`
    *   **Note:** The server will save the message and send it to the recipient (if connected) via the `private:new` event.

*   **`typing:start`**: To indicate that the user has started typing (in a room or private chat).
    *   **Required Data:** `{ contextId: string, type: 'room' | 'private' }` (The names `contextId` and `type` are assumed and need confirmation from the backend; it might be `roomId` or `recipientId` directly).
    *   **Example:** `socket.emit('typing:start', { contextId: 'room_or_recipient_id', type: 'room' });`

*   **`typing:stop`**: To indicate that the user has stopped typing.
    *   **Required Data:** `{ contextId: string, type: 'room' | 'private' }` (Same note as `typing:start`).
    *   **Example:** `socket.emit('typing:stop', { contextId: 'room_or_recipient_id', type: 'room' });`

### 7.3. Events Received from Server by Client (Server -> Client)

The client listens for these events to receive updates from the server.

*   **`connect`**: Fired upon successful connection to the server.
*   **`disconnect`**: Fired upon disconnection from the server.
*   **`error`**: Fired when a server-side error related to a Socket.IO operation occurs (e.g., failed to join room, invalid code, etc.).
    *   **Data Received:** `string` (error message)
    *   **Example:** `socket.on('error', (errorMessage) => { console.error('Server Error:', errorMessage); });`

*   **`message:new`**: Fired when a new message is received in a room the user has joined.
    *   **Data Received:** `{ roomId: string, userId: string, content: string, username: string, timestamp: Date }`
    *   **Example:** `socket.on('message:new', (message) => { console.log('New room message:', message); // Display message in UI });`

*   **`private:new`**: Fired when a new private message addressed to the user is received.
    *   **Data Received:** `{ senderId: string, recipientId: string, content: string, username: string, timestamp: Date }`
    *   **Example:** `socket.on('private:new', (message) => { console.log('New private message:', message); // Display private message });`

*   **`typing:indicator`**: Fired when an update about another user's typing status is received in the same room or private chat.
    *   **Data Received:** `{ userId: string, username: string, isTyping: boolean, contextId: string, type: 'room' | 'private' }` (Data needs exact confirmation from the backend).
    *   **Example:** `socket.on('typing:indicator', (typingInfo) => { // Update UI to show/hide typing indicator for the specific user });`

---

