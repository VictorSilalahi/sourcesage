from flask import Flask, request, jsonify, render_template, url_for
from flask_cors import CORS

# init app
app = Flask(__name__, template_folder='venv/templates', static_folder='venv/static')
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app)

@app.route('/')
def products():
    return render_template('products.html')

@app.route('/variants')
def variants():
    return render_template('variants.html')

# run server
if __name__=="__main__":
    app.run(debug=True, host="0.0.0.0", port=5100)


