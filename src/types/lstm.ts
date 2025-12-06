/**
 * LSTM 모델 관련 타입 정의
 */

export interface MorphemeListItem {
  lemma: string;
  type: string;
}

export interface LSTMResponse {
  foreignWords: string[];
  sentenceList: string[];
}

export interface Sentence {
  text: string;
  start: number;
  end: number;
  isComplete: boolean;
}

export interface TextNodeInfo {
  node: any; // TextNode
  nodeStart: number;
  nodeEnd: number;
}

export interface SentenceProcessInfo {
  sentence: Sentence;
  sentenceId: string;
  sentenceKey: string;
  textNodesInSentence: TextNodeInfo[];
}
