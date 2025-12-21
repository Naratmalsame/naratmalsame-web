import axios from "axios";
import type { MorphData, SentenceData, MorphemeItem } from "../types/etri";

export interface MorphemeAnalysisResult {
  morphemeList: MorphemeItem[];
  sentenceList: string[];
}

export const analyzeMorpheme = async (
  parsedText: string
): Promise<MorphemeAnalysisResult> => {
  const URL = import.meta.env.VITE_ETRI_ADDRESS;
  const API_KEY = import.meta.env.VITE_ETRI_KEY;

  const morphemeList: MorphemeItem[] = [];
  const sentenceList: string[] = [];

  try {
    const response = await axios.post(
      URL,
      {
        argument: {
          analysis_code: "morp",
          text: parsedText,
        },
      },
      {
        headers: {
          Authorization: API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    response.data.return_object.sentence.forEach((sentence: SentenceData) => {
      sentenceList.push(sentence.text);

      sentence.morp.forEach((morp: MorphData) => {
        if (morp.type === "NNG" || morp.type === "SL" || morp.type === "NNP") {
          morphemeList.push({
            lemma: morp.lemma,
            type: morp.type,
          });
        }
      });
    });
  } catch (error) {
    console.error("API 호출 중 에러 발생", error);
  }

  return { morphemeList, sentenceList };
};
