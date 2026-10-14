from openai import OpenAI
import os
from .configs import configs

client = OpenAI(
    api_key = os.environ.get("DEEPSEEK_API_KEY"),
    base_url = "https://api.deepseek.com"
)

def get_response(messages, reasoning):
    reasoning = reasoning if (reasoning in ["enabled", "disabled"]) else "enabled"
    try:
        response = client.chat.completions.create(
            model=configs.get("model"),
            messages=messages,
            extra_body={"thinking": {"type": reasoning}}
        )
    except Exception as e:
        print(repr(e), type(e).__name__)
        return f"message failed, {repr(e)}"
    else:
        return response.choices[0].message.content