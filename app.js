// import OpenAI from "openai";
import { config } from "dotenv";
config();

// const client = new OpenAI({
//     apiKey : process.env.GROK_API_KEY,
//     baseURL: "https://api.groq.com/openai/v1",
// })

// const response = await client.responses.create({
//     model: "openai/gpt-oss-20b",
//     input: "who is narendra modi",
// });
// console.log(response.output_text);

import Groq from "groq-sdk";
import { tavily } from "@tavily/core"; // here tavily is used to search on the browser basicaly toolcall ;

const tvly = tavily({apiKey : process.env.TAVILY_API_KEY})

const groq = new Groq({
    apiKey: process.env.GROK_API_KEY
})

async function main() {

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        // parameters used //

        
  /*  // Controls randomness: lowering results in less random completions.
    // As the temperature approaches zero, the model will become deterministic
    // and repetitive.
    temperature: 0.5,

    // The maximum number of tokens to generate. Requests can use up to
    // 2048 tokens shared between prompt and completion.
    max_completion_tokens: 1024,

    // Controls diversity via nucleus sampling: 0.5 means half of all
    // likelihood-weighted options are considered.
    top_p: 1,

    // A stop sequence is a predefined or user-specified text string that
    // signals an AI to stop generating content, ensuring its responses
    // remain focused and concise. Examples include punctuation marks and
    // markers like "[end]".
    //
    // For this example, we will use ", 6" so that the llm stops counting at 5.
    // If multiple stop values are needed, an array of string may be passed,
    // stop: [", 6", ", six", ", Six"]
    stop: ", 6",

    // If set, partial message deltas will be sent.
    stream: true,

*/


    //    response_format: {type:"json_object"},

        

        // messages: [

        //     /*
        //     {
        //         role: "system",
        //         content: `you are a jarvis,a smart review grader, your works is to analyze the given review 
        //         and accordinglly return the sentiments. classify the review as positive,negative,neutral
        //         you must return the result in the valid JSON structure.
        //         // example : {"Sentiment" : "Negative" } //
        //             {
        //             "sentiment_analysis": {
        //             "sentiment": "positive|negative|neutral",
        //             "confidence_score": 0.95,
        //             "key_phrases": [
        //                 {
        //                 "phrase": "detected key phrase",
        //                 "sentiment": "positive|negative|neutral"
        //                 }
        //             ],
        //             "summary": "One sentence summary of the overall sentiment"
        //             }
        //         }`

        //     },
        //     {
        //         role: "user",
        //         content: `review : the headphone arrived quickly and looks great, but the left earcup
        //         stoped working after the week .`
        //                 }
        //         */
        // ],
       
        messages :[
            {
                role : "system",
                content:`you are smart personal assistent who can answer the question 
                you have the access of tools 
                1. webSearch({query})`
            },
            {
                role:"user",
                content: `what is the current weather of jaunpur`

            }
        ],
       
     tools: [ 
          {
      "type": "function",
      "function": {
        "name": "webSearch",
        "description": "search  the latest and realtime information on the internet",
        "parameters": {
          // JSON Schema object
          "type": "object",
          "properties": {
            "query": {
              "type": "string",
              "description": "The search query to perform search on "
            },
           
          },
          "required": ["query"]
        }
      }
    }
  ],
  tool_choice:"auto"
    });
    // console.log(JSON.stringify(completion.choices[0].message,null,2));

    const toolCall = completion.choices[0].message.tool_calls

    if(!toolCall){
        console.log(`Assistent : ${completion.choices[0].message.content}`)
        return;
    }

    for(const tool of toolCall){
        console.log("tool", tool);
        const funtionName = tool.function.name;
        const functionParams = tool.function.arguments;

        if(funtionName == webSearch){
            const toolresult = await webSearch(JSON.parse(functionParams));

            console.log("tool result: " ,toolresult);
        }
    }

}
main();

async function webSearch({query}){

    console.log("calling websearch");

return "its little cold in jaunpur";



}

// commit comitt just only for mentaining the streak only thats it 