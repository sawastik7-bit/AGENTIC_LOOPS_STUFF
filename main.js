import readline from 'readline-sync';



// first step is to how to take input from a user

let question=readline.question();

// these are the tools available
let ToolsAvailable=['get_Current_Currency_Price']

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
    {type:"system",content:PROMPT},
    {type:"user",content:question},

]

// Connection to the model 




