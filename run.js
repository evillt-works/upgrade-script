const Script = require('./Script')
const parseArgs = require('./utils/parseArgs')

const args = parseArgs(process.argv.slice(2))

const script = new Script({
  component: args.get('component')
})

script.run()
