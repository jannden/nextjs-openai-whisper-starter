import fs from "fs";
import path from "path";
import { cleanInput, guidGenerator } from "@/lib/utils";
import { whisper } from "@/lib/openai";

export async function POST(req) {
  const form = await req.formData();

  const blob = form.get("file");
  const name = cleanInput(form.get("name"));
  const raw_options = cleanInput(form.get("options"));

  if (!blob || !name) {
    return Response.json(
      { error: "Missing required fields" },
      {
        status: 400,
      }
    );
  }

  const options = JSON.parse(raw_options);

  if (!options.key && !process.env.OPENAI_API_KEY) {
    return Response.json(
      { error: "Missing OPENAI_API_KEY" },
      {
        status: 400,
      }
    );
  }

  let fileSize = parseInt(blob.size);

  let filename;
  let filepath;
  if (options.saveFile === "yes") {
    console.log("Saving file to disk");
    const buffer = Buffer.from(await blob.arrayBuffer());
    filename = `${name}.webm`;
    filepath = `${path.join("public", "uploads", filename)}`;

    fs.writeFileSync(filepath, buffer);

    const stats = fs.statSync(filepath);
    fileSize = parseInt(stats.size);
  }

  const minFileSize = 10000; // probably no audio data
  if (fileSize < minFileSize) {
    return Response.json(
      { error: `File size is too small: ${fileSize}` },
      {
        status: 400,
      }
    );
  }

  try {
    const transcription = await whisper({
      mode: options.endpoint,
      file: options.saveFile === "yes" ? fs.createReadStream(filepath) : blob,
      response_format: "text",
      temperature: Number(options.temperature),
      language: options.language,
      tempOpenAiKey: options.key,
    });

    console.log("transcription", transcription);
    return Response.json(
      {
        data: {
          id: guidGenerator(),
          filename,
          transcription,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
    return Response.json(
      {
        error: `Whisper error: ${error.message}`,
      },
      {
        status: 500,
      }
    );
  }
}
