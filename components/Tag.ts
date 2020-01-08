import styled from "styled-components";

interface TagProps {
	background: string | undefined;
}

export const Tag = styled.span<TagProps>`
	background-color: ${props =>
		props.background ? props.background : "#ffffff"};
	border-radius: 4px;
	padding: 4px;
`;

export const TagColors = new Map([
	["Noun", "#effffb"],
	["Modal", "#50d890"],
	["Singular", "#50d890"],
	["Pronoun", "#4f98ca"],
	["Determiner", "#e8d4b4"],
	["Preposition", "#e8d4b4"],
	["Verb", "#e8d4b4"],
	["Copula", "#ebe6e6"],
	["Adverb", "#e3f6f5"],
	["Comparable", "#bae8e8"],
	["Adjective", "#ffbd69"],
	["Negative", "#ffffff"],
	["Infinitive", "#effffb"],
	["QuestionWord", "#effffb"],
	["Negative", "#50d890"],
	["Possessive", "#4f98ca"],
	["Conjunction", "#e8d4b4"],
	["Adjective", "#ffbd69"],
	["Negative", "#ffffff"],
	["Participle", "#effffb"],
	["TitleCase", "#50d890"],
	["PresentTense", "#50d890"]
]);
