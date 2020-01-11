import { Word2VecModel } from "../../../interfaces";

export const models: Word2VecModel[] = [
	{
		name: "Wikipedia (german)",
		short_name: "wiki_ger",
		language: "🇩🇪 German",
		fileSize: "33,2 MB",
		url: "./models/Word2Vec/wikipedia_german.json",
		disable: false
	},
	{
		name: "Bible",
		short_name: "bible",
		language: "🇺🇸 English",
		fileSize: "7,1 MB",
		url: "./models/Word2Vec/bible.json",
		disable: false
	},
	{
		name: "ML5 large",
		short_name: "ml5_big",
		language: "🇺🇸 English",
		fileSize: "28,6 MB",
		url: "./models/Word2Vec/wordvecs10000.json",
		disable: false
	},
	{
		name: "ML5 medium",
		short_name: "ml5_medium",
		language: "🇺🇸 English",
		fileSize: "14,3 MB",
		url: "./models/Word2Vec/wordvecs5000.json",
		disable: false
	},
	{
		name: "ML5 small",
		short_name: "ml5_small",
		language: "🇺🇸 English",
		fileSize: "2,9 MB",
		url: "./models/Word2Vec/wordvecs1000.json",
		disable: false
	}
];

const getModels = async (req, res) => {
	res.send(models);
};

export default getModels;
