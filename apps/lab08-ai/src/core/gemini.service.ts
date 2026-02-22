import type { Base64Image,ImageAnalysisResult  } from "./ai.interface";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { app } from "./firebase";
import { imageAnalysisSchema } from "./ai.interface";


export const ai = getAI(app, { backend: new GoogleAIBackend() });


export const visionModel = getGenerativeModel(ai, {
  // ลองเปลี่ยนเป็นชื่อโมเดลที่เป็นมาตรฐานที่สุดตัวใดตัวหนึ่งด้านล่างนี้:
  model: "gemini-2.0-flash", 
  // หากยังไม่ได้ ให้ลอง: model: "gemini-2.5-flash-lite" (ตามคำแนะนำในหน้า Firebase Console ของคุณ)
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: imageAnalysisSchema,
  },
});

export class GeminiVisionService {
  static async analyze(image: Base64Image): Promise<ImageAnalysisResult> {
    const prompt =
      `วิเคราะห์ภาพนี้และตอบกลับตาม JSON schema เท่านั้น\n` +
      `- caption: คำบรรยายสั้น 1 ประโยคภาษาไทย\n` +
      `- tags: คีย์เวิร์ด 3-8 คำ\n` +
      `- objects: ถ้าเห็นวัตถุเด่น ให้ระบุชื่อ\n` +
      `- safety: ถ้าเป็นภาพอ่อนไหวให้ทำเครื่องหมาย`;


    const imagePart = {
      inlineData: { data: image.base64, mimeType: image.mimeType },
    };


    const resp = await visionModel.generateContent([prompt, imagePart]);


    // เมื่อใช้ responseMimeType + responseSchema โดยปกติ resp.text จะเป็น JSON string
    const text = resp.response.text() ?? "{}";
    return JSON.parse(text) as ImageAnalysisResult;
  }
}
