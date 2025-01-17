"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupNexusConfig = void 0;
const path_1 = __importDefault(require("path"));
function setupNexusConfig(builder) {
    // Setup defaults
    const defaultSchemaPath = path_1.default.join(process.cwd(), 'schema.graphql');
    const defaultTypesPath = path_1.default.join(__dirname, '../node_modules/@types/nexus-typegen/index.d.ts');
    const defaults = {
        outputs: {
            schema: defaultSchemaPath,
            typegen: defaultTypesPath,
        },
        outputsUndefined: {
            schema: false,
            typegen: defaultTypesPath,
        },
    };
    let outputs = builder.getConfigOption('outputs');
    let shouldGenerateArtifacts = builder.getConfigOption('shouldGenerateArtifacts');
    if (!builder.hasConfigOption('shouldGenerateArtifacts')) {
        shouldGenerateArtifacts =
            process.env.NEXUS_SHOULD_GENERATE_ARTIFACTS === 'true'
                ? true
                : process.env.NEXUS_SHOULD_GENERATE_ARTIFACTS === 'false'
                    ? false
                    : Boolean(!process.env.NODE_ENV || process.env.NODE_ENV === 'development');
        builder.setConfigOption('shouldGenerateArtifacts', shouldGenerateArtifacts);
    }
    if (shouldGenerateArtifacts === false || outputs === false) {
        return builder.setConfigOption('outputs', { schema: false, typegen: false });
    }
    if (outputs === true) {
        return builder.setConfigOption('outputs', defaults.outputs);
    }
    if (outputs === undefined) {
        return builder.setConfigOption('outputs', defaults.outputsUndefined);
    }
    if (outputs && typeof outputs === 'object') {
        let toSet = Object.assign({}, outputs);
        if (outputs.schema === true) {
            toSet.schema = defaults.outputs.schema;
        }
        if (outputs.schema === undefined) {
            toSet.schema = false;
        }
        if (outputs.typegen === undefined || outputs.typegen === true) {
            toSet.typegen = defaults.outputs.typegen;
        }
        return builder.setConfigOption('outputs', toSet);
    }
}
exports.setupNexusConfig = setupNexusConfig;
