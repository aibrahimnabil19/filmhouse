import { openai } from "./client";
export async function createEmbedding(input) {
  if (!input || !input.trim()) throw new Error("Embedding input is empty");
  const response = await openai.embeddings.create({ model: "text-embedding-3-small", input });
  return response.data[0].embedding;
}
