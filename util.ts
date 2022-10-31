import got from "got";
import { WebSocket } from "ws";

const { USER_SESSION } = process.env;

export const generatePresenceId = () => {
  return `${Math.round(Math.random() * (Math.pow(2, 31) - 1))}_${Math.round(
    Date.now() / 1000
  )}`;
};

export const decodeSession = (sessionId: string) => {
  const [rawEvent, idk] = sessionId.split("--");
  const eventString = Buffer.from(rawEvent, "base64").toString("utf8");
  const event = JSON.parse(eventString);

  return [event, idk];
};

export const getWebsocketSessionId = async () => {
  const githubResponse = await got("https://github.com", {
    headers: {
      Cookie: `user_session=${USER_SESSION}`,
    },
  });

  const myRegexp = /wss:\/\/alive.github.com\/_sockets\/u\/.+?(?=")/;
  const match = myRegexp.exec(githubResponse.body);
  // @ts-ignore
  const rawParams = match[0].split("?")[1];
  const params = new URLSearchParams(rawParams);
  const sessionId = params.get("session");
  return sessionId;
}


export const sendPacket = (ws: WebSocket, packet: any) => {
  const payload = JSON.stringify(packet);
  ws.send(payload);
};

export const subscribe = (ws: WebSocket, sessionId: string) => {
  sendPacket(ws, {
    subscribe: {
      [sessionId]: "",
    },
  });
};

export const unsubscribe = (ws: WebSocket, sessionId: string) => {
  sendPacket(ws, {
    unsubscribe: [sessionId],
  });
};