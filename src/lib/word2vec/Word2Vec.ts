// Copyright (c) 2018 ml5
// https://github.com/ml5js/ml5-library/blob/4e002da3f17800cd9fc3aca99a9b9b0e6f6c02f2/src/Word2vec/index.js

import * as tf from "@tensorflow/tfjs";
import { TensorLike1D } from "@tensorflow/tfjs-core/dist/types";
import { DataPoint, OperationType, SimilarWord } from "../../interfaces";
import { TSNE } from "./TSNE";

export class Word2Vec {
  model: { [key: string]: tf.Tensor1D } = {};
  modelSize: number = 0;
  modelLoaded: boolean = false;
  vectorDimensions: number = 0;
  steps: number = 500;

  constructor() {
    this.model = {};

    this.modelSize = 0;
    this.vectorDimensions = 0;
    this.modelLoaded = false;
  }

  loadModel(model: { vectors: { [key: string]: TensorLike1D } }) {
    return new Promise<void>((resolve, reject) => {
      try {
        Object.keys(model.vectors).forEach((word) => {
          this.model[word] = tf.tensor1d(model.vectors[word]);
        });

        this.vectorDimensions =
          model.vectors[Object.keys(model.vectors)[0]].length;

        this.modelSize = Object.keys(this.model).length;
        this.modelLoaded = true;
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  getCoordinates = async (
    inputs: string[],
    epsilon: number,
    perplexity: number,
    amount: number
  ): Promise<DataPoint[]> => {
    return new Promise((resolve, reject) => {
      try {
        const tsne = new TSNE({
          epsilon,
          perplexity,
        });

        let names: Array<string> = [];
        let inputForName: Array<string> = [];

        const vectors = tf.tidy(() => {
          let vectors: any = [];
          inputs.forEach((input) => {
            const vector = this.model[input];

            if (vector) {
              const result = Word2Vec.nearest(
                this.model,
                vector,
                1,
                amount + 1
              );

              const tmpResult = result.map((word: SimilarWord) => {
                names = [...names, word.word];
                inputForName = [...inputForName, input];
                return this.model[word.word].arraySync();
              });
              vectors = [...vectors, ...tmpResult];
            }
          });
          return vectors;
        });

        tsne.initDataRaw(vectors);

        for (var k = 0; k < this.steps; k++) {
          tsne.step();
        }

        var Y = tsne.getSolution();

        const data: DataPoint[] = Y.map((d: Array<number>, index: number) => ({
          x: d[0],
          y: d[1],
          z: d[2],
          name: names[index],
          input: inputForName[index],
        }));

        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  };

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
      return Word2Vec.nearest(
        this.model,
        sum,
        inputs.length,
        inputs.length + max
      ) as any;
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
      return "";
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
    Object.keys(model).forEach((word) => {
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

export const word2vec = (() => new Word2Vec())();
