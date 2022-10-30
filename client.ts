import WebSocket from "ws";
import "dotenv/config";

const { USER_ID, SESSION_ID } = process.env;

if (!SESSION_ID) throw new Error("SESSION_ID must be set");
if (!USER_ID) throw new Error("USER_ID must be set");

const ws = new WebSocket(
  `wss://alive.github.com/_sockets/u/${USER_ID}/ws?session=${SESSION_ID}`,
  {
    host: "alive.github.com",
    origin: "https://github.com",
    headers: {
      "Cookie:": "_octo=GH1.1.494326951.1666844443; preferred_color_mode=dark; tz=America%2FChicago; color_mode=%7B%22color_mode%22%3A%22dark%22%2C%22light_theme%22%3A%7B%22name%22%3A%22light%22%2C%22color_mode%22%3A%22light%22%7D%2C%22dark_theme%22%3A%7B%22name%22%3A%22dark%22%2C%22color_mode%22%3A%22dark%22%7D%7D; logged_in=yes; dotcom_user=Hacksore",
      "Sec-WebSocket-Key": "ligma",
      "Sec-WebSocket-Version": 13,
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Safari/605.1.15",
    },
  }
);

const sendPacket = (ws: WebSocket, packet: any) => {
  ws.send(JSON.stringify(packet));
};

const subscribe = (ws: WebSocket, sessionId: string) => {
  console.log("Subscribing to:", sessionId);
  sendPacket(ws, {
    subscribe: {
      [sessionId]: "",
    },
  });
};

const unsubscribe = (ws: WebSocket, sessionId: string) => {
  console.log("Unsubscribing to:", sessionId);
  sendPacket(ws, {
    unsubscribe: [sessionId],
  });
};

ws.on("open", () => {
  console.log("Socket opened");  
  subscribe(ws, SESSION_ID);
  // sendPacket(ws, {test: 1});
  
  // Figure out what other packets we can send
});

// print out all messages
ws.on("message", (data) => {
  console.log(data.toString());
});

// print out all messages
ws.on("close", (errorCode) => {
  console.log(`Socket closed with code ${errorCode}`);
});
