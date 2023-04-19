import WebSocket from "ws";
import { parse } from "node-html-parser";
import got from "got";

import "dotenv/config";
import {
  decodeSession,
  generatePresenceId,
  getWebsocketSessionId,
  sendPacket,
  subscribe,
  unsubscribe,
} from "./util.js";

import got from "got";

const { USER_SESSION } = process.env;

if (!USER_SESSION) throw new Error("you need a USER_SESSION");

// get dom
const body = await got("https://github.com/Hacksore/Hacksore/actions", {
  headers: {
    Cookie: `user_session=${USER_SESSION}`,
  },
}).text();

const html = parse(body);

// get all teh things in the DOM to sub to
const elements = html.querySelectorAll(".js-socket-channel[data-channel]");

const subscriptions = elements.map((item) => ({
  id: item.attrs["data-channel"],
  description: item.attrs["data-tooltip-global"],
  url: item.attrs["data-url"],
  job: item.id
}))
// .filter(item => !item.job.includes("check_suite"));

// console.log(subscriptions)

const [event, idkYet] = decodeSession(sessionId);

// console.log("initial event", event);
// console.log("idk what this is yet", idkYet);

const jobParams = {
  commitHash: "d8a3b73ad5b6a643bd218d482b296182d8622ae8",
  // TODO: how do programmatically get this
  jobId: "9237147042",
};

// const getRunningJobs 

const getSocketUrl = async ({
  commitHash,
  jobId,
}: {
  commitHash: string;
  jobId: string;
}) => {
  let liveLogs: any;

  try {
    liveLogs = await got(
      `https://github.com/Hacksore/test/commit/${commitHash}/checks/${jobId}/live_logs`,
      {
        headers: {
          accept: "application/json",
          cookie: `user_session=${USER_SESSION}`,
        },
      }
    ).json();
  } catch (err: any) {
    console.log(err.message);
    throw new Error("could not get the live_logs response");
  }

  try {
    const url = liveLogs.data.authenticated_url;

    const res2 = await got(url, {
      headers: {
        accept: "application/json",
      },
    });

    if (res2.statusCode !== 200) {
      throw new Error("could not get the authenticated_url response");
    }

    const body = JSON.parse(res2.body);

    return body.logStreamWebSocketUrl;
  } catch (err) {
    console.log(err);
    throw new Error("Error getting authenticated_url");
  }
};

const socketUrl = await getSocketUrl(jobParams);
const rawParams = socketUrl.split("?")[1];
const params = new URLSearchParams(rawParams);
const runId = Number(params.get("runId"));
const tenantId = params.get("tenantId");

const ws = new WebSocket(socketUrl, {
  headers: {
    Host: "pipelines.actions.githubusercontent.com",
    Origin: "https://github.com",
  },
});

const sendPacket = (ws: WebSocket, packet: any) => {
  // there is some strange termination string required
  const payload = JSON.stringify(packet) + "\x1e";
  ws.send(payload);
};

ws.on("open", () => {
  console.log("Socket opened");
  sendPacket(ws, { protocol: "json", version: 1 });
  sendPacket(ws, {
    arguments: [tenantId, runId],
    target: "WatchRunAsync",
    type: 1,
  });
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
