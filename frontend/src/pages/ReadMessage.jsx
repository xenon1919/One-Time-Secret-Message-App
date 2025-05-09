import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import React from "react";
import { AlertTriangle, Loader2, LockOpen } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ReadMessage() {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  // eslint-disable-next-line no-unused-vars
  const requestId = useRef(Date.now());

  useEffect(() => {
    let ignore = false;

    const fetchMessage = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/message/${id}`);
        if (!ignore) {
          setMessage(res.data.content);
          setStatus("loaded");
        }
      } catch (err) {
        if (!ignore) {
          setStatus("error");
          setError(err.response?.data?.error || "Failed to load message");
        }
      }
    };

    fetchMessage();
    return () => {
      ignore = true;
    };
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <LockOpen size={24} className="text-blue-600" />
          Secret Message
        </h2>

        {status === "loading" && (
          <div className="flex flex-col items-center justify-center text-gray-600 animate-pulse">
            <Loader2 className="animate-spin mb-2" />
            <p>Loading your message...</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-red-600 flex flex-col items-center gap-2">
            <AlertTriangle size={32} />
            <p>{error}</p>
          </div>
        )}

        {status === "loaded" && (
          <div
            className="bg-gray-100 p-4 rounded text-gray-800 text-left whitespace-pre-wrap max-h-96 overflow-y-auto border border-gray-300"
            title="This message can only be read once and is now deleted"
          >
            {message}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-8 text-sm text-gray-500 text-center">
        This message will self-destruct after viewing. 🔥<br />
        &copy; {new Date().getFullYear()} Paranoia Post
      </footer>
    </div>
  );
}

export default ReadMessage;
