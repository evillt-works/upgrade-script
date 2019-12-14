const fs = require('fs-extra')

module.exports = api => {
  const pkgFile = `${api.cwd}/package.json`

  const pkgSrc = require(pkgFile)

  pkgSrc.gren = '@femessage/grenrc'

  fs.outputJSONSync(pkgFile, pkgSrc, {
    spaces: 2
  })
}
