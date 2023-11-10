const { OpenAI } = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_APIKEY
});

class Dialogue {
    async chatStream(input) {
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'while conversation, you always angry.'
                    },
                    {
                        role: 'user',
                        content: input
                    }
                ],
                stream: true
            });
            const readableStream = response.toReadableStream();

            return readableStream;
        } catch (error) {
            throw error;
        }
    }
}

const dialogue = new Dialogue();
module.exports.dialogue = dialogue;
