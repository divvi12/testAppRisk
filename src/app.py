"""
Vulnerable Python Application
WARNING: Contains intentional security vulnerabilities for testing only.
"""

import os
import pickle
import subprocess
import sqlite3
import hashlib
import yaml
from flask import Flask, request, render_template_string, redirect

app = Flask(__name__)

# VULNERABILITY: Hardcoded credentials
DATABASE_PASSWORD = "super_secret_password_123"
AWS_SECRET_KEY = "AKIAIOSFODNN7EXAMPLE"
API_TOKEN = "FAKE_GITHUB_TOKEN_placeholder_for_testing"


# VULNERABILITY: SQL Injection
@app.route('/user')
def get_user():
    user_id = request.args.get('id')
    # BAD: String formatting in SQL query
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    query = f"SELECT * FROM users WHERE id = '{user_id}'"
    cursor.execute(query)
    return str(cursor.fetchall())


# VULNERABILITY: Command Injection
@app.route('/ping')
def ping():
    host = request.args.get('host')
    # BAD: User input in shell command
    result = os.popen(f'ping -c 1 {host}').read()
    return result


# VULNERABILITY: Command Injection (subprocess)
@app.route('/lookup')
def dns_lookup():
    domain = request.args.get('domain')
    # BAD: shell=True with user input
    result = subprocess.check_output(f'nslookup {domain}', shell=True)
    return result


# VULNERABILITY: Unsafe deserialization
@app.route('/load', methods=['POST'])
def load_data():
    data = request.get_data()
    # BAD: pickle.loads on untrusted data
    obj = pickle.loads(data)
    return str(obj)


# VULNERABILITY: YAML deserialization
@app.route('/config', methods=['POST'])
def load_config():
    config_data = request.get_data()
    # BAD: yaml.load without safe_load
    config = yaml.load(config_data)
    return str(config)


# VULNERABILITY: Server-Side Template Injection (SSTI)
@app.route('/hello')
def hello():
    name = request.args.get('name', 'World')
    # BAD: User input in template
    template = f'<h1>Hello {name}!</h1>'
    return render_template_string(template)


# VULNERABILITY: Open Redirect
@app.route('/redirect')
def do_redirect():
    url = request.args.get('url')
    # BAD: Unvalidated redirect
    return redirect(url)


# VULNERABILITY: Path Traversal
@app.route('/read')
def read_file():
    filename = request.args.get('file')
    # BAD: No path validation
    with open(f'/data/{filename}', 'r') as f:
        return f.read()


# VULNERABILITY: Weak cryptography
def hash_password(password):
    # BAD: MD5 is broken for passwords
    return hashlib.md5(password.encode()).hexdigest()


# VULNERABILITY: Weak cryptography
def encrypt_data(data):
    # BAD: SHA1 is deprecated
    return hashlib.sha1(data.encode()).hexdigest()


# VULNERABILITY: Hardcoded encryption key
ENCRYPTION_KEY = b'sixteen byte key'


# VULNERABILITY: Debug mode enabled
if __name__ == '__main__':
    # BAD: Debug mode in production
    app.run(debug=True, host='0.0.0.0')
