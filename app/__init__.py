from flask import Flask, render_template, redirect
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()
api_key = os.environ.get('Perspective_API_Key')

app = Flask(__name__)

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login/')
def login():
    return render_template('login.html')

@app.route('/sign_up/')
def sign_up():
    return render_template('sign_up.html')

@app.route('/reset_password/')
def reset_password():
    return render_template('reset_password.html')

@app.route('/demo/')
def demo():
    return render_template('demo.html', api_key=api_key)

if __name__ == '__main__':
    app.run(host='0.0.0.0')