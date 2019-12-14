const logger = require('./logger')
const { spawnSync } = require('child_process')
const path = require('path')
const fs = require('fs-extra')
const parseArgs = require('./utils/parseArgs')

const args = parseArgs(process.argv.slice(2))

module.exports = class Script {
  constructor({ component, logReport = {} } = {}) {
    const componentPath = path.join(__dirname, '../components')
    logReport[component] = {}

    this.cwd = path.join(componentPath, component)
    this.component = component
    this.logReport = logReport

    console.log(component)
  }

  runCommand(command, ...args) {
    logger(command, ...args)

    const { component, logReport, cwd } = this

    const ls = spawnSync(command, [...args], {
      cwd
    })

    const errorMsg = ls.stderr.toString()
    if (errorMsg) {
      console.log(errorMsg)
      logReport[component][`${command}-${args[0]}`] = errorMsg
    } else {
      logReport[component][`${command}-${args[0]}`] = 'passed'
    }

    return ls
  }

  git(...args) {
    this.runCommand('git', ...args)
  }

  hub(...args) {
    this.runCommand('hub', ...args)
  }

  cli(...args) {
    this.runCommand('npx', 'vue-sfc-cli', ...args)
  }

  ytb(...args) {
    this.runCommand('yarn', '--registry', 'https://registry.npm.taobao.org', ...args)
  }

  run() {
    const branchName = `chore/up-to-date-with-cli-${(Math.random() * 100).toFixed()}`
    const addGrenToPkg = require('./scripts/add-gren-to-pkg')

    this.git('checkout', 'dev')
    this.git('branch', branchName, '-f')
    this.git('checkout', branchName)
    this.ytb()
    this.ytb('remove', 'github-release-notes')
    this.ytb('add', '@femessage/github-release-notes', '-D')

    addGrenToPkg(this)

    this.git('pull', 'origin', 'dev')
    this.git('commit', '-am', 'chore(deps): up-to-date with gren')
    this.git('push', '-u', 'evillt-works', branchName)

    if (args.has('pr')) {
      this.hub('pull-request', '-m', 'chore: upgrade gren', '-b', 'femessage:dev')
    }

    // log report
    fs.outputJSONSync(path.join(__dirname, 'log-report.json'), this.logReport, {
      spaces: 2
    })

    console.log()
  }
}
