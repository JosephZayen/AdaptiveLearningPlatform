from pydantic import BaseModel, Field
import json


class InnerTextbook(BaseModel):
    """内部使用的textbook对象结构约束
    """
    name: str
    chapters: list["InnerChapter"]

class Chapter(BaseModel):
    """内部使用的chapter对象返回约束
    """
    macro_explanation: str
    deep_explanation: str
    problems: str = Field(description="practice problems")

class InnerChapter(Chapter):
    index: str = Field(description="chapter index")


CHAPTER_SCHEMA = json.dumps(Chapter.model_json_schema(), ensure_ascii=False, indent=4)

# CHAPTER_SCHEMA注释
"""用于为AI的章节输出提供JSON约束
"""