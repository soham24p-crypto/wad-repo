# Tiny ML app: predicts which support queue a ticket belongs to
from flask import Flask, request, render_template_string
from model import train

app = Flask(__name__)
model = train()

PAGE = """<h2>Automated Customer Support Ticket Routing</h2>
<form method="POST"><textarea name="text" placeholder="Describe the problem" required></textarea><br>
<button>Predict Support Queue</button></form>
{% if result %}<h3>Queue: {{ result }}</h3>{% endif %}"""

@app.route("/", methods=["GET", "POST"])
def home():
    result = model.predict([request.form["text"]])[0] if request.method == "POST" else None
    return render_template_string(PAGE, result=result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
