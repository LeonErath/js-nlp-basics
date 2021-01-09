export interface Word2VecModel {
	name: string;
	language: string;
	size: string;
	lastModified: string;
	id: string;
	url: string;
}

export interface SimilarWord {
	word: string;
	distance: number;
}

export enum OperationType {
	ADD = "ADD",
	SUBTRACT = "SUBTRACGT",
}
