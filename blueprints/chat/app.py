from models import  select, User, ChatSession, Session
from models import engine
from flask import Blueprint, session, request, redirect, url_for, jsonify, render_template
import traceback
from .ai_interface import get_response
import json
from .configs import configs


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
            stmt = select(ChatSession).where(ChatSession.id == chat_id).where(ChatSession.user_id == uid)
            chat_session = db_session.scalars(stmt).first()
            if(chat_session):
                chat_session.json_data = chat_json
                db_session.commit()
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
        print(messages)
        print(type(messages))
        response_text = get_response(messages, reasoning)
    except Exception as e:
        print(type(e).__name__, repr(e), traceback.format_exc())
        return jsonify(status=FAILURE, content=None)
    else:
        return jsonify(status=SUCCESS, content=response_text)



@chat_bp.route("/api/read-sessions")
def read_sessions():
    try:
        database_session = Session(engine)
        with database_session as db_session:
            uid = session["uid"]
            local_date = request.args.get("local_date")
            stmt = select(ChatSession).where(ChatSession.user_id == uid).where(ChatSession.local_date == local_date)
            sessions_object = db_session.scalars(stmt)
            sessions_data = []
            for s in sessions_object:
                sessions_data.append(
                    {
                        "chat_id": s.id,
                        "msg_dict": s.json_data,
                        "local_date": s.local_date
                    }
                )
            response_content = json.dumps(sessions_data, indent=4, ensure_ascii=False)
    except Exception as e:
        print(repr(e), traceback.format_exc())
        return jsonify(status=FAILURE, content=None)
    else:
        return jsonify(status=SUCCESS, content=response_content)


@chat_bp.route("/api/new-chat", methods=["POST"])
def new_chat():
    try:
        database_session = Session(engine)
        uid = session["uid"]
        chat_session = ChatSession(user_id=uid)
        database_session.add(chat_session)
        database_session.commit()
        chat_id = chat_session.id
    except Exception as e:
        print(type(e).__name__, repr(e), traceback.format_exc())
        return jsonify(status=FAILURE, content=None)
    else:
        return jsonify(status=SUCCESS, content=chat_id)


@chat_bp.route("/api/delete", methods=["POST"])
def delete_chat():
    try:
        database_session = Session(engine)
        with database_session as db_session:
            uid = session["uid"]
            data = request.get_json()
            chat_id = data["chat_id"]
            stmt = select(ChatSession).where(ChatSession.user_id == uid).where(ChatSession.id == chat_id)
            chat_session = db_session.scalars(stmt).first()
            if(chat_session):
                db_session.delete(chat_session)
                db_session.commit()
    except Exception as e:
        print(repr(e), type(e).__name__, traceback.format_exc())
        return jsonify(status=FAILURE, content=None)
    else:
        return jsonify(status=SUCCESS, content=None)
    



