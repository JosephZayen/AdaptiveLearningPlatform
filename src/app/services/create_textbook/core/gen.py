import threading
import time
from random import randint
from flask import current_app
from src.app.types import AIInterface 

AIInterfaceClass = current_app.extensions["ai_interface"]

ai_interface: AIInterface = AIInterfaceClass()



def gen_textbook(*, sysprompt, model, reasoning_effort="high", extra_body=None):
    """生成教材，并以特定格式返回

    参数：
        sysprompt
        model
        配套的两个参数：
            reasoning_effort="high"
            extra_body=None
    """
    client = ai_interface.client
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": sysprompt}
        ],
        reasoning_effort=reasoning_effort,
        extra_body=extra_body,
        stream=False 
    )

    content = response.choices[0].message.content

def chapter_gen():
    pass