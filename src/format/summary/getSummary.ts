import minimatch from 'minimatch';

import { CodeOwners } from './../../typings/CodeOwners';
import { CoverageSummary } from '../../typings/Coverage';
import { CoverageMap, FileCoverage } from '../../typings/JsonReport';
import { getPercents } from '../getPercents';

function getFilteredFilesByCodeOwner(
    paths: string[],
    fileCoverage: FileCoverage[]
) {
    let filesToReturn: string[] = [];
    const fileList = Object.values(fileCoverage).map((m) => m.path);

    // const cwd = process.cwd();
    const cwd = '/home/runner/work/found/found';

    Object.values(paths).forEach((p) => {
        filesToReturn = filesToReturn.concat(
            fileList.filter((f) => f.includes(p))
        );

        filesToReturn = filesToReturn.concat(
            fileList.filter(minimatch.filter(cwd + p))
        );
    });

    return fileCoverage.filter((v) => filesToReturn.includes(v.path));
}

export const getSummary = (
    map: CoverageMap,
    totalCounter: (value: FileCoverage) => number,
    coveredCounter: (value: FileCoverage) => number,
    title: string,
    codeOwners?: CodeOwners
): CoverageSummary => {
    const filteredMap = codeOwners
        ? getFilteredFilesByCodeOwner(codeOwners.paths, Object.values(map))
        : Object.values(map);

    const total = Object.values(filteredMap).reduce(
        (acc, currValue) => acc + totalCounter(currValue),
        0
    );

    const covered = Object.values(filteredMap).reduce(
        (acc, currValue) => acc + coveredCounter(currValue),
        0
    );

    if (codeOwners) {
        return {
            title,
            total,
            covered,
            percentage: getPercents(covered, total),
            team: codeOwners.team,
        };
    }

    return {
        title,
        total,
        covered,
        percentage: getPercents(covered, total),
    };
};
