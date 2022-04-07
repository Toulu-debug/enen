/**
 * cron: * * * * *
 */
const fs = require('fs');
fs.writeFileSync('.env', 'PANDA_TOKEN=""\n')