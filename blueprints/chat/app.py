from models import  select, User, ChatSession, Session
from models import engine
from flask import Blueprint, session, request, redirect, url_for, jsonify, render_template, current_app
import traceback
from .ai_interface import get_response
import json
from .configs import configs
#用于静态类型检查器
from main import ChatManager, AIInterface

ChatManagerClass = current_app.extensions["chat_manager"]
AIInterfaceClass = current_app.extensions["ai_interface"]
SUCCESS = configs.get("success_status")
FAILURE = configs.get("failure_status")

chat_bp = Blueprint("chat_bp" ,__name__, static_folder="static", template_folder="templates", url_prefix="/chat")


@chat_bp.route("/home")
def chat():
    return render_template("chat/chat.html")


@chat_bp.route("/api/update", methods=["POST"])
def update():
    try:
        database_session = Session(engine)
        with database_session as db_session:
            uid = session["uid"]
            data = request.get_json()
            chat_id = data["chat_id"]
            chat_json = data["msg_dict"]
            chat_localDate = data["local_date"]
            chat_manager: ChatManager = ChatManagerClass()
            chat_manager.update(uid=uid, chat_id=chat_id, chat_json=chat_json, chat_localDate=chat_localDate)
    except Exception as e:
        print(repr(e), traceback.format_exc())
        return jsonify(status=FAILURE, content=None)
    else:
        return jsonify(status=SUCCESS, content=None)

@chat_bp.route("/api/askai", methods=["POST"])
def askai():
    try: 
        data = request.get_json()
        reasoning = data["reasoning"]
        #这里messages要合法，不然给openai校验会出错
        messages = data["messages"]
        ai_interface: AIInterface = AIInterfaceClass()
        response_text = ai_interface.get_response(messages=messages, reasoning=reasoning)
    except Exception as e:
        print(type(e).__name__, repr(e), traceback.format_exc())
        return jsonify(status=FAILURE, content=None)
    else:
        return jsonify(status=SUCCESS, content=response_text)



@chat_bp.route("/api/read-sessions")
def read_sessions():
    try:
        uid = session["uid"]
        local_date = request.args.get("local_date")
        chat_manager: ChatManager = ChatManagerClass()
        sessions_data = chat_manager.read_sessions(uid=uid, local_date=local_date)
        response_content = json.dumps(sessions_data, indent=4, ensure_ascii=False)
    except Exception as e:
        print(repr(e), traceback.format_exc())
        return jsonify(status=FAILURE, content=None)
    else:
        return jsonify(status=SUCCESS, content=response_content)


@chat_bp.route("/api/new-chat", methods=["POST"])
def new_chat():
    try:
        uid = session["uid"]
        chat_manager: ChatManager = ChatManagerClass()
        chat_id = chat_manager.new_chat(uid=uid)
    except Exception as e:
        print(type(e).__name__, repr(e), traceback.format_exc())
        return jsonify(status=FAILURE, content=None)
    else:
        return jsonify(status=SUCCESS, content=chat_id)


@chat_bp.route("/api/delete", methods=["POST"])
def delete_chat():
    try:
        uid = session["uid"]
        data = request.get_json()
        chat_id = data["chat_id"]
        chat_manager: ChatManager = ChatManagerClass()
        chat_manager.delete_chat(uid=uid, chat_id=chat_id)
    except Exception as e:
        print(repr(e), type(e).__name__, traceback.format_exc())
        return jsonify(status=FAILURE, content=None)
    else:
        return jsonify(status=SUCCESS, content=None)
    



