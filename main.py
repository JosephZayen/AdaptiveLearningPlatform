from flask import Flask, render_template, url_for, redirect
from blueprints.auth import auth_bp
from blueprints.calendar import calendar_bp
from blueprints.chat import chat_bp
#from os import urandom

app = Flask(__name__)

'''secret_key = urandom(32).hex()
print(secret_key)'''

app.secret_key = "7dd465dd467d7f4a6728e966ed2d2b5454f4f17369ed75c48195074273e9ec9e"
app.register_blueprint(auth_bp)
app.register_blueprint(calendar_bp)
app.register_blueprint(chat_bp)





@app.route("/", methods=["GET"])
def index():
    return redirect(url_for("auth_bp.login"))

@app.route("/home", methods=["GET"])
def home():
    return render_template("main/base.html")

if(__name__ == "__main__"):
    app.run(debug=True)
