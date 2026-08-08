const fs = require('fs');
const os = require('os');
const path = require('path');

module.exports = async function teardown() {
  const storeFile = path.join(os.tmpdir(), 'java-dsa-studio-e2e-state.json');
  fs.rmSync(storeFile, { force: true });
  fs.rmSync(`${storeFile}.backups`, { recursive: true, force: true });
};