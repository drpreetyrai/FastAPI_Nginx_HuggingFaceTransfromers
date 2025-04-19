"use client"


import { useState } from "react";
import { Loader2 } from "lucide-react";

interface NLPDataInput {
  text?: string[];
  url?: string[];
  user_id: string;
}

interface PredictionResult {
  model_name: string;
  text?: string[];
  url?: string[];
  labels: string[];
  scores: number[];
  prediction_time: number;
  error?: string;
}

export default function Home() {
  const [model, setModel] = useState<string>("sentiment_analysis");
  const [text, setText] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [userId, setUserId] = useState<string>("preetyrai1212@gmail.com");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const API_URL = "http://127.0.0.1:8502/api/v1/";

  const handlePredict = async () => {
    setLoading(true);
    setResult(null);

    let data: NLPDataInput;
    if (model === "pose_classifier") {
      data = { url: [url], user_id: userId };
    } else {
      data = { text: [text], user_id: userId };
    }

    try {
      const res = await fetch(API_URL + model, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to fetch prediction");

      const json: PredictionResult = await res.json();
      setResult(json);
    } catch (err: any) {
      setResult({
        model_name: "",
        labels: [],
        scores: [],
        prediction_time: 0,
        error: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-2xl bg-red-500 mt-12 border border-gray-200">
      <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-8">
        🤖 ML Model Prediction Portal
      </h1>

      <div className="space-y-6">
        <div>
          <label className="block mb-2 text-lg font-semibold text-gray-700">Select Model:</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="sentiment_analysis">Sentiment Classifier</option>
            <option value="disaster_classifier">Disaster Classifier</option>
            <option value="pose_classifier">Pose Classifier</option>
          </select>
        </div>

        {model !== "pose_classifier" ? (
          <div>
            <label className="block mb-2 text-lg font-semibold text-gray-700">
              {model === "sentiment_analysis" ? "Movie Review" : "Tweet"}:
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder={model === "sentiment_analysis" ? "Enter movie review" : "Enter tweet"}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        ) : (
          <div>
            <label className="block mb-2 text-lg font-semibold text-gray-700">Image URL:</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="Enter image URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        )}

        <div>
          <label className="block mb-2 text-lg font-semibold text-gray-700">User ID:</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            placeholder="Enter user id"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>

        <button
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 transition"
          onClick={handlePredict}
          disabled={loading}
        >
          {loading ? (
            <span className="flex justify-center items-center gap-2">
              <Loader2 className="animate-spin" size={20} /> Predicting...
            </span>
          ) : (
            "Predict"
          )}
        </button>

        {result && (
          <div className="mt-6 p-4 rounded-xl border border-gray-300 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-700 mb-2">Result</h2>
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
