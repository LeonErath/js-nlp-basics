// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/*
Word2Vec
*/

import * as tf from "@tensorflow/tfjs";

import { SimilarWord, OperationType } from "../models";

class Word2Vec {
	model: any = {};
	modelSize: number = 0;
	modelLoaded: boolean = false;
	vectorDimensions: number = 0;

	constructor() {
		this.model = {};

		this.modelSize = 0;
		this.vectorDimensions = 0;
		this.modelLoaded = false;
	}

	loadModel(path: string) {
		return new Promise((resolve, reject) => {
			try {
				fetch(path)
					.then(r => {
						console.log(r);
						return r.json();
					})
					.catch(e => {
						console.log(e);
						reject(e);
					})
					.then((model: any) => {
						Object.keys(model.vectors).forEach(word => {
							this.model[word] = tf.tensor1d(model.vectors[word]);
						});

						this.vectorDimensions =
							model.vectors[Object.keys(model.vectors)[0]].length;

						this.modelSize = Object.keys(this.model).length;
						this.modelLoaded = true;
						resolve();
					})
					.catch(e => {
						console.log(e);
						reject(e);
					});
			} catch (e) {
				reject(e);
			}
		});
	}

	dispose() {
		Object.values(this.model).forEach((x: any) => x.dispose());
		this.model = {};
		this.modelSize = 0;
		this.vectorDimensions = 0;
		this.modelLoaded = false;
		return this;
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
		try {
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
		} catch (e) {
			console.log(e);
		}
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
