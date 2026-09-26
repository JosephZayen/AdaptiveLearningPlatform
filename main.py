from flask import Flask, render_template, url_for, redirect
from blueprints.paper_checker import paper_bp
from blueprints.auth import auth_bp

app = Flask(__name__)
app.register_blueprint(auth_bp)
app.register_blueprint(paper_bp)

@app.route("/", methods=["GET"])
def auth():
    return redirect(url_for("auth_bp.login"))

@app.route("/home", methods=["GET"])
def home():
    return render_template("main.html")

if(__name__ == "__main__"):
    app.run()
