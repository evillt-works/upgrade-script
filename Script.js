const logger = require('./logger')
const { spawnSync } = require('child_process')
const path = require('path')
const fs = require('fs-extra')

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
      cwd,
      timeout: 60000
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

  run() {
    const branchName = `chore/upgrade-cli-${(Math.random() * 100).toFixed()}`

    this.git('checkout', 'dev')
    this.git('fetch', 'upstream')
    this.git('merge', 'upstream/dev')
    this.git('branch', branchName, '-f')
    this.git('checkout', branchName)
    this.cli('--upgrade', '--files', 'package.json')
    this.git('commit', '-am', 'chore: upgrade-cli')
    this.git('push', '-u', 'origin', branchName)
    this.hub('pull-request', '-m', 'chore: upgrade-cli', '-b', 'femessage:dev')

    // log report
    fs.outputJSONSync(path.join(__dirname, 'log-report.json'), this.logReport, {
      spaces: 2
    })
  }
}