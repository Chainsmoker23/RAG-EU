
import { GoogleGenAI, Modality } from "@google/genai";
import type { UploadedFile } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Please set it to use the Gemini API.");
}

const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// For complex reasoning tasks with RAG context
export const generatePolicyResponse = async (question: string, context: UploadedFile[]) => {
    const ai = getAIClient();
    const model = 'gemini-2.5-pro';

    const contextString = context.map(file => `
      --- START OF DOCUMENT: ${file.name} ---
      ${file.content}
      --- END OF DOCUMENT: ${file.name} ---
    `).join('\n\n');

    const prompt = `You are an expert EU transportation policy analyst. Your task is to answer the user's question based *only* on the provided documents.
    
    Do not use any external knowledge. If the answer is not in the documents, state that clearly.
    
    When you use information from a document, you MUST cite it at the end of the sentence like this: [Source: document_name.txt].
    
    Here are the available documents:
    ${contextString}
    
    Here is the user's question:
    "${question}"
    
    Provide a comprehensive and structured answer.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
      }
    });
    return response.text;
};

// For web-grounded, up-to-date answers
export const generateGroundedResponse = async (prompt: string, useMaps: boolean, location?: GeolocationCoordinates) => {
    const ai = getAIClient();
    const model = 'gemini-2.5-flash';
    
    const tools = useMaps ? [{googleMaps: {}}] : [{googleSearch: {}}];
    let toolConfig;
    if (useMaps && location) {
      toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: location.latitude,
            longitude: location.longitude,
          }
        }
      };
    }

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            tools,
            ...(toolConfig && { toolConfig }),
        },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks.map((chunk: any) => ({
      uri: chunk.web?.uri || chunk.maps?.uri || '#',
      title: chunk.web?.title || chunk.maps?.title || 'Source',
    }));

    return { text: response.text, sources };
};

// For image editing
export const editImageWithPrompt = async (base64Image: string, mimeType: string, prompt: string) => {
    const ai = getAIClient();
    const model = 'gemini-2.5-flash-image';

    const response = await ai.models.generateContent({
        model,
        contents: {
            parts: [
                { inlineData: { data: base64Image, mimeType } },
                { text: prompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData) {
        return part.inlineData.data;
    }
    throw new Error("No image was generated.");
};

// For simple conversational chat
export const getChatResponse = async (prompt: string) => {
    const ai = getAIClient();
    const model = 'gemini-2.5-flash';

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
};

// For generating structured policy reports
export const generatePolicyReport = async (topic: string, context: UploadedFile[]) => {
  const ai = getAIClient();
  const model = 'gemini-2.5-pro';

  const contextString = context.map(file => `
    --- START OF DOCUMENT: ${file.name} ---
    ${file.content}
    --- END OF DOCUMENT: ${file.name} ---
  `).join('\n\n');

  const prompt = `You are an expert EU transportation policy advisor. Your task is to generate a comprehensive policy brief on the topic: "${topic}".
  
  Use the provided documents as the primary source of information and evidence.
  
  The report must be structured in Markdown format and include the following sections:
  1.  **Executive Summary**: A concise overview of the key issues and recommendations.
  2.  **Policy Options**: Propose 3 to 5 distinct, actionable policy options. For each option, provide a brief description, potential benefits, and challenges.
  3.  **Key Performance Indicators (KPIs)**: Suggest measurable KPIs to track the success of the proposed policies.
  4.  **Timeline Suggestions**: Outline a high-level implementation timeline.
  5.  **Source Appendix**: List the documents used for this report.
  
  Here are the available documents:
  ${contextString}
  
  Generate the full report now.
  `;
  
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
    }
  });
  return response.text;
}
