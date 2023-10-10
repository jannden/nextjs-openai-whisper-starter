"use client";

import React from "react";

import { useSettings } from "@/lib/stores/settings";
import { useTranscriptions } from "@/lib/stores/transcriptions";

import List from "@/components/List";
import RecordButton from "@/components/RecordButton";
import KeyInput from "@/components/KeyInput";
import { useKey } from "@/lib/stores/key";

export default function RecordPage({ hasApiKey }: { hasApiKey: boolean }) {
  const key = useKey((state) => state.key);
  const dataCount = useTranscriptions((state) => state.count);
  const dataItems = useTranscriptions((state) => state.items);
  const addDataItems = useTranscriptions((state) => state.add);

  const minDecibels = useSettings((state) => state.minDecibels);
  const maxPause = useSettings((state) => state.maxPause);
  const language = useSettings((state) => state.language);
  const temperature = useSettings((state) => state.temperature);
  const endpoint = useSettings((state) => state.endpoint);
  const saveFile = useSettings((state) => state.saveFile);

  const listRef = React.useRef<HTMLDivElement>(null);
  const mediaRef = React.useRef<MediaRecorder>();
  const chunksRef = React.useRef<Array<Blob | Buffer | ArrayBuffer | Uint8Array>>([]);
  const animFrame = React.useRef<number>(0);
  const timerCount = React.useRef<NodeJS.Timeout>();

  const abortControllerRef = React.useRef<AbortController>();

  const [sendCount, setSendCount] = React.useState(0);

  const startRef = React.useRef("default");
  const recordRef = React.useRef(false);
  const countDownRef = React.useRef(false);
  const countRef = React.useRef(0);
  const recordDateTime = React.useRef("");

  const [isReady, setReady] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const [isRecording, setRecording] = React.useState(false);
  const [startState, setStartState] = React.useState("default");

  const [isCountDown, setCountDown] = React.useState(false);

  const [isMounted, setMounted] = React.useState(false);

  const checkAudioLevel = (stream: MediaStream) => {
    const audioContext = new AudioContext();
    const audioStreamSource = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.maxDecibels = -10;
    analyser.minDecibels = Number(minDecibels);
    audioStreamSource.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const domainData = new Uint8Array(bufferLength);

    const detectSound = () => {
      let soundDetected = false;

      analyser.getByteFrequencyData(domainData);

      for (let i = 0; i < bufferLength; i++) {
        if (domainData[i] > 0) {
          soundDetected = true;
        }
      }

      if (soundDetected === true) {
        if (recordRef.current) {
          if (countDownRef.current) {
            setCountDown(false);
            countDownRef.current = false;
            countRef.current = 0;
          }
        } else {
          if (startRef.current === "active") {
            recordDateTime.current = new Date().toISOString();

            setRecording(true);
            recordRef.current = true;

            setCountDown(false);
            countDownRef.current = false;
            countRef.current = 0;

            if (mediaRef.current) {
              mediaRef.current.start();
            }
          }
        }
      } else {
        if (recordRef.current) {
          if (countDownRef.current) {
            if (countRef.current >= Number(maxPause)) {
              if (startRef.current === "active") {
                setRecording(false);
                recordRef.current = false;

                setCountDown(false);
                countDownRef.current = false;
                countRef.current = 0;

                if (mediaRef.current) {
                  mediaRef.current.stop();
                }
              }
            }
          } else {
            setCountDown(true);
            countDownRef.current = true;
            countRef.current = 0;
          }
        }
      }

      animFrame.current = window.requestAnimationFrame(detectSound);
    };

    animFrame.current = window.requestAnimationFrame(detectSound);
  };

  const handleStream = (stream: MediaStream) => {
    try {
      mediaRef.current = new MediaRecorder(stream, {
        audioBitsPerSecond: 128000,
        mimeType: "audio/webm;codecs=opus",
      });
    } catch (error) {
      console.error(error);
      mediaRef.current = new MediaRecorder(stream, {
        audioBitsPerSecond: 128000,
      });
    }
    mediaRef.current.addEventListener("dataavailable", handleData);
    mediaRef.current.addEventListener("stop", handleStop);
    setReady(true);
    checkAudioLevel(stream);
  };

  const handleData = (e: { data: Blob | Buffer | ArrayBuffer | Uint8Array }) => {
    chunksRef.current.push(e.data);
  };

  const handleStop = () => {
    const blob = new Blob(chunksRef.current, { type: "audio/webm;codecs=opus" });
    const name = `file${Date.now()}` + Math.round(Math.random() * 100000);
    const file = new File([blob], `${name}.webm`);

    chunksRef.current = [];

    setSendCount((prev) => prev + 1);

    sendData(name, file);
  };

  const sendData = async (name: string, file: File) => {
    console.log(key, "key");
    let formData = new FormData();
    formData.append("file", file, `${name}.webm`);
    formData.append("name", name);
    formData.append(
      "options",
      JSON.stringify({
        language,
        endpoint,
        temperature,
        saveFile,
        key,
      })
    );

    console.log("[send data]", new Date().toLocaleTimeString());

    try {
      const url = "/api/";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
        signal: abortControllerRef.current?.signal,
      });

      if (response.status !== 200) {
        const result = await response.json();
        setErrorMessage(`Error response ${response.status}: ${result.error}`);
        console.error(response);
        return;
      }

      const result = await response.json();

      console.log("[received data]", new Date().toLocaleTimeString());

      const data = result?.data;
      addDataItems(data);
    } catch (err) {
      setErrorMessage("Error response, see log");
      console.log(err);
    } finally {
      setSendCount((prev) => prev - 1);
    }
  };

  const handleStart = () => {
    if (startRef.current === "default") {
      startRef.current = "active";

      setStartState("active");
    } else {
      if (mediaRef.current) {
        if (mediaRef.current.state !== "inactive") {
          mediaRef.current.stop();
        }
      }

      setRecording(false);
      recordRef.current = false;

      setCountDown(false);
      countDownRef.current = false;
      countRef.current = 0;

      startRef.current = "default";

      setStartState("default");
    }
  };

  React.useEffect(() => {
    abortControllerRef.current = new AbortController();
    setMounted(true);
    return () => {
      try {
        setMounted(false);
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      } catch (err) {
        console.error(err);
      }
    };
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    }, 900);
  }, [dataCount, dataItems]);

  React.useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(handleStream)
        .catch((err) => {
          console.error(err);
          setErrorMessage("Error calling getUserMedia");
        });
    } else {
      setErrorMessage("Media devices not supported");
    }
    return () => {
      try {
        window.cancelAnimationFrame(animFrame.current);
      } catch (error) {
        console.error(error);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minDecibels, maxPause, language, endpoint, temperature, key]);

  React.useEffect(() => {
    if (isCountDown) {
      timerCount.current = setInterval(() => {
        countRef.current += 100;
      }, 100);
    }
    return () => {
      clearInterval(timerCount.current);
    };
  }, [isCountDown]);

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {!hasApiKey && (
            <div className="block mb-6 max-w-md mx-auto">
              <KeyInput
                id="open-ai-api-key"
                label="Open AI API key"
                description="Paste your key here to test the functionality or clone this project from Github and set the env variable in .env.local"
              />
            </div>
          )}
          {hasApiKey || !!key ? (
            <div className="flex justify-center">
              <RecordButton
                disabled={!isReady}
                isRecording={isRecording}
                state={startState}
                onClick={handleStart}
                isSignalOn={sendCount > 0}
              />
            </div>
          ) : null}
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl py-6 px-6 lg:px-8">
          <div ref={listRef}>
            {!isReady && <div>{errorMessage}</div>}

            {isMounted && isReady && <List />}
          </div>
        </div>
      </main>
    </>
  );
}
