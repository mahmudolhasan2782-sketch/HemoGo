import { GoogleGenAI, Type } from "@google/genai";

// Safely initialize the AI client only if the key exists.
// This prevents the app from crashing on Vercel if the environment variable is missing.
const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (error) {
    console.warn("Failed to initialize Gemini Client, falling back to mock mode.");
  }
}

// Bengali Fallback Data (Mock Data for Demo/No-API mode)
const getBengaliFallbackData = () => {
  return {
    lessonContent: "সম্পদ (Assets) হলো এমন কিছু যার অর্থনৈতিক মূল্য আছে এবং যা কোনো ব্যক্তি বা প্রতিষ্ঠানের মালিকানাধীন। অন্যদিকে, দায় (Liabilities) হলো প্রতিষ্ঠানের আর্থিক বাধ্যবাধকতা যা ভবিষ্যতে পরিশোধ করতে হবে। মালিকানা স্বত্ব (Equity) হলো মোট সম্পদ থেকে মোট দায় বাদ দেওয়ার পর যা অবশিষ্ট থাকে।",
    questions: [
      {
        question: "নিচের কোনটি একটি সম্পদ (Asset)?",
        options: ["প্রদেয় হিসাব (Accounts Payable)", "নগদ টাকা (Cash)", "সাধারণ শেয়ার মূলধন", "রাজস্ব (Revenue)"],
        correctAnswer: 1,
        explanation: "নগদ টাকা হলো প্রতিষ্ঠানের মালিকানাধীন একটি সম্পদ।"
      },
      {
        question: "হিসাববিজ্ঞানের মৌলিক সমীকরণটি কী?",
        options: ["সম্পদ = দায় - মালিকানা স্বত্ব", "সম্পদ + দায় = মালিকানা স্বত্ব", "সম্পদ = দায় + মালিকানা স্বত্ব", "সম্পদ = আয় - ব্যয়"],
        correctAnswer: 2,
        explanation: "হিসাববিজ্ঞানের মৌলিক সমীকরণ হলো: সম্পদ = দায় + মালিকানা স্বত্ব।"
      },
      {
        question: "মালিকানা স্বত্ব (Equity) কখন বৃদ্ধি পায়?",
        options: ["ব্যয় বৃদ্ধি পেলে", "উত্তোলন করলে", "রাজস্ব বা আয় বৃদ্ধি পেলে", "দায় পরিশোধ করলে"],
        correctAnswer: 2,
        explanation: "প্রতিষ্ঠান আয় বা রাজস্ব অর্জন করলে মালিকানা স্বত্ব বৃদ্ধি পায়।"
      }
    ]
  };
};

export const generateAccountingQuiz = async (topic: string): Promise<any> => {
  // 1. Check if AI client is initialized. If not (No API Key), return Mock Data immediately.
  if (!ai) {
    console.log("No API Key detected. Returning Bengali Mock Data.");
    // Simulate a short delay to feel like an API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    return getBengaliFallbackData();
  }

  try {
    const model = 'gemini-2.5-flash';
    // Updated prompt to enforce Bengali Language
    const prompt = `Act as an expert Accounting tutor for Bengali students. Create a short accounting lesson about "${topic}" strictly in Bengali language (Bangla). Do not use English words in the content. Follow the lesson with 3 multiple choice questions in Bengali based on the lesson.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lessonContent: { type: Type.STRING, description: "A brief accounting lesson text in Bengali." },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING, description: "Question in Bengali" },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Array of 4 possible answers in Bengali"
                  },
                  correctAnswer: { type: Type.INTEGER, description: "Index of the correct answer (0-3)" },
                  explanation: { type: Type.STRING, description: "Explanation in Bengali" }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No data returned");
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback in Bengali (Bangla) if API fails
    return getBengaliFallbackData();
  }
};