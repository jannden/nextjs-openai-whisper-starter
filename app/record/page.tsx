import RecordPage from "@/components/RecordPage";

const hasApiKeyInEnv: boolean = !!process.env.OPENAI_API_KEY;

export default function Record() {
  return <RecordPage hasApiKey={hasApiKeyInEnv} />;
}
