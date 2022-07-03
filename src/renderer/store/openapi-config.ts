import type { ConfigFile } from '@rtk-query/codegen-openapi';

const config: ConfigFile = {
  schemaFile: '../../../api.teraphone.app.yml',
  apiFile: 'emptyApi.ts',
  apiImport: 'emptySplitApi',
  outputFile: 'peachone.ts',
  exportName: 'peachone',
  hooks: true,
};

export default config;
