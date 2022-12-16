import { CodeOwners } from './../../typings/CodeOwners';
import { CoverageSummary } from '../../typings/Coverage';
import { CoverageMap, FileCoverage } from '../../typings/JsonReport';
import { getPercents } from '../getPercents';


export const getSummary = (
    map: CoverageMap,
    totalCounter: (value: FileCoverage) => number,
    coveredCounter: (value: FileCoverage) => number,
    title: string,
    codeOwners?: CodeOwners,
): CoverageSummary => {
    const filteredMap = codeOwners ? Object.values(map).filter((v) => codeOwners.paths.some((p) => v.path.includes(p))) : Object.values(map);

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
