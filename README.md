# github-websocket-api

Github has an undocumented websocket API hosted on `alive.github.com` for some realtime interactions.

# 🛑 Currrent Blocker

I still can't get data other than the `ack` payload to come back. So either I'm missing a step or GitHub is doing some magic validation 🧙.

### Events

- Workflow Run
- Notification Changed
- Check Suites

### Auth

You can view page source on github to find your session id in a `<link/>` tag.

ex:
```html
<link
  rel="shared-web-socket"
  href="wss://alive.github.com/_sockets/u/<userId>/ws?session=<sessionId>"
  data-refresh-url="/_alive"
/>
```

### How to run
1. Create an `.env` file, copy the example. Source both your user id and a session id.
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
This is what the client will do when you visit a github page. It looks to be asking github 
> please give me events for `<sessionId>`

```json
{
  "subscribe": {
    "<sessionId>": ""
  }
}
```

## unsubscribe
This is what the client will do when you navigating to a new page on github. It looks to be tell github saying
> please unsubscribe me for all previous `<sessionId>` event subscriptions

```json
{
  "unsubscribe": ["<sessionId>"]
}
```

## notification-changed
This is called whenever the indicator needs to update. Anything that will leave items in your notifications inbox will trigger this.

```json
{
  "e": "msg",
  "ch": "notification-changed:<userId>",
  "off": "1667056418489-0",
  "data": { "indicator_mode": "none", "wait": 371.57200000000006 }
}
```

## workflow_run
This is called whenever a workflow run starts.

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
This is called whenever a workflow job updates and has two states in the `reason` field. It can either be `in_progress` or `completed`.

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
