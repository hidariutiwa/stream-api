const input = 'ハロウィンに仮想するのは何故？';

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const uri = window.location.origin + '/chat';
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                input: input
            })
        };

        fetch(uri, params)
        .then((response) => {
            const reader = response.body.getReader();
            const stream = new ReadableStream({
                start(controller) {
                    // 次の関数は各データチャンクを処理します
                    function push() {
                        // done は Boolean で、value は Uint8Array です
                        return reader.read().then(({ done, value }) => {
                            // 読み取るデータはもうありませんか？
                            if (done) {
                                // データの送信が完了したことをブラウザーに伝えます
                                controller.close();
                                return;
                            }

                            // データを取得し、コントローラー経由でブラウザーに送信します
                            const decoder = new TextDecoder();
                            console.log(decoder.decode(value));
                            controller.enqueue(value);
                            push();
                        });
                    }
                    push();
                },
            });
            return new Response(stream, { headers: { "Content-Type": "text/html" } });
        });
    } catch (error) {
        console.log(error);
    }
});
