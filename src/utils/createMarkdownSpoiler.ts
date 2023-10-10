export type SpoilerConfig = {
    body: string;
    summary: string;
};

export const createMarkdownSpoiler = ({
    body,
    summary,
}: SpoilerConfig): string => `
## ${summary}
<br/>

${body}
`;
