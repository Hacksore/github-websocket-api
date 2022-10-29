import WebSocket from "ws";
import "dotenv/config";

const { USER_ID, SESSION_ID } = process.env;

if (!SESSION_ID) throw new Error("SESSION_ID must be set");
if (!USER_ID) throw new Error("USER_ID must be set");

const ws = new WebSocket(
  `wss://alive.github.com/_sockets/u/${USER_ID}/ws?session=${SESSION_ID}`,
  {
    origin: "https://github.com",
    headers: {
      "User-Agent":
        "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Safari/605.1.15",
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
