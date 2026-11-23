"""
flask extension: 
chat_manager

usage:
get by current_app["ai_manager"]

dependencies:
registered ai_interface service
"""

from models import  select, User, ChatSession, Session
from models import engine
from flask import jsonify, current_app
import traceback
import json
from .config import configs
from main import AIInterface

SUCCESS = configs.get("success_status")
FAILURE = configs.get("failure_status")

ai_interface: AIInterface = current_app.extensions["ai_interface"]

class ChatManager:

    """
    manages chat status
    """

    def update(self, *, uid, chat_id, chat_json, chat_localDate):
        database_session = Session(engine)
        with database_session as db_session:
            try:
                stmt = select(ChatSession).where(ChatSession.id == chat_id).where(ChatSession.user_id == uid)
                chat_session = db_session.scalars(stmt).first()
                if(chat_session):
                    chat_session.json_data = chat_json
                    chat_session.local_date = chat_localDate
                    db_session.commit()
            except Exception as e:
                db_session.rollback()
                raise e


    def askai(self, *, reasoning, messages):
        try:
            return ai_interface.get_response(messages, reasoning)
        except Exception as e:
            raise e
        

    def read_sessions(self, *, uid, local_date = None):
        database_session = Session(engine)
        with database_session as db_session:
            try:
                stmt = select(ChatSession).where(ChatSession.user_id == uid) #.where(ChatSession.local_date == local_date)
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
            except Exception as e:
                db_session.rollback()
                raise e
            else:
                return json.dumps(sessions_data, indent=4, ensure_ascii=False)



    def new_chat(self, *, uid):
        database_session = Session(engine)
        with database_session as db_session:
            try:
                chat_session = ChatSession(user_id=uid)
                database_session.add(chat_session)
                database_session.commit()
            except Exception as e:
                db_session.rollback()
                raise e
            else:
                return chat_session.id

    def delete_chat(self, *, uid, chat_id):
        database_session = Session(engine)
        with database_session as db_session:
            try:
                stmt = select(ChatSession).where(ChatSession.user_id == uid).where(ChatSession.id == chat_id)
                chat_session = db_session.scalars(stmt).first()
                if(chat_session):
                    db_session.delete(chat_session)
                    db_session.commit()
            except Exception as e:
                db_session.rollback()
                raise e


        

