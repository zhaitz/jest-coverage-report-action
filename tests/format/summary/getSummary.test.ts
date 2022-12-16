import { getSummary } from '../../../src/format/summary/getSummary';
import { coverageMap } from '../../mock-data/jsonReport.json';

describe('getSummary', () => {
    it('should calculate summary', () => {
        const counter = jest.fn(() => 1);

        expect(
            getSummary(coverageMap, counter, counter, 'Title')
        ).toStrictEqual({
            title: 'Title',
            total: 6,
            covered: 6,
            percentage: 100,
        });
    });

    it('should calculate summary with codeowners', () => {
        const counter = jest.fn(() => 1);

        expect(
            getSummary(coverageMap, counter, counter, 'Title', {
                team: 'testing',
                paths: ['/jest/examples/typescript/CheckboxWithLabel.tsx'],
            })
        ).toStrictEqual({
            title: 'Title',
            total: 1,
            covered: 1,
            percentage: 100,
            team: 'testing',
        });
    });
});
