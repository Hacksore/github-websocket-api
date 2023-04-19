# github-websocket-pipelines-api

Github has an undocumented websocket API hosted on `alive.github.com` for some realtime interactions.

# 🟡 Mildly Blocked

Able to get data if I reuse the payload that is sent from a real client to subscribe. Can't figure out how to craft the packet fully yet.

### Events

- Workflow Run
- Notification Changed
- Check Suites

### New intel

It seems the `session` is in two parts, one a base64 encoded string with the payload seen below. I've yet to figure out what the second part of the payload is yet.

Schema:
`<base64String>--<someOtherString>`

This is what the github webpage has as the first part `session` field in the websocket query string.

```json
{
  "v": "V3",
  "u": "<userId>",
  "s": "<number>",
  "c": "<number>",
  "t": "<number>"
}
```

another piece of intel is how you subscribe to events, this is the decoded part of what the client will send as the first part.

```json
{ "c": "notification-changed:<userId>", "t": 1667188552 }
```

check suites payload to send as the first part.

```json
{ "c": "check_suites:<jobId>", "t": 1667192074 }
```

### Auth

If use a valid `user_session` cookie you can request github and extract the websocket URL from the page.

The script is doing this automatically now.

### How to run

1. Create an `.env` file, copy the example. Source both your user id and a user session
1. run `yarn` to install the deps
1. run `yarn start` to start the client

# Payloads/Events

I've attempted to give a good description to each of these payloads below.

## ack

This is seems to be returned not matter what you send to the API.

```json
{
  "e": "ack",
  "off": "1667055219967-0",
  "health": true
}
```

## subscribe

This is what the client will send when you visit a github page. It looks to be asking github

> please give me events for `<sessionId>`

```json
{
  "subscribe": {
    "<sessionId>": ""
  }
}
```

## unsubscribe

This is what the client will send when you navigating to a new page on github. It looks to be tell github saying

> please unsubscribe me for all previous `<sessionId>` event subscriptions

```json
{
  "unsubscribe": ["<sessionId>"]
}
```

## notification-changed

This is emitted whenever the indicator needs to update. Anything that will leave items in your notifications inbox will trigger this.

```json
{
  "e": "msg",
  "ch": "notification-changed:<userId>",
  "off": "1667056418489-0",
  "data": { "indicator_mode": "none", "wait": 371.57200000000006 }
}
```

## workflow_run

This is emitted whenever a workflow run starts.

```json
{
  "e": "msg",
  "ch": "workflow_run:<runId>:execution",
  "off": "1667059757243-0",
  "data": {
    "timestamp": "2022-10-29T16:09:15.000Z",
    "wait": 372.463,
    "reason": "Execution created"
  }
}
```

## check_suites

This is emitted whenever a workflow job updates and has two states in the `reason` field. It can either be `in_progress` or `completed`.

```json
{
  "e": "msg",
  "ch": "check_suites:<jobId>",
  "off": "1667056504426-0",
  "data": {
    "timestamp": "2022-10-29T15:15:04.000Z",
    "wait": 396.523,
    "reason": "check_suite #<jobId> updated: <state>",
    "log_archive": false
  }
}
```

### Example

See demo in `client.ts`

### Investigating 

- How do I get a `jobId` that is used
