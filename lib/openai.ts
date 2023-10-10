import OpenAI from "openai";

/**
 * OpenAI API client
 */

const openAIClientSingleton = () => {
  if (!process.env.OPENAI_API_KEY) {
    return undefined;
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

type OpenAIClientSingleton = ReturnType<typeof openAIClientSingleton>;

const globalForOpenAI = globalThis as unknown as {
  openAI: OpenAIClientSingleton | undefined;
};

let openAI = globalForOpenAI.openAI ?? openAIClientSingleton();

if (process.env.NODE_ENV !== "production") globalForOpenAI.openAI = openAI;

/**
 * Whisper helper
 */

interface WhisperProps {
  mode?: string;
  file: File;
  model?: string;
  prompt?: string;
  response_format?: "json" | "text" | "srt" | "verbose_json" | "vtt";
  temperature?: number;
  language?: string;
  tempOpenAiKey?: string;
}

export async function whisper({
  mode = "transcriptions",
  file,
  model = "whisper-1",
  prompt = "",
  response_format = "json",
  temperature = 0,
  language = "en",
  tempOpenAiKey,
}: WhisperProps) {
  if (!process.env.OPENAI_API_KEY && openAI?.apiKey !== tempOpenAiKey) {
    console.log("whisper: using tempOpenAiKey");
    openAI = new OpenAI({
      apiKey: tempOpenAiKey,
    });
  }

  if (!openAI) {
    throw new Error("OpenAI client not ready. Are you sure OPENAI_API_KEY is set?");
  }

  if (mode === "Translations") {
    console.log("whisper: translations");
    return await openAI.audio.translations.create({
      file,
      model,
      prompt,
      response_format,
      temperature,
    });
  } else {
    console.log("whisper: transcriptions", language);
    return await openAI.audio.transcriptions.create({
      file,
      model,
      prompt,
      response_format,
      temperature,
      language,
    });
  }
}
