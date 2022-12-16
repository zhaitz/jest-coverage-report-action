import { CodeOwners } from './../typings/CodeOwners';
export const withExplanation = (
    text: string,
    explanation: string,
    codeOwner?: CodeOwners
) => {
    const strings: string[] = [];

    if (codeOwner) {
        strings.push(`<p>Coverage for ${codeOwner.team}</p>`);
    }

    strings.push(
        `<div title="${explanation}">${text}<sup>:grey_question:</sup></div>`
    );

    return strings.join('');
};
