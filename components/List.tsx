"use client";

import React from "react";
import { Trash } from "lucide-react";

import { useTranscriptions } from "@/lib/stores/transcriptions";
import ReplayButton from "@/components/ReplayButton";

export default function List() {
  const audioDomRef = React.useRef<HTMLAudioElement>();
  const transcribedList = useTranscriptions((state) => state.items);
  const deleteTranscription = useTranscriptions((state) => state.delete);

  React.useEffect(() => {
    audioDomRef.current = new Audio();
    return audioDomRef.current?.remove();
  }, []);

  return (
    <ul role="list" className="divide-y divide-gray-200">
      {transcribedList.map((w, i) => (
        <li key={i} className="py-5">
          <div className="flex items-baseline justify-between gap-x-4">
            <p className="text-sm font-semibold leading-6 text-gray-900">
              <time dateTime={w.dateTime}>{w.dateTime}</time>
            </p>
            <div className="flex gap-x-3">
              {w.filename && (
                <p className="flex-none text-xs text-gray-600">
                  <ReplayButton filename={w.filename} audioDomRef={audioDomRef} />
                </p>
              )}
              <p className="flex-none text-xs text-gray-600">
                <button onClick={() => deleteTranscription(w.id)}>
                  <Trash />
                </button>
              </p>
            </div>
          </div>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-600">{w.transcription}</p>
        </li>
      ))}
    </ul>
  );
}
