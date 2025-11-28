/**
 * TensorFlow.js 관련 유틸리티 함수
 */

import * as tf from "@tensorflow/tfjs";
import { SEQUENCE_PAD_LENGTH } from "../constants/tokenDictionary";

/**
 * 시퀀스를 고정 길이로 패딩합니다.
 * 길이가 부족하면 0으로 패딩하고, 초과하면 잘라냅니다.
 */
export function padSequences(tensor: tf.Tensor): tf.Tensor {
  const padLength = SEQUENCE_PAD_LENGTH - tensor.shape[0];

  if (padLength > 0) {
    const padValue = tf.zeros([padLength]);
    return tf.concat([tensor, padValue], 0);
  }

  return tensor.slice([0], [SEQUENCE_PAD_LENGTH]);
}

/**
 * 텐서 메모리를 정리합니다.
 */
export function disposeTensor(tensor: tf.Tensor | tf.Tensor[]): void {
  if (Array.isArray(tensor)) {
    tensor.forEach((t) => t.dispose());
  } else {
    tensor.dispose();
  }
}

/**
 * 모델 예측을 수행하고 결과를 반환합니다.
 */
export async function predictWithModel(
  model: tf.LayersModel,
  inputTensor: tf.Tensor
): Promise<number> {
  const prediction = model.predict(
    inputTensor.expandDims(0).expandDims(-1)
  ) as tf.Tensor;

  const predictionData = (await prediction.arraySync()) as number[][];
  const result = predictionData[0][0];

  prediction.dispose();

  return result;
}
