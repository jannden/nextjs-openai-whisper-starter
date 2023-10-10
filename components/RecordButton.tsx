import { CircleOff, Dot, Mic, Power, Radio } from "lucide-react";

type ButtonProps = {
  children: React.ReactNode;
  isDisabled?: boolean;
  onClick?: () => void;
};

const Button = ({ children, isDisabled, onClick }: ButtonProps) => {
  const classNameDisabled = "bg-white text-gray-900 ring-1 ring-inset ring-gray-300";
  const classNameNormal =
    "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`w-64 inline-flex justify-center items-center gap-x-2 rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-sm ${
        isDisabled ? classNameDisabled : classNameNormal
      }`}
    >
      {children}
    </button>
  );
};

export default function RecordButton({
  disabled = false,
  isRecording = false,
  isSignalOn = false,
  state = "default",
  onClick = () => {},
}) {
  if (isSignalOn) {
    return (
      <Button isDisabled>
        <Radio className="h-5 w-5 animate-pulse" aria-hidden="true" /> Transcribing...
      </Button>
    );
  }
  if (disabled) {
    return (
      <Button isDisabled>
        <CircleOff className="h-5 w-5" aria-hidden="true" /> Waiting for the microphone
      </Button>
    );
  }
  if (state === "default") {
    return (
      <Button onClick={onClick}>
        <Power className="h-5 w-5" aria-hidden="true" /> Click to start
      </Button>
    );
  }
  if (isRecording) {
    return (
      <Button onClick={onClick}>
        <Mic className="h-5 w-5 animate-pulse" aria-hidden="true" /> Recording...
      </Button>
    );
  }
  return (
    <Button onClick={onClick}>
      <Dot className="h-5 w-5" aria-hidden="true" /> Waiting...
    </Button>
  );
}
