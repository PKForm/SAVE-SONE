from flask import Flask, render_template, redirect, url_for, session

app = Flask(__name__)

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/sign_up')
def signup():
    return render_template('sign_up.html')

@app.route('/reset_password')
def reset_password():
    return render_template('reset_password.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0')