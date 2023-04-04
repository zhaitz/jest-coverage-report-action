import table from 'markdown-table';

import { CoverageSummary } from '../../typings/Coverage';
import { formatPercentage } from '../../utils/formatPercentage';
import { getStatusOfPercents } from '../../utils/getStatusOfPercents';

export const formatCoverageSummary = (
    headSummary: Array<Array<CoverageSummary>>,
    baseSummary: Array<Array<CoverageSummary>> | undefined,
    threshold: number | undefined
): string => {
    const strings = [];

    const summaryByTeam: Record<string, Record<string, CoverageSummary>> = {};
    headSummary.forEach((coverageSummaryArray) => {
        coverageSummaryArray.forEach((currSummary) => {
            const team = currSummary.team || 'Total';

            summaryByTeam[team] ||= { [currSummary.title]: currSummary };
            summaryByTeam[team][currSummary.title] = currSummary;
        });
    });

    const baseSummaryByTeam: Record<
        string,
        Record<string, CoverageSummary>
    > = {};

    if (baseSummary) {
        baseSummary.forEach((coverageSummaryArray) => {
            coverageSummaryArray.forEach((currSummary) => {
                const team = currSummary.team || 'Total';

                summaryByTeam[team] ||= { [currSummary.title]: currSummary };
                summaryByTeam[team][currSummary.title] = currSummary;
            });
        });
    }

    const blahTwo = Object.keys(summaryByTeam).map((team) => {
        const stringForTeam = [];
        stringForTeam.push(team);

        Object.values(summaryByTeam[team]).forEach((summary, index) => {
            const breakdown = `${summary.covered}/${summary.total}`;

            const breakdownParenthesis = [];
            breakdownParenthesis.push(
                formatPercentage(
                    summary.percentage,
                    baseSummaryByTeam[team]?.[index].percentage
                )
            );
            breakdownParenthesis.push(
                getStatusOfPercents(summary.percentage, threshold)
            );

            stringForTeam.push(
                `${breakdown} (${breakdownParenthesis.join(' ')})`
            );
        });

        return stringForTeam;
    });

    strings.push(
        table([
            [
                'Team',
                'Statements covered',
                'Branches Covered',
                'Functions covered',
                'Lines Covered',
            ],
            ...blahTwo,
        ])
    );

    return strings.join('\n\n');
};
