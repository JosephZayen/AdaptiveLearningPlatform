# 模型定义
model = "deepseek-v4-pro"
extra_body = {"thinking": {"type": "enabled"}}
reasoning_effort = "high"


delimiter = '>_<'
"""
用户输入分隔符，用于切分出教材章节
"""

MAX_RETRIES = 2

"""
chapter generation max retries
"""