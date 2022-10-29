import WebSocket from "ws";
import "dotenv/config";

const { USER_ID, SESSION_ID } = process.env;

if (!SESSION_ID) throw new Error("SESSION_ID must be set");
if (!USER_ID) throw new Error("USER_ID must be set");

const ws = new WebSocket(
  `wss://alive.github.com/_sockets/u/${USER_ID}/ws?session=${SESSION_ID}`
);

ws.on("open", () => {
  // send the handshake packet
  ws.send(
    JSON.stringify({
      subscribe: {
        [SESSION_ID]: "",
      },
    })
  );
});

ws.on("message", (data) => {
  console.log(data.toString());
});
