import OpenAI from "openai";

const openai = new OpenAI({ apiKey: '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', dangerouslyAllowBrowser: true });

export const fetchResponse = async (image_data) => {
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openai.apiKey}`
    }

    const payload = {
        "model": "gpt-4-vision-preview",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Convert to a latex expression. Only output the latex, DON'T add any other words"
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": "data:image/jpeg;base64," + image_data
                        }
                    }
                ]
            }
        ],
        "max_tokens": 300
    }

    return fetch("https://api.openai.com/v1/chat/completions", {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => data['choices'][0]['message']['content'])
        .catch(error => console.error('Error:', error));


}