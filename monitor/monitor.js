'use strict';

const path = require('path');

const debug = require('debug')('express:ws');

const express = require('express');

function monitor() {
  const router = express.Router(); // eslint-disable-line new-cap

  let sendors = [];
  const invokeSend = data => {
    debug(data);
    debug(`${sendors.length} sendors`);
    sendors.forEach(send => send(data));
  };

  router.ws('/ws', ws => {
    debug('Monitor connected');

    const send = data => ws.send(data);

    sendors.push(send);

    ws.on('close', () => {
      sendors = sendors.filter(s => s !== send);
    });
  });
  router.use('/', express.static(path.join(__dirname, '../gomi')));

  router.interceptor = {
    send(data) {
      invokeSend(data);
    },
  };

  return router;
}

module.exports = monitor;
