const express = require('express');
const cors = require('cors');
const path = require('path');
const { dialogue } = require('./dialogue');

function start() {
    const app = express();

    app.use(express.json());
    app.use(express.static(path.join(process.cwd(), 'public')));
    app.use(cors());

    app.post('/chat', async (req, res) => {
        console.log(req.body);

        if(!req.body.input) {
            res.status(400).send({
                message: 'input is empty'
            });
        }

        try {
            const response = await dialogue.chatStream(req.body.input);
            // res.set('Content-type', 'text/stream');
            res.write(JSON.stringify({
                emotion: 'joy',
                motion: 'explain'
            }));
            const decoder = new TextDecoder();
            for await(const chunk of response) {
                const chunkStr = decoder.decode(chunk);
                
                const jsonData = JSON.parse(chunkStr);
                const choice = jsonData.choices[0];
                if(choice.finish_reason) {
                    res.write('[DONE]');
                    res.end();
                    break;
                }
                const content = choice.delta.content;
                res.write(content);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);    
        }
    });

    app.listen(3000, () => {
        console.log('listen on 3000');
    });
}

module.exports.start = start;
