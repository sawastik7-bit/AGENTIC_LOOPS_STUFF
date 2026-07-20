import readline from "readline-sync";
import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();
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
You are not allowed to answer exchange rates from memory.

If a tool response exists, you MUST answer using ONLY the exact tool content.

Never estimate.
Never substitute numbers.
Never use prior knowledge.
`;

let messages = [
  { role: "system", content: PROMPT },
  { role: "user", content: question },
];
const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1", 
  apiKey:process.env.OPEN_ROUTER_API_KEY,
});
const main = async () => {
  let response = await client.chat.completions.create({
    model: "poolside/laguna-xs-2.1:free",
   
    options: { temperature: 0 },
    tools: ToolsAvailable,
    messages: messages,
  });
const parsedFunc = JSON.parse(
  response.choices[0].message.tool_calls[0].function.arguments
);

  messages.push(response.choices[0].message);
 const {from,to}=parsedFunc;

  console.log(from,to);
  const apiResponse = await fetch(`https://open.er-api.com/v6/latest/${from}`);
  const data = await apiResponse.json();
  const rate = data.rates[to];

  console.log(`1 ${from} = ${rate} ${to}`);

 messages.push({
  role: "tool",
  tool_call_id: response.choices[0].message.tool_calls[0].id,
  content: JSON.stringify({
    from,
    to,
    rate
  })
});

  const finalResponse = await client.chat.completions.create({
    model: "poolside/laguna-xs-2.1:free",
    
    options: { temperature: 0 },
    messages: messages,
  });

  console.log(finalResponse.choices[0].message.content);
};

main();
