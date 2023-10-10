"use client";

import React from "react";
import { Pause, PlaySquare } from "lucide-react";

type ReplayButtonProps = {
  filename: string;
  audioDomRef: React.MutableRefObject<HTMLAudioElement | undefined>;
};

export default function ReplayButton({ filename, audioDomRef }: ReplayButtonProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handleEnded = React.useCallback(() => {
    if (!audioDomRef.current) {
      console.error("audioDomRef.current is undefined in handleEnded");
      return;
    }
    setIsPlaying(false);
    audioDomRef.current.remove();
  }, [audioDomRef]);

  const handleError = React.useCallback((e: unknown) => {
    setIsPlaying(false);
    console.error(`Error playing audio: ${e}`);
  }, []);

  const getDuration = React.useCallback(() => {
    if (!audioDomRef.current) return;
    audioDomRef.current.currentTime = 0;
    audioDomRef.current.removeEventListener("timeupdate", getDuration);

    if (audioDomRef.current.duration === Infinity) {
      console.error(`Error playing audio: duration is Infinity`);
      return;
    }
  }, [audioDomRef]);

  const handleLoad = React.useCallback(() => {
    if (!audioDomRef.current) return;
    if (audioDomRef.current.duration === Infinity) {
      audioDomRef.current.currentTime = 1e101;
      audioDomRef.current.addEventListener("timeupdate", getDuration);
    }
  }, [audioDomRef, getDuration]);

  const playToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!audioDomRef.current) {
      console.error("audioDomRef.current is undefined in playToggle");
      return;
    }

    if (isPlaying) {
      audioDomRef.current.pause();
      setIsPlaying(false);
      return;
    }

    audioDomRef.current.addEventListener("loadedmetadata", handleLoad);
    audioDomRef.current.addEventListener("abort", handleEnded);
    audioDomRef.current.addEventListener("ended", handleEnded);
    audioDomRef.current.addEventListener("error", handleError);
    audioDomRef.current.src = `/uploads/${filename}`;

    const playPromise = audioDomRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then((_) => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error(error);
          setIsPlaying(false);
        });
    }
  };

  return <button onClick={playToggle}>{isPlaying ? <Pause /> : <PlaySquare />}</button>;
}
