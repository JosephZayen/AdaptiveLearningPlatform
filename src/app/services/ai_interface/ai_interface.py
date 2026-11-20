"""
flask extensions:
ai_interface

usage:
get by current_app["ai_interface"]

dependencies:
None
"""


from openai import OpenAI
import os
from .config import configs

client = OpenAI(
    api_key = os.environ.get("DEEPSEEK_API_KEY"),
    base_url = "https://api.deepseek.com"
)

class AIInterface():
    """
    interface for ai models
    """
    def get_response(self, messages, reasoning):
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
            print("successful")
            return response.choices[0].message.content