import { useState } from "react";
import axios from "axios";
import React from "react";
import { ClipboardCopy, RefreshCcw, Link as LinkIcon } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Home() {
  const [message, setMessage] = useState("");
  const [ttl, setTtl] = useState(1440);
  const [link, setLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return alert("Please enter a message.");
    try {
      const res = await axios.post(`${API_URL}/api/message`, { content: message, ttl });
      const generatedLink = `${window.location.origin}/read/${res.data.id}`;
      setLink(generatedLink);
      setMessage("");
    } catch (err) {
      console.error("Error creating message:", err);
      alert(`Error: ${err.response?.data?.error || "Unknown error"}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2">🔒 Paranoia Post</h1>
        <p className="text-center text-gray-500 mb-6">
          Send one-time self-destructing secret messages securely.
        </p>

        {link ? (
          <div className="space-y-4">
            <p className="text-gray-700">
              ✅ Your secret message link (expires in <b>{ttl} minutes</b>):
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={link}
                readOnly
                title="Your generated secure message link"
                className="w-full px-3 py-2 border rounded bg-gray-100 text-sm"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(link);
                  alert("Copied to clipboard!");
                }}
                className="p-2 bg-green-600 hover:bg-green-700 text-white rounded"
                title="Copy to clipboard"
              >
                <ClipboardCopy size={18} />
              </button>
            </div>

            <button
              onClick={() => setLink("")}
              className="w-full bg-gray-700 hover:bg-gray-800 text-white py-2 rounded flex items-center justify-center gap-2"
              title="Generate another message"
            >
              <RefreshCcw size={18} />
              Create Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your secret message..."
              title="This message will be stored temporarily and self-destruct after viewing"
              className="w-full p-3 border rounded h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Time:</label>
              <select
                value={ttl}
                onChange={(e) => setTtl(Number(e.target.value))}
                className="w-full p-2 border rounded"
                title="Select how long the message should live"
              >
                <option value={5}>Expire in 5 minutes</option>
                <option value={60}>Expire in 1 hour</option>
                <option value={1440}>Expire in 1 day</option>
                <option value={10080}>Expire in 1 week</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded flex items-center justify-center gap-2"
              title="Generate a secure one-time use message link"
            >
              <LinkIcon size={18} />
              Generate Message Link
            </button>
          </form>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-8 text-sm text-gray-500 text-center">
        Made with ❤️ by Paranoia Post Team &middot; One-time messages for your peace of mind.
      </footer>
    </div>
  );
}

export default Home;
