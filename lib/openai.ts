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

export const openAI = globalForOpenAI.openAI ?? openAIClientSingleton();

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
}

export async function whisper({
  mode = "transcriptions",
  file,
  model = "whisper-1",
  prompt = "",
  response_format = "json",
  temperature = 0,
  language = "en",
}: WhisperProps) {
  if (!openAI)
    throw new Error(
      "OpenAI client not ready. Are you sure you set OPENAI_API_KEY in your .env.local file?"
    );

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
