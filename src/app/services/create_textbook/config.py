from pathlib import Path
#当前factory位置
#source path

source_path = Path(__file__).parent

model = "deepseek-v4-pro"
extra_body = {"thinking": {"type": "enabled"}}
reasoning_effort = "high"

#分隔提示词
delimiter = '>_<'
