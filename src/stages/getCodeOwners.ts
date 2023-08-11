import { readFile } from 'fs-extra';

import { CodeOwners } from './../typings/CodeOwners';
import { ActionError } from '../typings/ActionError';
import { JsonReport } from '../typings/JsonReport';
import { Options } from '../typings/Options';
import { FailReason } from '../typings/Report';
import { DataCollector } from '../utils/DataCollector';
import { i18n } from '../utils/i18n';

export const getCodeOwners = async (
    dataCollector: DataCollector<JsonReport>,
    options: Options
): Promise<CodeOwners[] | undefined> => {
    if (!options.codeOwnersDirectory) {
        return undefined;
    }

    const pathToCodeOwnersFile = options.codeOwnersDirectory;

    try {
        dataCollector.info(
            i18n('loadingCodeOwnersFromFile', {
                pathToCodeOwnersFile,
            })
        );

        const outputBuffer = await readFile(pathToCodeOwnersFile);

        const codeOwnersAsString: string = outputBuffer.toString();
        const codeOwnersByLine = codeOwnersAsString.split('\n');
        const filtered = codeOwnersByLine.filter((line) =>
            line.startsWith('/')
        );
        const codeOwnersMap: Record<string, string[]> = {};
        filtered.forEach((line) => {
            const [path, team] = line.split(' ');
            codeOwnersMap[team] ||= [];
            codeOwnersMap[team] = codeOwnersMap[team].concat(path);
        });

        return Object.keys(codeOwnersMap).map((key) => {
            return {
                team: key,
                paths: codeOwnersMap[key],
            };
        });
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            throw new ActionError(FailReason.REPORT_NOT_FOUND, {
                coveragePath: pathToCodeOwnersFile,
            });
        }

        throw new ActionError(FailReason.READING_COVERAGE_FILE_FAILED, {
            error: (error as Error).toString(),
        });
    }
};
