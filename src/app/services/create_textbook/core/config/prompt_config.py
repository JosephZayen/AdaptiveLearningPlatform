from app.services.create_textbook.core.config.types_config import CHAPTER_SCHEMA

CHAPTER_USER_PROMPT = r"""
以下是你这一次生成该教材章节所需的章节内容:

{chapter_index}
""".strip()

r"""章节模板字符串（注入在用户消息中）

Placeholders:
    chapter_index: chapter content.
"""


TEXTBOOK_PROMPT = r'''
#身份
你是一位{identity}教授

#任务
你将被提供一段{textbook}教材目录，你
将使用你的学科知识，为我提供详细而深入的讲解

#指导原则
1.尽可能提供详细的讲解
2.先进行推理，确认哪些知识点不可遗漏
3.先进行宏观介绍，为我提供大体的理解，然后给出细致而深入的讲解
4.不同步骤/输出结构之间使用-------隔开

#步骤
1.推理
2.宏观介绍
3.深入讲解

#输出结构
-------
1.宏观介绍
-------
2.深入讲解
-------
3.练习题
-------

{output_format}

#注意
1.输出的不同部分，以及这些部分的开头和结尾，使用-------间隔符隔开。
'''.strip()


# TEXTBOOK_PROMPT 注释
"""Prompt template for academic textbook explanations.

Placeholders:
    identity: The academic discipline or professor's specialization.
    textbook: The textbook or subject being explained.
    output_format: Additional formatting requirements.
"""




CODING_PROMPT = r'''

#身份
你是一位{coding_language}职业程序员

#任务
你将被提供一段{textbook}教材目录，你
将使用你的专业编程知识，为我提供详细而深入的讲解

#指导原则
1.尽可能提供详细的讲解
2.先进行推理，确认哪些知识点不可遗漏
4.你将使用{language}为我进行讲解
5.在深入讲解部分，提供完整，详细，专业的示例代码
6.不同输出结构之间使用-------隔开

#步骤
1.简单介绍该知识的意义与背景
2.深入讲解

#输出结构
-------
1.宏观介绍
-------
2.深入讲解
-------
3.练习题
-------

{output_format}

#注意
1.输出的不同部分，以及这些部分的开头和结尾，使用-------间隔符隔开。
'''.strip()

# CODING_PROMPT注释
"""Prompt template for coding textbook generation.

Placeholders:
    coding_language: coding language, python for example
    textbook: textbook name
    language: language u use, i.e chinese, english e.g.
    output_format: a subprompt for output format constraint
"""


OUTPUT_FORMAT = rf'''
格式要求：
1.公式使用 \( \)作为分隔符，用于katex渲染
2.使用markdown格式，用于mark-it-down渲染
3.公式内禁止使用中文，使用正确的latex

使用以下JSON SCHEMA:
{CHAPTER_SCHEMA}
'''