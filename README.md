# scumBusterV2 ~scumBuster~
~Game community "Anti-Cheat" API created with Django, ReactJS, and PostgreSQL~


Community driven "Anti-Cheat" web application written with the **MERN Stack - MongoDB, ExpressJS, ReactJS, NodeJs**

## Rationale
To add an extra layer of security and "trustworthiness checks" before a player joins a community game server.

## Example
Alice attempts to join Bob's game server. As they are attempting to join the server, a few custom scripts are run, to ensure Alice is able to play on the server. For example, installing third party assets, and authenticating Alice with **Steam**

Another script is also run to call a `scumBusterV2` api that checks the trust worthiness of Alice. 

The API may return something like this: 

```yaml
{
  'player_id': "Player Foo",
  'number_of_reports': 1234,
  'trust_factor': "untrustworthy",
}
```

Then Bob's server-side script may handle logic like so to either accept or reject Alice:

```typescript
if (incomingPlayer.trustFactor === "undefined" || incomingPlayer.numberOfReports > 100) {
  server.disconnect(incomingPlayer);
} else {
  server.connect(incomingPlayer); 
}
```


## Application Architecture 
<img src="https://github.com/HasmH/scumBuster/blob/main/misc/APIarch.png?raw=true" width="750" heigh="750">

