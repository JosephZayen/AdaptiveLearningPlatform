"""
将前端通过路由传入的信息结构化，执行教材生成
"""
from .book_generator import generate_book
from .config.config import delimiter, extra_body
from .format_prompt import format_textbook_sysprompt
from .config.types_config import InnerTextbook

def gen_textbook(chapters_str: str, identity: str, textbook_name: str) -> InnerTextbook:
    """
    使用DEEPSEEK API生成普通教材（非coding）
    """
    chapters_index = [chapter_index for chapter_index in chapters_str.split(delimiter) if chapter_index.strip()]
    textbook_system_prompt = format_textbook_sysprompt(identity, textbook_name)
    textbook = generate_book(chapters_index, textbook_name=textbook_name, sysprompt=textbook_system_prompt, reasoning_effort="high", extra_body=extra_body)
    return textbook

# TODO
def gen_coding_book():
    pass