"""
调用层
"""


from services.create_textbook.core.book_generator import gen_textbook
from .config.prompt_config import Config, TEXTBOOK_PROMPT, CODING_PROMPT, CHAPTER_USER_PROMPT, OUTPUT_FORMAT


def format_chapter_prompt(chapter_index):
    return (
        CHAPTER_USER_PROMPT.format(content_index=chapter_index)
    )

def format_textbook_sysprompt(identity: str, textbook_name: str):
    return TEXTBOOK_PROMPT.format(identity=identity, textbook=textbook_name, output_format=OUTPUT_FORMAT)

def format_coding_sysprompt(coding_language, textbook_name, language):
    return (
        CODING_PROMPT.format(
        coding_language=coding_language or "",
        textbook=textbook_name or "",
        language=language or "",
        output_format=OUTPUT_FORMAT)
    )