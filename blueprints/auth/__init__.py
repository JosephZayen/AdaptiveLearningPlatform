from flask import Blueprint,request,redirect,url_for,render_template,session,flash
from models import User, select, Session, engine
from werkzeug.security import check_password_hash,generate_password_hash

auth_bp = Blueprint("auth_bp",__name__,"static",None,"templates","/auth")

@auth_bp.route("/login",methods=["GET","POST"])
def login():
    db_session = Session(engine)
    if request.method == "POST":
        custom_id = request.form["custom_id"].strip()
        pwd = request.form["pwd"]
        stmt = select(User).where(User.custom_id == custom_id)
        users = db_session.scalars(stmt)
        if users:
            user = users.first()
        if user and check_password_hash(user.pwd_hash, pwd):
            session["uid"] = user.id
            return redirect(url_for("home"))
        else:
            flash("incorrect input")
            return {"status": "failed"}, 400
    else:
        return render_template("auth/login.html")

@auth_bp.route("/register",methods=["GET","POST"])
def register():
    db_session = Session(engine)
    if request.method == "POST":
        custom_id = request.form["custom_id"].strip()
        pwd = request.form["pwd"]
        name = request.form["name"]
        if custom_id is not None and pwd is not None and name is not None:
            stmt = select(User.id).where(User.custom_id == custom_id)
            ids = db_session.scalars(stmt)
            first = ids.first()
            id = first if first else None
            if id is not None:
                flash("user already exists")
                return {"status": "failed"}, 400
            else:
                user = User(name=name, custom_id=custom_id, pwd_hash=generate_password_hash(pwd))
                db_session.add(user)
                db_session.commit()
                session["uid"] = id
                return redirect(url_for("home"))
    else:
        return render_template("auth/register.html")


