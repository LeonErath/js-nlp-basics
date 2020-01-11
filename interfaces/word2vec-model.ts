export interface Word2VecModel {
	name: string;
	short_name: string;
	language: string;
	fileSize: string;
	disable: boolean;
	url: string;
}

export interface SimilarWord {
	word: string;
	distance: number;
}

export enum OperationType {
	ADD = "ADD",
	SUBTRACT = "SUBTRACGT"
}
