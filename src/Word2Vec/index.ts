// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/*
Word2Vec
*/

import * as tf from "@tensorflow/tfjs";
import jsonModel from "../data/wordvecs10000.json";
import { SimilarWord, OperationType } from "../models";

class Word2Vec {
	model: any = {};
	modelSize: number = 0;
	modelLoaded: boolean = false;

	constructor() {
		this.model = {};

		this.modelSize = 0;
		this.modelLoaded = false;

		this.loadModel();
	}

	async loadModel() {
		const jsonModel2 = jsonModel as any;
		Object.keys(jsonModel2.vectors).forEach(word => {
			this.model[word] = tf.tensor1d(jsonModel2.vectors[word]);
		});
		this.modelSize = Object.keys(this.model).length;
		this.modelLoaded = true;
		return this;
	}

	dispose() {
		Object.values(this.model).forEach((x: any) => x.dispose());
	}

	async add(inputs: string[], amount?: number) {
		const max = amount ? amount : 10;

		if (!this.modelLoaded) {
			return;
		}
		return tf.tidy(() => {
			const sum = Word2Vec.addOrSubtract(this.model, inputs, OperationType.ADD);
			const result = Word2Vec.nearest(
				this.model,
				sum,
				inputs.length,
				inputs.length + max
			) as any;

			return result;
		});
	}

	async subtract(inputs: string[], amount?: number) {
		const max = amount ? amount : 10;

		if (!this.modelLoaded) {
			return;
		}
		return tf.tidy(() => {
			const subtraction = Word2Vec.addOrSubtract(
				this.model,
				inputs,
				OperationType.SUBTRACT
			);
			const result = Word2Vec.nearest(
				this.model,
				subtraction,
				inputs.length,
				inputs.length + max
			) as any;

			return result;
		});
	}

	async average(inputs: string[], amount?: number) {
		const max = amount ? amount : 10;

		if (!this.modelLoaded) {
			return;
		}
		return tf.tidy(() => {
			const sum = Word2Vec.addOrSubtract(this.model, inputs, OperationType.ADD);
			const avg = tf.div(sum, tf.tensor(inputs.length));
			const result = Word2Vec.nearest(
				this.model,
				avg,
				inputs.length,
				inputs.length + max
			) as any;

			return result;
		});
	}

	async nearest(input: string, amount?: number): Promise<SimilarWord[]> {
		const max = amount ? amount : 10;

		return new Promise((resolve, reject) => {
			if (!this.modelLoaded) {
				reject("Model not loaded");
			}
			const vector = this.model[input];
			let result;
			if (vector) {
				result = Word2Vec.nearest(this.model, vector, 1, max + 1);
				resolve(result);
			} else {
				resolve([]);
			}
		});
	}

	async getRandomWord() {
		if (!this.modelLoaded) {
			return;
		}
		const words = Object.keys(this.model);
		const result = words[Math.floor(Math.random() * words.length)];

		return result;
	}

	static addOrSubtract(model: any, values: string[], operation: OperationType) {
		return tf.tidy(() => {
			const vectors: any = [];
			const notFound: any = [];
			if (values.length < 2) {
				throw new Error("Invalid input, must be passed more than 1 value");
			}
			values.forEach((value: any) => {
				const vector = model[value];
				if (!vector) {
					notFound.push(value);
				} else {
					vectors.push(vector);
				}
			});

			if (notFound.length > 0) {
				throw new Error(
					`Invalid input, vector not found for: ${notFound.toString()}`
				);
			}
			let result = vectors[0];
			if (operation === OperationType.ADD) {
				for (let i = 1; i < vectors.length; i += 1) {
					result = tf.add(result, vectors[i]);
				}
			}
			if (operation === OperationType.SUBTRACT) {
				for (let i = 1; i < vectors.length; i += 1) {
					result = tf.sub(result, vectors[i]);
				}
			}
			return result;
		});
	}

	static nearest(
		model: any,
		vector: any,
		start: number,
		max: number
	): SimilarWord[] {
		const nearestVectors: SimilarWord[] = [];
		Object.keys(model).forEach(word => {
			const distance = tf.util.distSquared(
				vector.dataSync(),
				model[word].dataSync()
			);
			nearestVectors.push({ word, distance });
		});
		nearestVectors.sort(
			(a: SimilarWord, b: SimilarWord) => a.distance - b.distance
		);

		return nearestVectors.slice(start, max);
	}
}

const word2vec = () => new Word2Vec();

export default word2vec;
