import { parseSummary } from '../../../src/format/summary/parseSummary';
import report from '../../mock-data/jsonReport.json';

describe('parseSummary', () => {
    it('should parse summary from mock data', () => {
        expect(parseSummary(report)).toMatchSnapshot();
    });

    it('should parse summary from mock data with team', () => {
        expect(
            parseSummary(report, {
                team: 'testing',
                paths: ['/jest/examples/typescript/CheckboxWithLabel.tsx'],
            })
        ).toMatchSnapshot();
    });
});
