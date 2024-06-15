#!/usr/bin/env node
// start client from the cmnd line
// @author nicholas o'sullivan
const fs = require('fs');
const path = require('path');
const { argv, option} = require('yargs');

// Configure yargs options
const options = option('url', {
    alias: 'u',
    description: 'The URL to connect to ending w/ "/api/v1" ie: https://husksheets.fly.dev/api/v1',
    type: 'string',
    demandOption: true,
  })
  .option('name', {
    alias: 'n',
    description: 'The users name',
    type: 'string',
    demandOption: true,
  })
  .option('password', {
    alias: 'p',
    description: 'The users password',
    type: 'string',
    demandOption: true,
  })
  .option('publisher', {
    alias: 'pub',
    description: 'The publisher name',
    type: 'string',
    demandOption: true,
  })
  .option('sheet', {
    alias: 's',
    description: 'The sheet name',
    type: 'string',
    demandOption: true,
  })
  .help()
  .alias('help', 'h')
  .argv;

// Update .env.local file
const envFilePath = path.resolve(__dirname, '.env.local');
const envData = `
  NEXT_PUBLIC_URL=${options.url}
  NEXT_PUBLIC_NAME=${options.name}
  NEXT_PUBLIC_PASSWORD=${options.password}
  NEXT_PUBLIC_PUBLISHER=${options.publisher}
  NEXT_PUBLIC_SHEET=${options.sheet}
`;

fs.writeFileSync(envFilePath, envData.trim());

const { exec } = require('child_process');
exec('npm run dev', (err, stdout, stderr) => {
  if (err) {
    console.error(`Error executing command: ${err}`);
    return;
  }
  console.log(stdout);
  console.error(stderr);
});
