from pydantic import BaseModel, Field
import json

class Textbook(BaseModel):
    """Textbook对象返回约束
    """
    name: str
    chapters: list["Chapter"]


class Chapter(BaseModel):
    """Chapter对象返回约束
    """
    name: str
    macro_explanation: str

CHAPTER_SCHEMA = json.dumps(Textbook.model_json_schema(), ensure_ascii=False, indent=4)

# CHAPTER_SCHEMA注释
"""用于为AI的章节输出提供JSON约束
"""