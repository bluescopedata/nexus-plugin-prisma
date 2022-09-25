import * as semver from 'semver'
import * as path from 'path'
// import { findUpSync, pathExists } from 'find-up'
// import { findUpSync } from 'find-up'
import { colors } from './colors'
// import { pkgUp } from 'pkg-up'
// const findWorkspaceRoot = require('find-yarn-workspace-root')

// const workspaceRoot = findWorkspaceRoot(__dirname) // Absolute path or null

const pkgJson = require('../package.json')

async function ensureDepsAreInstalled(depNames: string[]) {
  // const { findUpSync } = await import('find-up')
  console.log('WORKING DIRETORY FOR nexus-plugin-prisma generate jag', process.cwd())
  for (const depName of depNames) {
    try {
      // const pathToDepName = findUpSync(`node_modules/${depName}`, { type: 'directory' })

      // console.log('pathToDepName', pathToDepName)

      // require(pathToDepName || '')
      // await import(pathToDepName || '')
      require(`${depName}`)
    } catch (err: any) {
      try {
        const workspaceRootModule = path.resolve(process.cwd(), './node_modules', depName)
        console.log('Attempting to locate dep in workspace root.', workspaceRootModule)
        require(workspaceRootModule)
      } catch (_err: any) {
        if (err.code === 'MODULE_NOT_FOUND') {
          console.error(
            `${colors.red('ERROR:')} ${colors.green(
              depName
            )} must be installed as a dependency. Please run \`${colors.green(`npm install ${depName}`)}\`.`
          )
          process.exit(1)
        } else {
          console.error(err.message)
          console.error(_err.message)
          throw _err
        }
      }
    }
  }
}

function ensurePeerDepRangeSatisfied(depName: string) {
  try {
    const installedVersion: string | undefined = require(`${depName}/package.json`).version

    // npm enforces that package manifests have a valid "version" field so this case _should_ never happen under normal circumstances.
    if (!installedVersion) {
      console.warn(
        colors.yellow(
          `Warning: No version found for "${depName}". We cannot check if the consumer has satisfied the specified range.`
        )
      )
      return
    }

    const supportedRange: string | undefined = pkgJson.peerDependencies[depName]

    if (!supportedRange) {
      console.warn(
        colors.yellow(
          `Warning: nexus-plugin-prisma has no such peer dependency for "${depName}". We cannot check if the consumer has satisfied the specified range.`
        )
      )
      return
    }

    if (semver.satisfies(installedVersion, supportedRange)) {
      return
    }

    console.warn(
      colors.yellow(
        `Warning: nexus-plugin-prisma@${pkgJson.version} does not support ${depName}@${installedVersion}. The supported range is: \`${supportedRange}\`. This could lead to undefined behaviors and bugs.`
      )
    )
  } catch {}
}

ensureDepsAreInstalled(['nexus', 'graphql', '@prisma/client']).then(() => {
  // TODO: Bring back peer dep range check for graphql once we have proper ranges
  // TODO: They're currently way too conservative

  //ensurePeerDepRangeSatisfied('graphql')
  ensurePeerDepRangeSatisfied('nexus')
  ensurePeerDepRangeSatisfied('@prisma/client')
})

export * from './plugin'
