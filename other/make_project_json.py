from pathlib import Path
import json

BASE_DIR = Path(__file__).parent
JSON_PATH = BASE_DIR / r"project.json"

project = {}
store = []
project[BASE_DIR.name] = store

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
            make_json(odir_store, sub_ofile)

make_json(store, BASE_DIR)

with JSON_PATH.open("w", encoding="utf-8") as f:
    f.write(json.dumps(project, indent=2, ensure_ascii=False))
    f.flush()

