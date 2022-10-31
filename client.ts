import WebSocket from "ws";

import "dotenv/config";
import {
  decodeSession,
  generatePresenceId,
  getWebsocketSessionId,
  sendPacket,
  subscribe,
} from "./util.js";

const { USER_ID, USER_SESSION } = process.env;

if (!USER_SESSION) throw new Error("USER_SESSION must be set");
if (!USER_ID) throw new Error("USER_ID must be set");

const sessionId = await getWebsocketSessionId();
if (!sessionId) {
  throw new Error("Could not find a sessionId from github");
}

const [event, idkYet] = decodeSession(sessionId);

console.log("initial event", event);
console.log("idk what this is yet", idkYet);

const socketUrl = `wss://alive.github.com/_sockets/u/${USER_ID}/ws?session=${sessionId}&shared=false&p=${generatePresenceId()}.0`;

const ws = new WebSocket(socketUrl, {
  host: "alive.github.com",
  origin: "https://github.com",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Safari/605.1.15",
  },
});

ws.on("open", () => {
  console.log("Socket opened");

  const subPayload = {
    c: `notification-changed:${USER_ID}`,
    t: Math.floor(Date.now() / 1000),
  };
  const subPayloadBase64 = Buffer.from(JSON.stringify(subPayload)).toString(
    "base64"
  );

  console.log(subPayload, subPayloadBase64);
  sendPacket(ws, {
    subscribe: {
      [`${subPayloadBase64}--<idk what this is>`]: "",
    },
  });
});

// print out all messages
ws.on("message", (data) => {
  console.log(data.toString());
});

// print out all messages
ws.on("close", (errorCode) => {
  console.log(`Socket closed with code ${errorCode}`);
});
