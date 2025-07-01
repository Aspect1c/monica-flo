import { GeneratedImage } from "../types";

const STABILITY_API_KEY = import.meta.env.VITE_STABILITY_API_KEY;
const BASE_URL = "https://api.stability.ai";

const generateStabilityImage = async (
  prompt: string,
  style: string,
  endpoint: string,
  modelName: string
): Promise<GeneratedImage> => {
  try {
    if (!STABILITY_API_KEY) {
      throw new Error(
        "API key is missing. Please add your Stability AI key to the .env file."
      );
    }

    const fullPrompt =
      style && style !== "realistic" ? `${prompt} in ${style} style` : prompt;

    // Updated request payload to match Stability AI API requirements
    const requestBody = {
      text_prompts: [
        {
          text: fullPrompt,
          weight: 1,
        },
      ],
      cfg_scale: 7,
      height: 1024,
      width: 1024,
      steps: 30,
      samples: 1,
    };

    console.log(`Sending request to ${modelName} with prompt: ${fullPrompt}`);

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${STABILITY_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`${modelName} API error response:`, errorText);

      try {
        const errorData = JSON.parse(errorText);
        const errorMessage =
          errorData?.message || `${response.status} - ${response.statusText}`;
        throw new Error(
          `Stability AI ${modelName} Error: ${response.status} - ${errorMessage}`
        );
      } catch (e) {
        throw new Error(
          `Stability AI ${modelName} Error: ${response.status} - ${
            errorText || response.statusText
          }`
        );
      }
    }

    // Parse the JSON response
    const data = await response.json();

    // Extract the base64 image from the response
    if (!data.artifacts || !data.artifacts.length) {
      throw new Error(`No image data returned from ${modelName}`);
    }

    // Convert base64 to blob
    const base64Data = data.artifacts[0].base64;
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: "image/png" });
    const imageUrl = URL.createObjectURL(blob);

    return {
      id: `stability-${modelName.toLowerCase()}-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      url: imageUrl,
      prompt: fullPrompt,
      style,
      timestamp: Date.now(),
      modelName,
    };
  } catch (error) {
    console.error(`Error generating Stability ${modelName} image:`, error);
    throw error;
  }
};

export const generateStabilityUltraImage = async (
  prompt: string,
  style: string
): Promise<GeneratedImage> => {
  return generateStabilityImage(
    prompt,
    style,
    "/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
    "Stability Ultra"
  );
};

export const generateStabilityCoreImage = async (
  prompt: string,
  style: string
): Promise<GeneratedImage> => {
  return generateStabilityImage(
    prompt,
    style,
    "/v1/generation/stable-diffusion-v1-6/text-to-image",
    "Stability Core"
  );
};
