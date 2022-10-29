# github-websocket-api

Github has an undocumented websocket API hosted on `alive.github.com` for some realtime interactions.

### Events

- Workflow Run
- Notication Changed
- Check Suites

### Payloads/Events

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

`workflow_run`

```json
{
  "e": "msg",
  "ch": "workflow_run:3351967683:execution",
  "off": "1667059757243-0",
  "data": {
    "timestamp": "2022-10-29T16:09:15.000Z",
    "wait": 372.463,
    "reason": "Execution created"
  }
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

### Example

See demo in `client.ts`
