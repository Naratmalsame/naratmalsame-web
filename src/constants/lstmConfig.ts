/**
 * LSTM 모델 설정
 */

/**
 * LSTM 모델 파일 경로
 */
export const LSTM_MODEL_PATH = "src/ai/lstm/tsfj/model.json";

/**
 * 외래어 판단 임계값
 * 이 값 이상의 예측 확률을 가진 단어를 외래어로 판단
 */
export const FOREIGN_WORD_THRESHOLD = 0.4;

/**
 * ETRI 형태소 분석에서 외래어로 인식할 품사 타입
 */
export const FOREIGN_POS_TYPES = ["NNG", "SL", "NNP"] as const;

/**
 * 외래어로 직접 판단할 품사 타입
 */
export const DIRECT_FOREIGN_POS = "SL";
