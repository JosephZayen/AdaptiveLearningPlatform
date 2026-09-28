from flask import render_template,request,session,redirect,url_for
from models import User, Event, db_session, select
import json
from . import calendar_bp
from datetime import datetime 



def current_user_id():
    uid = session.get("uid")
    return uid

def check_login():
    uid = session.get("uid")
    if uid is None:
        return redirect(url_for("auth_bp.login"))
    else:
        return None

@calendar_bp.route("/")
def main():
    login_required = check_login()
    if login_required is not None:
        return login_required
    return redirect(url_for("calendar_bp.calendar"))

@calendar_bp.route("/calendar")
def calendar():
    login_required = check_login()
    if login_required:
        return login_required
    print("calendar")
    return render_template("calendar/calendar.html")

@calendar_bp.route("/api/search")
def search_events():
    uid = current_user_id()
    local_date = request.args.get("local_date")
    print("local_date", local_date)
    print("uid: ", uid)
    stmt = select(Event).join(User).where(Event.local_date == local_date).where(User.id == uid)
    events = []
    for event in db_session.scalars(stmt):
        events.append({"timestamp": event.timestamp, "description":event.description, 
                       "id": event.id, "local_date": event.local_date})
        print({"timestamp": event.timestamp, "description":event.description, 
                       "id": event.id, "local_date": event.local_date})
    return json.dumps(events, ensure_ascii=False, indent=4)

@calendar_bp.route("/api/add", methods=["POST"])
def add_events():
    uid = current_user_id()
    data = request.get_json()
    description = data.get("description")
    try:
        timestamp = int(data.get("timestamp"))
    except Exception as e:
        print("add events error: ", type(e).__name__, e)
        return json.dumps({"status": "fail"}), 401
    local_time = datetime.fromtimestamp( float(timestamp) / 1000 )
    y , m, d= local_time.year, local_time.month, local_time.day
    event = Event(user_id = uid, description = description, timestamp = timestamp, local_date=f"{y}-{m}-{d}")
    db_session.add(event)
    db_session.commit()
    return json.dumps({"status": "success"}), 200


