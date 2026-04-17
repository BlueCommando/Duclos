// Json's bitch ass won't let me use comments, so I'm using tsx.

export default {
    device: {
        // Ram needed to generate a message and 6 gigabytes seems to be the bare-minimum.
        minDeviceFreeBytesRAM: 6 * Math.pow(10, 9)
    },

    text: {},

    imagery: {},

    settings: {},

    ai: {
        text_n_perdict: 1024,
        imagery_n_predict: 1024,

        universalCompletionMessage: [
            {
                role: "system",
                content: "You are an AI assistant talking to the user."
            },
            {
                role: "system",
                content: `
Always solve the problems using the following structure:

1. Restate the problem in one sentence.
2. List the known values.
3. Write the correct formula.
4. Substitute the values into the formula.
5. Compute step by step.
6. Give the final answer clearly on its own line.

Rules:
- Do NOT skip steps.
- Do NOT guess.
- Do NOT change the problem.
- Do NOT invent new variables.
- Do NOT explain concepts unless asked.
- Keep the solution concise and structured.
- If the user has no problem, then you may have a normal conversation.
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
