import readline from 'readline-sync';
import ollama from 'ollama';
import { json } from 'express';


// first step is to how to take input from a user

let question=readline.question("Ask something about the exchange rate: ");

// these are the tools available
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
// This is the prompt 
const PROMPT=`
Your are an Ai assistant which have power to understand , plan , decide, execute and produce output
you understand the input given from user and what tool to call if needed in that instruction
You will be given access to the tools which you can choose also a message array for memory persistence 
You will decide what necessary actions to perform to produce correct output
eg. Tools available let ToolsAvailable=['get_Current_Currency_Price']

`




// create a messages array to store all of  the messsages inn form or objects
let messages=[
    {role:"system",content:PROMPT},
    {role:"user",content:question},

]



let response=await ollama.chat({
     model:"llama3.2",
    url:"http://localhost:11434",
    options:{
        temperature:1.0
    },
    tools:ToolsAvailable,
    messages:messages
})

console.log(JSON.stringify(response.message));
// now push back the message to the array of messages



