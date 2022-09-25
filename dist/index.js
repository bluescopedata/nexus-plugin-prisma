"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const semver = __importStar(require("semver"));
const path = __importStar(require("path"));
// import { findUpSync, pathExists } from 'find-up'
// import { findUpSync } from 'find-up'
const colors_1 = require("./colors");
// import { pkgUp } from 'pkg-up'
// const findWorkspaceRoot = require('find-yarn-workspace-root')
// const workspaceRoot = findWorkspaceRoot(__dirname) // Absolute path or null
const pkgJson = require('../package.json');
function ensureDepsAreInstalled(depNames) {
    return __awaiter(this, void 0, void 0, function* () {
        // const { findUpSync } = await import('find-up')
        console.log('WORKING DIRETORY FOR nexus-plugin-prisma generate jag', process.cwd());
        for (const depName of depNames) {
            try {
                // const pathToDepName = findUpSync(`node_modules/${depName}`, { type: 'directory' })
                // console.log('pathToDepName', pathToDepName)
                // require(pathToDepName || '')
                // await import(pathToDepName || '')
                require(`${depName}`);
            }
            catch (err) {
                try {
                    const workspaceRootModule = path.resolve(process.cwd(), './node_modules', depName);
                    console.log('Attempting to locate dep in workspace root.', workspaceRootModule);
                    require(workspaceRootModule);
                }
                catch (_err) {
                    if (err.code === 'MODULE_NOT_FOUND') {
                        console.error(`${colors_1.colors.red('ERROR:')} ${colors_1.colors.green(depName)} must be installed as a dependency. Please run \`${colors_1.colors.green(`npm install ${depName}`)}\`.`);
                        process.exit(1);
                    }
                    else {
                        console.error(err.message);
                        console.error(_err.message);
                        throw _err;
                    }
                }
            }
        }
    });
}
function ensurePeerDepRangeSatisfied(depName) {
    try {
        const installedVersion = require(`${depName}/package.json`).version;
        // npm enforces that package manifests have a valid "version" field so this case _should_ never happen under normal circumstances.
        if (!installedVersion) {
            console.warn(colors_1.colors.yellow(`Warning: No version found for "${depName}". We cannot check if the consumer has satisfied the specified range.`));
            return;
        }
        const supportedRange = pkgJson.peerDependencies[depName];
        if (!supportedRange) {
            console.warn(colors_1.colors.yellow(`Warning: nexus-plugin-prisma has no such peer dependency for "${depName}". We cannot check if the consumer has satisfied the specified range.`));
            return;
        }
        if (semver.satisfies(installedVersion, supportedRange)) {
            return;
        }
        console.warn(colors_1.colors.yellow(`Warning: nexus-plugin-prisma@${pkgJson.version} does not support ${depName}@${installedVersion}. The supported range is: \`${supportedRange}\`. This could lead to undefined behaviors and bugs.`));
    }
    catch (_a) { }
}
ensureDepsAreInstalled(['nexus', 'graphql', '@prisma/client']).then(() => {
    // TODO: Bring back peer dep range check for graphql once we have proper ranges
    // TODO: They're currently way too conservative
    //ensurePeerDepRangeSatisfied('graphql')
    ensurePeerDepRangeSatisfied('nexus');
    ensurePeerDepRangeSatisfied('@prisma/client');
});
__exportStar(require("./plugin"), exports);
