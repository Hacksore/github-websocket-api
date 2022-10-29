# github-websocket-api

Github has an undocumented websocket API hosted on `alive.github.com`.

### Events

Update on workflow runs

`ack` packet

```json
{
  "e": "ack",
  "off": "1667055219967-0",
  "health": true
}
```

`subscribe` packet

```json
{
  "subscribe": {
    "<sessionId>": ""
  }
}
```

`unsubscribe` packet

```json
{
  "unsubscribe": ["<sessionId>"]
}
```

`notification-changed` packet

```json
{
  "e": "msg",
  "ch": "notification-changed:<userId>",
  "off": "1667056418489-0",
  "data": { "indicator_mode": "none", "wait": 371.57200000000006 }
}
```

`check_suites` packet

In progress
```json
{
  "e": "msg",
  "ch": "check_suites:<jobId>",
  "off": "1667056504426-0",
  "data": {
    "timestamp": "2022-10-29T15:15:04.000Z",
    "wait": 396.523,
    "reason": "check_suite #<jobId> updated: in_progress",
    "log_archive": false
  }
}
```

Completed
```json
{
  "e": "msg",
  "ch": "check_suites:<jobId>",
  "off": "1667056504426-0",
  "data": {
    "timestamp": "2022-10-29T15:15:04.000Z",
    "wait": 396.523,
    "reason": "check_suite #<jobId> updated: completed",
    "log_archive": false
  }
}
```

### Demo code hack

```js
// this comes from the document in a <link /> tag
const session = "";

// this is your user id on github
const userId = "123";

const ws = new WebSocket(
  `wss://alive.github.com/_sockets/u/${userId}/ws?session=${session}`
);

ws.onopen = function () {
  // handshake packet
  ws.send(
    JSON.stringify({
      subscribe: {
        [session]: "",
      },
    })
  );
};

// listen for all messages
ws.onmessage = function (data) {
  console.log(data);
};
```
