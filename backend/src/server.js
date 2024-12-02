import express from 'express';
import http from 'http';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import { GeneratePassword, GenerateSalt, GenerateSignature } from './utils/password.js';
import { decryptMessage, encryptMessage } from './utils/handleMessages.js';
dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT;


const server = http.createServer(app);
const wss = new WebSocketServer({ port: 8080 });

const users = {}; // Mock database for simplicity
const connections = {};
const messageData = [];

app.use(express.json());

// Registration Endpoint
app.post('/register', async (req, res) => {

  try {
    const userInputs = req.body;

    const { username, password } = userInputs;
    if (users[ username ]) {
      return res.status(400).send('User already exist!');
    }
    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    const body = req.body;
    body.password = userPassword;
    body.salt = salt;
    const result = await this.interactor.createUser(body);

    //Generate the Signature
    const signature = await GenerateSignature({
      id: result.id,
      email: result.email,
    });

    // Send the result
    return res.status(201).json({ signature, email: result.email });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Login Endpoint
app.post('/login', async (req, res) => {
  const userInputs = req.body;
  const { username, password } = userInputs;
  try {
    const user = users[ username ];
    if (!user) {
      return res.status(401).send('Invalid credentials');
    }
    if (user) {
      const validation = await ValidatePassword(password, user.password, user.salt);

      if (validation) {

        const signature = await GenerateSignature({
          id: user.id,
          email: user.email,
        });

        return res.status(200).json({
          signature,
          email: user.email
        });
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// WebSocket Authentication and Messaging
wss.on('connection', (ws) => {
  let user;
  let secretKey;

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    // Authentication
    if (data.type === 'authenticate') {
      try {
        const payload = jwt.verify(data.token, process.env.SECRET_KEY);
        user = payload.username;
        secretKey = crypto.randomBytes(32).toString('hex'); // Generate secret key for AES encryption
        connections[ user ] = { ws, secretKey };
        ws.send(JSON.stringify({ type: 'authenticated', message: 'Authentication successful' }));
      } catch (error) {
        ws.send(JSON.stringify({ type: 'error', message: 'Authentication failed' }));
        ws.close();
      }
    }

    // Handle encrypted message
    else if (data.type === 'message') {
      const { recipient, content } = data;
      const encryptedMessage = encryptMessage(content, secretKey); // Encrypt message before storing

      // Save the encrypted message to the database
      const message = {
        sender: user,
        recipient,
        encryptedMessage
      };

      messageData.push(message);

      // Relay message to recipient
      const recipientConnection = connections[ recipient ];
      if (recipientConnection) {
        recipientConnection.ws.send(JSON.stringify({
          sender: user,
          encryptedMessage
        }));
      } else {
        ws.send(JSON.stringify({ type: 'error', message: 'Recipient not connected' }));
      }
    }


    // Broadcast the message to all connected clients
    Object.keys(connections).forEach((username) => {
      if (connections[ username ].ws !== ws) {
        // Send the encrypted message to each connected client
        connections[ username ].ws.send(JSON.stringify({
          sender: user,
          encryptedMessage
        }));
      }

      // Handle fetching encrypted messages from DB (optional feature)
      else if (data.type === 'fetchMessages') {
        Message.find({ recipient: user })
          .then((messages) => {
            const decryptedMessages = messages.map(msg => ({
              sender: msg.sender,
              message: decryptMessage(msg.encryptedMessage, secretKey) // Decrypt before returning
            }));
            ws.send(JSON.stringify({ type: 'messages', messages: decryptedMessages }));
          })
          .catch(err => {
            ws.send(JSON.stringify({ type: 'error', message: 'Error fetching messages' }));
            console.error(err);
          });
      }
    });

    ws.on('close', () => {
      if (user) delete connections[ user ];
    });
  });
});

server.listen(PORT, () => console.log(`Server running on port ${ PORT }`));























// // const users = new Map();

// // // const getRandomInt = (min, max) => {
// // //   min = Math.ceil(min);
// // //   max = Math.floor(max);
// // //   return Math.floor(Math.random() * (max - min) + min);
// // // };

// // // const generateUsername = () => {
// // //   return `User#${ getRandomInt(1, 99999) }`;
// // // };

// // webSocketServer.on("connection", (ws) => {
// //   // generate new user
// //   // isAuthenticated;

// //   const newUser = { username: generateUsername() };
// //   // store mapping from web socket to username
// //   users.set(ws, newUser);

// //   // set username for new user
// //   ws.send(
// //     JSON.stringify({
// //       type: "update_own_user",
// //       data: newUser,
// //     })
// //   );

// //   // send new users for all currently active users
// //   for (const client of webSocketServer.clients) {
// //     client.send(
// //       JSON.stringify({
// //         type: "update_users",
// //         data: [ ...users.values() ],
// //       })
// //     );
// //   }

// //   // when we get message from user
// //   ws.on("message", (message) => {
// //     // log it to output

// //     console.log("received: %s", message);
// //     const parsedMessage = JSON.parse(message);

// //     const newMessageEvent = { type: "new_message", data: parsedMessage };
// //     // send to all other users
// //     for (const client of webSocketServer.clients) {
// //       client.send(JSON.stringify(newMessageEvent));
// //     }
// //     newMessageEvent.data = "";
// //   });

// //   ws.on("close", () => {
// //     // remove user from users array
// //     for (const otherWs of users.keys()) {
// //       if (ws === otherWs) {
// //         delete users.delete(otherWs);
// //         break;
// //       }
// //     }
// //   });
// // });
