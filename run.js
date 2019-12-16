#!/usr/bin/env node

const Script = require('./Script')
const parseArgs = require('./utils/parseArgs')

const args = parseArgs(process.argv.slice(2))

if (!args.get('component')) {
  console.error('Missing param: `component`')
  process.exit()
}

const script = new Script({
  component: args.get('component')
})

script.run()
