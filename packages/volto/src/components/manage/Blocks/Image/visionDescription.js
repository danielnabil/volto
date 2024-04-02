import fs from "fs";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";

class describeImage {
  constructor() {
    this.vision = new ChatGoogleGenerativeAI({
      apiKey: process.env.apiKey,
      modelName: "gemini-pro-vision",
      maxOutputTokens: 2048,
    });
  }

  /**
   * Describe an image using Google Generative AI.
   * @param {string} image - The image file in base64 format.
   * @returns {Promise<string>} - A promise resolving to the description of the image.
   */
  async processImage(image) {
    try {
      const input = [
        new HumanMessage({
          content: [
            {
              type: "text",
              text: `Generate a title and description for an image:
              Title: "Title"
              Description:"Description"
              `,
            },
            {
              type: "image_url",
              image_url: `data:image/png;base64,${image}`,
            },
          ],
        }),
      ];

      const response = await this.vision.invoke(input);
      console.log(response.content)
      const result=this.ConstructResult(response.content)

      return result;
    } catch (error) {
      console.error("Error processing image:", error);
      throw error;
    }
  }

  ConstructResult(text) {
    const titlePattern = /Title:\s*"?([^"]*)"?/;
    const descriptionPattern = /Description:\s*"?([^"]*)"?/;
    // Search for Title and Description using regex
    const titleMatch = text.match(titlePattern);
    const descriptionMatch = text.match(descriptionPattern);

    // Extract Title and Description
    const title = titleMatch ? titleMatch[1] : null;
    const description = descriptionMatch ? descriptionMatch[1] : null;
    // Extract title and description from the match
    const result = {
      title: title,
      description: description
    };
    
    return result;

  }
}


export default describeImage;
