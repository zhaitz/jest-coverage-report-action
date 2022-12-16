import { getCodeOwners } from './../../src/stages/getCodeOwners';
import * as all from '@actions/github';

import { createReport, getSha } from '../../src/stages/createReport';
import { JsonReport } from '../../src/typings/JsonReport';
import { Options } from '../../src/typings/Options';
import { createDataCollector } from '../../src/utils/DataCollector';
import report from '../mock-data/jsonReport.json';
import {readFile} from 'fs-extra';

const { mockContext, clearContextMock } = all as any;

const clearMocks = () => {
  (readFile as jest.Mock<any, any>).mockClear();
};

beforeEach(clearMocks);

const DEFAULT_OPTIONS: Options = {
    token: '',
    testScript: '',
    iconType: 'emoji',
    annotations: 'all',
    packageManager: 'npm',
    skipStep: 'all',
    prNumber: 5,
    pullRequest: {
        number: 5,
        head: { sha: '123456', ref: '123' },
        base: { ref: '456' },
    },
    output: ['comment'],
};

describe('getCodeOwners', () => {
    it('should match snapshots', async () => {
      const dataCollector = createDataCollector<JsonReport>();
      dataCollector.add(report);

      (readFile as jest.Mock<any, any>).mockImplementationOnce(() => `
* some-team

# some-comment
/jest/examples/typescript/sum.ts team-one
/jest/examples/typescript/calc.ts team-two
/jest/examples/typescript/sum.js team-one
`);

      expect(
          await getCodeOwners(
              dataCollector,
              DEFAULT_OPTIONS,
          )
      ).toMatchSnapshot();

      expect(
        await getCodeOwners(
            dataCollector,
            {
                ...DEFAULT_OPTIONS,
                codeOwnersDirectory: 'custom directory',
            },
        )
      ).toMatchSnapshot();
    });
});
