'use strict';

// Deps
const express = require('express');
const redis = require("redis");
const client = redis.createClient(process.env.REDIS_URL);

// Constants
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Utils
Object.defineProperty(String.prototype, 'hashCode', {
  value: function() {
    var hash = 0, i, chr;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return hash;
  }
});

// App
const app = express();
app.get('/*', function (req, res) {
  const hash = req.url.hashCode() + "";
  client.incr(hash, function(err, reply) {
    res.json({ total: reply });
  });
})

// Server
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
