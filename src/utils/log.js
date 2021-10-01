const log = console.log;

const NWC = 'NEW WEBSOCKET CONNECTION';
const runServerMessage = message => `Server is running on port ${message}`;

module.exports = {
  log,
  NWC,
  runServerMessage
};