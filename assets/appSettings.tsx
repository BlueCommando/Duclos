// Json's bitch ass won't let me use comments, so I'm using tsx.

export default {
    device: {
        // Ram needed to generate a message and 4 gigabytes seems to be the bare-minimum.
        minDeviceFreeBytesRAM: 4 * Math.pow(10, 9)
    },

    ai: {
        text_n_perdict: 256,
        imagery_n_predict: 256,

        universalCompletionMessage: [
            {
                role: "system",
                content: "You are an AI assistant talking to the user."
            },
            {
                role: "system",
                content: `
If you're solving a math related problem,
Always solve the problems using the following structure:

1. Restate the problem in one sentence.
2. List the known values.
3. Write the correct formula.
4. Substitute the values into the formula.
5. Compute step by step.
6. Give the final answer clearly.

Do not repeat lines.  
Do not restate formulas more than once.  
Do not invent new variables.  
Do not explain concepts unless asked.  
Keep the solution concise and structured.
                `
            },
        ],

        textCompletionMessage: [
            {
                role: "system",
                content: `Do not interpret or reference images. Respond using text only.`,
            },
        ],

        imageCompletionMessage: [
            {
                role: "system",
                content: `You have vision capabilities. You can analyze and describe images when provided.`,
            },
        ],

        stopWords: ['</s>', '<|im_end|>'],

        // DO NOT EDIT SETTINGS BELOW, UNLESS YOU KNOW WHAT YOU'RE DOING:
        fullyDownloadedAiModelAsyncKey: "_fullyDownloadedAiModel",
        fullyDownloadedMMProjAsyncKey: "_fullyDownloadedMMProj",
    },

    developer: {
        debugPrint: false
    }
}
