import Input from "@/components/Input";
import Select from "@/components/Select";
import React from "react";

export default function Settings() {
  return (
    <main>
      <div className="mx-auto max-w-7xl py-6 px-6 lg:px-8">
        <div className="space-y-12">
          <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-8">
            <Input id="prompt" label="Prompt" stateName="prompt" actionName="setPrompt" />
            <Select
              id="max-pause"
              label="Max Pause (ms)"
              options={["2500", "3000", "3500", "4000", "4500", "5000"]}
              stateName="maxPause"
              actionName="setMaxPause"
            />
            <Select
              id="min-decibels"
              label="Min Decibels (dB)"
              options={["-70", "-65", "-60", "-55", "-50", "-45", "-40", "-35", "-30"]}
              stateName="minDecibels"
              actionName="setMinDecibels"
            />
            <Select
              id="temperature"
              label="Temperature"
              options={["0", "0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1"]}
              stateName="temperature"
              actionName="setTemperature"
            />
            <Select
              id="save-file"
              label="Save audio to file"
              options={["no", "yes"]}
              stateName="saveFile"
              actionName="setSaveFile"
            />
            <Select
              id="endpoint"
              label="Endpoint"
              options={["Transcriptions", "Translations"]}
              stateName="endpoint"
              actionName="setEndpoint"
            />
            <Select
              id="language"
              label="Language for transcription"
              options={["en", "de", "es", "it", "sk", "cs", "bg"]}
              stateName="language"
              actionName="setLanguage"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
