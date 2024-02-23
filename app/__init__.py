from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/signup/')
def signup():
    return render_template('signup.html')

@app.route('/reset-password/')
def reset_password():
    return render_template('reset-password.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0')
