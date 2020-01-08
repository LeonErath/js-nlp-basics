export interface Model {
	name: string;
	short_name: string;
	language: string;
	fileSize: string;
	disable: boolean;
	url: string;
}

export interface DataPoint {
	x: number;
	y: number;
	z: number;
	name: string;
	input: string;
}

export const models: Model[] = [
	{
		name: "Wikipedia (german)",
		short_name: "wiki_ger",
		language: "🇩🇪 German",
		fileSize: "33,2 MB",
		url: "./data/wikipedia_german.json",
		disable: false
	},
	{
		name: "Bible",
		short_name: "bible",
		language: "🇺🇸 English",
		fileSize: "7,1 MB",
		url: "./data/bible.json",
		disable: false
	},
	{
		name: "ML5 large",
		short_name: "ml5_big",
		language: "🇺🇸 English",
		fileSize: "28,6 MB",
		url: "./data/wordvecs10000.json",
		disable: false
	},
	{
		name: "ML5 medium",
		short_name: "ml5_medium",
		language: "🇺🇸 English",
		fileSize: "14,3 MB",
		url: "./data/wordvecs5000.json",
		disable: false
	},
	{
		name: "ML5 small",
		short_name: "ml5_small",
		language: "🇺🇸 English",
		fileSize: "2,9 MB",
		url: "./data/wordvecs1000.json",
		disable: false
	}
];
