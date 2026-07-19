import readline from "readline-sync";
import ollama from "ollama";

let question = readline.question("Ask something about the exchange rate: ");

const ToolsAvailable = [
  {
    type: "function",
    function: {
      name: "get_Current_Currency_Price",
      description: "Get the current exchange rate between two currencies",
      parameters: {
        type: "object",
        properties: {
          from: { type: "string", description: "Currency code, e.g. USD" },
          to: { type: "string", description: "Currency code, e.g. INR" },
        },
        required: ["from", "to"],
      },
    },
  },
];

const PROMPT = `
You must ONLY use tool outputs for numbers.
Ignore your own knowledge completely if tool output is provided.
Repeat the tool output verbatim.
`;

let messages = [
  { role: "system", content: PROMPT },
  { role: "user", content: question },
];

const main = async () => {
  let response = await ollama.chat({
    model: "llama3.2",
    url: "http://localhost:11434",
    options: { temperature: 0 },
    tools: ToolsAvailable,
    messages: messages,
  });

  messages.push(response.message);
  const { from, to } = response.message.tool_calls[0].function.arguments;

  const apiResponse = await fetch(`https://open.er-api.com/v6/latest/${from}`);
  const data = await apiResponse.json();
  const rate = data.rates[to];

  console.log(`1 ${from} = ${rate} ${to}`);

  messages.push({
    role: "function",
    name: "get_Current_Currency_Price",
    content: `1 ${from} = ${rate} ${to}`,
  });

  const finalResponse = await ollama.chat({
    model: "llama3.2",
    url: "http://localhost:11434",
    options: { temperature: 0 },
    messages: messages,
  });

  console.log(finalResponse.message.content);
};

main();
