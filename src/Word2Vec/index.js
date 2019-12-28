// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/*
Word2Vec
*/

import * as tf from "@tensorflow/tfjs";
import json from "../data/wordvecs5000.json"

function callCallback(promise, callback) {
	if (callback) {
		promise
			.then(result => {
				callback(undefined, result);
				return result;
			})
			.catch(error => {
				callback(error);
				return error;
			});
	}
	return promise;
}

class Word2Vec {

	constructor( callback) {
		this.model = {};
		
		this.modelSize = 0;
		this.modelLoaded = false;

		this.ready = callCallback(this.loadModel(), callback);
		
	}

	async loadModel() {
		
        
		Object.keys(json.vectors).forEach(word => {
			this.model[word] = tf.tensor1d(json.vectors[word]);
		});
		this.modelSize = Object.keys(this.model).length;
		this.modelLoaded = true;
		return this;
	}

	dispose(callback) {
		Object.values(this.model).forEach(x => x.dispose());
		if (callback) {
			callback();
		}
	}

	async add(inputs, maxOrCb, cb) {
		const { max, callback } = Word2Vec.parser(maxOrCb, cb, 10);

		await this.ready;
		return tf.tidy(() => {
			const sum = Word2Vec.addOrSubtract(this.model, inputs, "ADD");
			const result = Word2Vec.nearest(
				this.model,
				sum,
				inputs.length,
				inputs.length + max
			);
			if (callback) {
				callback(undefined, result);
			}
			return result;
		});
	}

	async subtract(inputs, maxOrCb, cb) {
		const { max, callback } = Word2Vec.parser(maxOrCb, cb, 10);

		await this.ready;
		return tf.tidy(() => {
			const subtraction = Word2Vec.addOrSubtract(
				this.model,
				inputs,
				"SUBTRACT"
			);
			const result = Word2Vec.nearest(
				this.model,
				subtraction,
				inputs.length,
				inputs.length + max
			);
			if (callback) {
				callback(undefined, result);
			}
			return result;
		});
	}

	async average(inputs, maxOrCb, cb) {
		const { max, callback } = Word2Vec.parser(maxOrCb, cb, 10);

		await this.ready;
		return tf.tidy(() => {
			const sum = Word2Vec.addOrSubtract(this.model, inputs, "ADD");
			const avg = tf.div(sum, tf.tensor(inputs.length));
			const result = Word2Vec.nearest(
				this.model,
				avg,
				inputs.length,
				inputs.length + max
			);
			if (callback) {
				callback(undefined, result);
			}
			return result;
		});
	}

	async nearest(input, maxOrCb, cb) {
		const { max, callback } = Word2Vec.parser(maxOrCb, cb, 10);

		await this.ready;
		const vector = this.model[input];
		let result;
		if (vector) {
			result = Word2Vec.nearest(this.model, vector, 1, max + 1);
		} else {
			result = null;
		}

		if (callback) {
			callback(undefined, result);
		}
		return result;
	}

	async getRandomWord(callback) {
		await this.ready;
		const words = Object.keys(this.model);
		const result = words[Math.floor(Math.random() * words.length)];
		if (callback) {
			callback(undefined, result);
		}
		return result;
	}

	static parser(maxOrCallback, cb, defaultMax) {
		let max = defaultMax;
		let callback = cb;

		if (typeof maxOrCallback === "function") {
			callback = maxOrCallback;
		} else if (typeof maxOrCallback === "number") {
			max = maxOrCallback;
		}
		return { max, callback };
	}

	static addOrSubtract(model, values, operation) {
		return tf.tidy(() => {
			const vectors = [];
			const notFound = [];
			if (values.length < 2) {
				throw new Error("Invalid input, must be passed more than 1 value");
			}
			values.forEach(value => {
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
			if (operation === "ADD") {
				for (let i = 1; i < vectors.length; i += 1) {
					result = tf.add(result, vectors[i]);
				}
			} else {
				for (let i = 1; i < vectors.length; i += 1) {
					result = tf.sub(result, vectors[i]);
				}
			}
			return result;
		});
	}

	static nearest(model, input, start, max) {
		const nearestVectors = [];
		Object.keys(model).forEach(word => {
			const distance = tf.util.distSquared(
				input.dataSync(),
				model[word].dataSync()
			);
			nearestVectors.push({ word, distance });
		});
		nearestVectors.sort((a, b) => a.distance - b.distance);
		return nearestVectors.slice(start, max);
	}
}

const word2vec = (model, cb) => new Word2Vec(model, cb);

export default word2vec;
