const path = require('path')
const fs = require('fs-extra')
const Script = require('./Script')

const componentsPath = path.join(__dirname, '../components')
const componentsDir = fs.readdirSync(componentsPath)

componentsDir.forEach(component => {
  const script = new Script({
    component
  })

  script.run()
})
