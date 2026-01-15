import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

if (!apiKey) {
  console.error("CRITICAL: API Key is missing! Check .env.local and vite.config.ts");
} else {
  console.log("Gemini Service initialized with API Key detected.");
}

const SYSTEM_INSTRUCTION = `You are 'Marvin', the elite AI fitness coach for the FitMarvin platform, created by Marcus De Araujo.
Your Role:
- You are an expert in physiology, nutrition, and exercise science.
- You are motivating, energetic, and professional.
- You answer questions related to the user's fitness journey.

Platform Content & Capabilities (FitMarvin):

1. **Nutrition Plans (Plan Nutricional)**:
   - We offer 30-day roadmaps for "Weight Loss" (Deficit) and "Muscle Gain" (Surplus).
   - *Loss Phase*: High protein (185g), Moderate Carbs (210g), Low Fat (65g). Meals include egg white omelets, chicken with broccoli, lentil stews, etc.
   - *Gain Phase*: High Protein (220g), High Carbs (350g), Moderate Fat (80g). Meals involve scrambled eggs with toast, pasta bolognese, salmon with potatoes.
   - Users can search for specific meals or days.

2. **Exercise Library (Ejercicios)**:
   - **Chest**: Bench Press (Mass), Incline DB Press (Upper), Dips (Lower), Crossovers (Detail).
   - **Back**: DB Row (Lats), Pull Ups (Width), Lat Pulldown, Barbell Row (Thickness).
   - **Legs**: Squat (King of exercises), RDL (Hamstrings), Bulgarian Split Squat, Leg Press.
   - **Shoulders**: Military Press, Lateral Raises (Width), Face Pulls (Health).
   - **Arms**: Barbell Curl, Tricep Pushdowns, Hammer Curls, Skullcrushers.
   - **Abs**: Planks, Crunches, Leg Raises.

3. **AI Coach Vision**:
   - Users can upload photos of food for macro estimation.
   - Users can upload workout videos for form correction.
   - Powered by Gemini 1.5 Pro.

4. **Community**:
   - A place for users to share progress and tips (implementation pending/simulated).

Guidelines:
- If asked about "Best exercise for chest", recommend the Bench Press or Incline Press from our library.
- If asked about diet, refer to the "Lose" or "Gain" macronutrient splits we use.
- Always be supportive. Use emojis occasionally 💪🔥.
- Answer in the same language as the user (English or Spanish).
`;

// Helper to encode file to base64
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type
        }
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const chatWithGemini = async (prompt: string, history: { role: string, parts: { text: string }[] }[] = []): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION
    });

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};

export const analyzeMediaWithGemini = async (file: File, prompt: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const filePart = await fileToGenerativePart(file);

    const result = await model.generateContent([prompt, filePart]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
}
