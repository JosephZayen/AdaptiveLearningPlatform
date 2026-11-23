"""

"""

import threading
import time
import traceback
from random import randint
from flask import current_app
from types import AIInterface 
from services.create_textbook.core.config.prompt_config import CHAPTER_USER_PROMPT
from .config.config import MAX_RETRIES
from services.create_textbook.core.config.types_config import InnerTextbook, InnerChapter, Chapter
import concurrent.futures

AIInterfaceClass = current_app.extensions["ai_interface"]

ai_interface: AIInterface = AIInterfaceClass()

def generate_book(chapters_index: list[str], *, textbook_name, sysprompt, model, reasoning_effort="high", extra_body=None) -> InnerTextbook:
    """生成教材(textbook 或coding均可)，并以特定格式返回

    参数：
        chapters_index: chapters index (list of str)
        sysprompt
        model
        配套的两个参数(用于DEEPSEEK API):

            reasoning_effort="high"
            extra_body=None
    """
    chapters_index_dict = dict()
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        future_to_chapter = {
            executor.submit(
                chapter_gen, 
                ch_prompt, sysprompt=sysprompt, model=model, reasoning_effort=reasoning_effort, extra_body=extra_body) 
            : 
            (index, ch_prompt) for index, ch_prompt in enumerate(chapters_index)
        }
        for future in concurrent.futures.as_completed(future_to_chapter, 600):
            index, ch_prompt = future_to_chapter[future]
            chapters_index_dict[(index, ch_prompt)] = future.result()
    chapters_index = []        
    for k in sorted(chapters_index_dict.keys()):
        chapters_index.append(chapters_index_dict[k])
    textbook = InnerTextbook(
        name=textbook_name,
        chapters_index=chapters_index
    )
    return textbook.model_validate()

    

def chapter_gen(chapter_index, *, sysprompt, model, reasoning_effort="high", extra_body=None) -> Chapter:
    client = ai_interface.client
    chapter_user_prompt = CHAPTER_USER_PROMPT.format(chapter_index=chapter_index)
    for i in range(MAX_RETRIES+1):
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": sysprompt},
                    {"role": "user", "content": chapter_user_prompt}
                ],
                reasoning_effort=reasoning_effort,
                extra_body=extra_body,
                stream=False 
            )
            chapter = Chapter.model_validate_json(response.choices[0].message.content)
            inner_chapter = InnerChapter(
                macro_explanation = chapter.macro_explanation,
                deep_explanation = chapter.deep_explanation,
                problems = chapter.problems,
                index = chapter
            )
            return inner_chapter.model_validate()
        except Exception as e:
            print("type: " + type(e).__name__ + repr(e))




    
    

