from pathlib import Path
import json
import traceback
from datetime import datetime, timezone

BASE_DIR = Path(__file__).parent
JSON_PATH = BASE_DIR / r"project.json"
SEARCH_PATH = BASE_DIR / r"search.txt"
LOG_PATH = BASE_DIR / r"logs.txt"

SEARCH_SUFFIXES = [".py", ".txt", ".md", ".c", ".html", ".css", ".js"]


project = {}
store = []
project[BASE_DIR.name] = store

hashdict = {}

def make_json(store, dir_path):
    for sub_ofile in dir_path.iterdir():
        if(sub_ofile.name.startswith(".")):
            continue
        if(sub_ofile.is_file()):
            store.append(sub_ofile.name)
        elif(sub_ofile.is_dir()):
            #填补目录字典
            odir = {}
            odir_store = []
            odir[sub_ofile.name] = odir_store
            #将目录对象字典塞入存储
            store.append(odir)
            #递归
            make_json(odir_store, sub_ofile)
        #字典检索
        #hashdict[sub_ofile.name] = sub_ofile

make_json(store, BASE_DIR)

with JSON_PATH.open("w", encoding="utf-8") as f:
    f.write(json.dumps(project, indent=2, ensure_ascii=False))
    f.flush()

close_before = 0
text = ""


while(True):
    ipt = input()
    if (ipt == r"}" and close_before):
        break
    elif(ipt == r"{"):
        close_before = 1
        continue
    elif(not close_before):
        continue
    text += ipt + "\n"

lst = text.split(",")
print(lst)
print(100)

logs = []
searches = {}

for search_item in lst:
    if not search_item.strip():
        continue
    try:
        results = BASE_DIR.glob(search_item.strip())
    except Exception as e:
        error_reason = {}
        error_reason["type"] = type(e).name
        error_reason["repr"] = repr(e)
        error_reason["traceback"] = traceback.format_exc()
        logs.append(error_reason)
    for result in results:
        if result.suffix in SEARCH_SUFFIXES:
            with result.open("r", encoding="utf-8") as f:
                searches[result.as_posix()] = f.read()

logs_json = json.dumps(logs, indent=2, ensure_ascii=False)
now = datetime.now(timezone.utc).timestamp() * 1000
with LOG_PATH.open("a", encoding="utf-8") as f:
    f.write(str(now) + "\n")
    f.write(logs_json + "\n"*10)


searches_json = json.dumps(searches, indent=2, ensure_ascii=False)
now = datetime.now(timezone.utc).timestamp() * 1000
with SEARCH_PATH.open("a", encoding="utf-8") as f:
    f.write(str(now) + "\n")
    f.write(searches_json + "\n"*10)