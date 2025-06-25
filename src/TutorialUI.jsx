import { useState } from "react";

export default function TutorialUI() {
  const [showPromptBox, setShowPromptBox] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch("http://localhost:5000/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const text = await res.clone().text();
      if (!res.ok) {
        console.error("Server error:", res.status, text);
        setResponse(`Error: ${res.status} – ${text}`);
        return;
      }
      const data = JSON.parse(text);
      setResponse(data.reply);
    } catch (err) {
      console.error("Fetch error:", err);
      setResponse(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => navigator.clipboard.writeText(response);

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border shadow rounded space-y-4">
      <button
        onClick={() => setShowPromptBox(true)}
        className="text-left bg-gray-100 p-4 rounded hover:bg-gray-200 w-full"
      >
        📄 Week03_Tutorial.pdf
      </button>

      {showPromptBox && (
        <div className="space-y-3">
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Enter your prompt..."
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </div>
      )}

      {response && (
        <div className="border p-4 bg-gray-50 rounded relative">
          <pre className="whitespace-pre-wrap">{response}</pre>
          <button
            onClick={copyToClipboard}
            className="absolute right-2 bottom-2 text-sm text-blue-600 underline"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}
