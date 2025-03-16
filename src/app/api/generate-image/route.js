import axios from "axios";

export async function POST(req) {
    try {
        const { prompt } = await req.json();

        // Check if API key exists
        if (!process.env.HUGGINGFACE_API_KEY) {
            return new Response(
                JSON.stringify({ error: "Missing HUGGINGFACE_API_KEY" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        // Call Hugging Face API
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
            { inputs: prompt },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                responseType: "arraybuffer", // Get binary image data
            }
        );

        // Ensure response is an image
        const contentType = response.headers["content-type"];
        if (!contentType.startsWith("image")) {
            throw new Error("Hugging Face API returned an invalid response.");
        }

        // Convert binary data to base64
        const base64Image = Buffer.from(response.data, "binary").toString("base64");
        const imageUrl = `data:image/png;base64,${base64Image}`;

        return new Response(
            JSON.stringify({ imageUrl }),
            { headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error generating image:", error.response?.data || error.message);
        return new Response(
            JSON.stringify({ error: "Failed to generate image. Check API key and model status." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
