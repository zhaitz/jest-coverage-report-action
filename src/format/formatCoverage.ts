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
    codeOwners?: CodeOwners[] | undefined
): string => {
    if (headReport) {
        const headSummary = [parseSummary(headReport)];
        const teamSummmary =
            codeOwners?.map((codeOwner) =>
                parseSummary(headReport, codeOwner)
            ) || [];

        const baseReportSummary = !baseReport
            ? undefined
            : [parseSummary(baseReport)];
        const baseReportTeamSummmary = !baseReport
            ? undefined
            : codeOwners?.map((codeOwner) =>
                  parseSummary(baseReport, codeOwner)
              ) || [];

        return getFormattedCoverage(
            [...teamSummmary, ...headSummary],
            baseReportSummary && baseReportTeamSummmary
                ? [...baseReportTeamSummmary, ...baseReportSummary]
                : undefined,
            parseDetails(headReport),
            baseReport ? parseDetails(baseReport) : undefined,
            threshold,
            hideDetails
        );
    }

    return '';
};
