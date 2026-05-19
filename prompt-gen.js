import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const PORTFOLIO_CONTEXT = `Bruno Bacelar is a Senior SDET (Software Development Engineer in Test), builder, and author.
His portfolio site (bruno-bacelar.vercel.app) uses Three.js for animated backgrounds and is deployed on Vercel.
He works at the intersection of quality engineering, software development, and technical writing.`;

const PROMPT_TYPES = {
  bio: "Write a compelling professional bio for the portfolio hero section.",
  project: "Generate a project description for a portfolio case study.",
  skills: "Write a skills section that highlights SDET expertise and tools.",
  testimonial: "Draft a professional testimonial request template.",
  "blog-intro": "Write an engaging blog post introduction for a technical article.",
  "about-me": "Write an authentic 'About Me' section that blends professional and personal voice.",
};

async function generatePrompt(type = "bio", extraContext = "") {
  const promptType = PROMPT_TYPES[type];
  if (!promptType) {
    const available = Object.keys(PROMPT_TYPES).join(", ");
    throw new Error(`Unknown prompt type "${type}". Available: ${available}`);
  }

  const userMessage = [
    `Portfolio owner context:\n${PORTFOLIO_CONTEXT}`,
    extraContext ? `Additional context:\n${extraContext}` : "",
    `Task: ${promptType}`,
    "Keep the tone professional yet approachable. Be specific and avoid generic filler.",
  ]
    .filter(Boolean)
    .join("\n\n");

  console.error(`Generating "${type}" prompt...\n`);

  const stream = client.messages.stream({
    model: "claude-opus-4-7",
    max_tokens: 1024,
    thinking: { type: "adaptive" },
    messages: [{ role: "user", content: userMessage }],
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      process.stdout.write(event.delta.text);
    }
  }

  process.stdout.write("\n");
}

const args = process.argv.slice(2);
const type = args[0] || "bio";
const extraContext = args.slice(1).join(" ");

generatePrompt(type, extraContext).catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
