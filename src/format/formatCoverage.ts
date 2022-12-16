import { CodeOwners } from './../typings/CodeOwners';
import { parseDetails } from './details/parseDetails';
import { parseSummary } from './summary/parseSummary';
import { getFormattedCoverage } from './getFormattedCoverage';
import { JsonReport } from '../typings/JsonReport';

export const formatCoverage = (
    headReport: JsonReport | undefined,
    baseReport: JsonReport | undefined,
    threshold: number | undefined,
    hideDetails: boolean | undefined,
    codeOwner?: CodeOwners | undefined
): string => {
    if (headReport) {
        return getFormattedCoverage(
            parseSummary(headReport, codeOwner),
            baseReport ? parseSummary(baseReport, codeOwner) : undefined,
            parseDetails(headReport),
            baseReport ? parseDetails(baseReport) : undefined,
            threshold,
            hideDetails,
            codeOwner
        );
    }

    return '';
};
