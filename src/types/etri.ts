/**
 * ETRI API 관련 타입 정의
 */

export interface MorphData {
  id: number;
  lemma: string;
  type: string;
  position: number;
  weight: number;
}

export interface SentenceData {
  id: number;
  morp: MorphData[];
  text: string;
}

export interface ETRIResponse {
  return_object: {
    sentence: SentenceData[];
  };
}

export interface MorphemeAnalysisResult {
  morphemeList: MorphemeItem[];
  sentenceList: string[];
}

export interface MorphemeItem {
  lemma: string;
  type: string;
}
