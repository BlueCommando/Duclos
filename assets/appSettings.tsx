// Json's bitch ass won't let me use comments, so I'm using tsx.

export default {
    device: {
        // Android and only handle files at the unsigned 32-bit limit.
        // Multiply by 2 to account for the Multimodal Projector.
        minDeviceFreeBytesStorage: 2 * (Math.pow(2, 32) - 1),
        
        //Ram needed to generate a message and 4 gigabytes seems to be the bare-minimum.
        minDeviceFreeBytesRAM: 4 * Math.pow(10, 9)
    },

    ai: {
        fullyDownloadedAiModelAsyncKey: "_fullyDownloadedAiModel",
        fullyDownloadedMMProjAsyncKey: "_fullyDownloadedMMProj",
    },

    developer: {
        debugPrint: false
    }
}
