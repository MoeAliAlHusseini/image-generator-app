"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
    const [prompt, setPrompt] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const generateImage = async () => {
        setLoading(true);
        setImage(null);
        try {
            const res = await axios.post("/api/generate-image", { prompt });
            if (res.data.imageUrl) {
                setImage(res.data.imageUrl);
            } else {
                alert("Error: No image generated");
            }
        } catch (error) {
            console.error("Error fetching image:", error);
            alert("Failed to generate image");
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">AI Image Generator</h1>
            <input
                type="text"
                placeholder="Enter a prompt..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="border p-2 rounded w-full max-w-md"
            />
            <button
                onClick={generateImage}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                disabled={loading}
            >
                {loading ? "Generating..." : "Generate"}
            </button>
            {image && <img src={image} alt="AI Generated" className="mt-4 rounded shadow-lg" />}
        </div>
    );
}
