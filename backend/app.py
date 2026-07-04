from reportlab.pdfgen import canvas
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import math
import secrets
import string
import requests
import ssl
import socket
import sqlite3
from urllib.parse import urlparse
import os
from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

DB_PATH = os.path.join(
    BASE_DIR,
    "security_scans.db"
)


def init_db():

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()


    # Scan History Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS scan_history (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            url TEXT,

            security_score INTEGER,

            scan_date TIMESTAMP
            DEFAULT CURRENT_TIMESTAMP

        )
    """)


    # Users Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            username TEXT NOT NULL,

            email TEXT UNIQUE NOT NULL,

            password TEXT NOT NULL

        )
    """)


    # Login History Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS login_history (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            username TEXT,

            login_time TIMESTAMP
            DEFAULT CURRENT_TIMESTAMP

        )
    """)


    conn.commit()
    conn.close()

app = Flask(__name__)
CORS(app)

init_db()

# Common weak passwords
COMMON_PASSWORDS = [
    "password",
    "123456",
    "12345678",
    "qwerty",
    "admin",
    "letmein",
    "welcome",
    "password123"
]


# Check if password is common
def check_common_password(password):
    return password.lower() in COMMON_PASSWORDS


# Calculate password strength
def calculate_strength(password):
    score = 0

    if len(password) >= 8:
        score += 1

    if any(c.isupper() for c in password):
        score += 1

    if any(c.islower() for c in password):
        score += 1

    if any(c.isdigit() for c in password):
        score += 1

    if any(not c.isalnum() for c in password):
        score += 1

    if score <= 2:
        rating = "Weak"
    elif score <= 4:
        rating = "Medium"
    else:
        rating = "Strong"

    return score, rating


# Calculate entropy
def calculate_entropy(password):
    pool = 0

    if any(c.islower() for c in password):
        pool += 26

    if any(c.isupper() for c in password):
        pool += 26

    if any(c.isdigit() for c in password):
        pool += 10

    if any(not c.isalnum() for c in password):
        pool += 32

    if pool == 0:
        return 0

    entropy = len(password) * math.log2(pool)
    return round(entropy, 2)


# Estimate crack time
def estimate_crack_time(entropy):

    if entropy < 30:
        return "Few Seconds"

    elif entropy < 50:
        return "Few Hours"

    elif entropy < 70:
        return "Several Years"

    else:
        return "Centuries"


# Generate suggestions
def get_suggestions(password):

    suggestions = []

    if len(password) < 8:
        suggestions.append("Increase password length")

    if not any(c.isupper() for c in password):
        suggestions.append("Add uppercase letters")

    if not any(c.islower() for c in password):
        suggestions.append("Add lowercase letters")

    if not any(c.isdigit() for c in password):
        suggestions.append("Add numbers")

    if not any(not c.isalnum() for c in password):
        suggestions.append("Add special characters")

    return suggestions


# Generate secure password
def generate_password(length=12):

    chars = (
        string.ascii_letters +
        string.digits +
        string.punctuation
    )

    return ''.join(
        secrets.choice(chars)
        for _ in range(length)
    )


@app.route("/")
def home():
    return "Password Analyzer Backend Running!"


@app.route("/demo")
def demo():

    password = "Admin123!"

    is_common = check_common_password(password)
    score, rating = calculate_strength(password)
    entropy = calculate_entropy(password)
    crack_time = estimate_crack_time(entropy)
    suggestions = get_suggestions(password)
    print("Password:", password)
    print("Suggestions:", suggestions)

    return jsonify({
        "password": password,
        "score": score,
        "rating": rating,
        "entropy": entropy,
        "crack_time": crack_time,
        "common_password": is_common,
        "suggestions": suggestions
    })


@app.route("/analyze", methods=["POST"])
def analyze():

    data = request.get_json()

    password = data.get("password", "")

    is_common = check_common_password(password)
    score, rating = calculate_strength(password)
    entropy = calculate_entropy(password)
    crack_time = estimate_crack_time(entropy)
    suggestions = get_suggestions(password)

    return jsonify({
        "password": password,
        "score": score,
        "rating": rating,
        "entropy": entropy,
        "crack_time": crack_time,
        "common_password": is_common,
        "suggestions": suggestions
    })


@app.route("/generate")
def generate():

    password = generate_password()

    return jsonify({
        "password": password
    })
def get_ssl_info(url):

    try:

        hostname = urlparse(url).hostname

        context = ssl.create_default_context()

        with socket.create_connection((hostname, 443)) as sock:
            with context.wrap_socket(
                sock,
                server_hostname=hostname
            ) as secure_sock:

                cert = secure_sock.getpeercert()

                issuer = dict(
                    x[0]
                    for x in cert["issuer"]
                )

                return {
                    "ssl_valid": True,
                    "issuer": issuer.get(
                        "organizationName",
                        "Unknown"
                    ),
                    "expires": cert["notAfter"]
                }

    except Exception:

        return {
            "ssl_valid": False,
            "issuer": "Unknown",
            "expires": "Unknown"
        }
@app.route("/scan", methods=["POST"])
def scan_website():

    data = request.get_json()

    url = data.get("url", "")
    user_id = data.get("user_id")

    try:

        response = requests.get(
            url,
            timeout=8,
            allow_redirects=True
        )

        headers = response.headers
        ssl_info = get_ssl_info(url)

        score = 0
        recommendations = []

        # -----------------------------
        # Website Reachability
        # -----------------------------
        reachable = response.status_code < 500

        if reachable:
            score += 10
        else:
            recommendations.append(
                "Website is not reachable."
            )

        # -----------------------------
        # HTTPS
        # -----------------------------
        https_enabled = response.url.startswith("https://")

        if https_enabled:
            score += 10
        else:
            recommendations.append(
                "Enable HTTPS."
            )

        # -----------------------------
        # Status Code
        # -----------------------------
        if response.status_code == 200:
            score += 5
        else:
            recommendations.append(
                f"Unexpected HTTP Status {response.status_code}"
            )

        # -----------------------------
        # SSL
        # -----------------------------
        if ssl_info["ssl_valid"]:
            score += 15
        else:
            recommendations.append(
                "SSL certificate is invalid."
            )

        # -----------------------------
        # Security Headers
        # -----------------------------

        x_frame = "X-Frame-Options" in headers

        if x_frame:
            score += 10
        else:
            recommendations.append(
                "Missing X-Frame-Options header."
            )

        csp = "Content-Security-Policy" in headers

        if csp:
            score += 10
        else:
            recommendations.append(
                "Missing Content-Security-Policy."
            )

        hsts = "Strict-Transport-Security" in headers

        if hsts:
            score += 10
        else:
            recommendations.append(
                "Enable HSTS."
            )

        x_content = "X-Content-Type-Options" in headers

        if x_content:
            score += 10
        else:
            recommendations.append(
                "Missing X-Content-Type-Options."
            )

        referrer = "Referrer-Policy" in headers

        if referrer:
            score += 5
        else:
            recommendations.append(
                "Add Referrer-Policy."
            )

        permissions = "Permissions-Policy" in headers

        if permissions:
            score += 5
        else:
            recommendations.append(
                "Add Permissions-Policy."
            )

        # -----------------------------
        # Server Header
        # -----------------------------

        server = headers.get("Server")

        if not server:
            score += 5
        else:
            recommendations.append(
                "Hide or minimize the Server header."
            )

        # -----------------------------
        # Secure Cookies
        # -----------------------------

        secure_cookie = False

        cookies = response.headers.get("Set-Cookie", "")

        if "Secure" in cookies:
            secure_cookie = True
            score += 5
        else:
            recommendations.append(
                "Use Secure cookies."
            )

        score = min(score, 100)

        # -----------------------------
        # Risk Level
        # -----------------------------

        if score >= 85:
            risk = "Low"

        elif score >= 65:
            risk = "Medium"

        elif score >= 40:
            risk = "High"

        else:
            risk = "Critical"

        # -----------------------------
        # Save History
        # -----------------------------

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO scan_history
            (user_id, url, security_score)
            VALUES (?, ?, ?)
            """,
            (user_id, url, score)
        )

        conn.commit()
        conn.close()

        # -----------------------------
        # Response
        # -----------------------------

        return jsonify({

            "url": response.url,

            "reachable": reachable,

            "https_enabled": https_enabled,

            "status_code": response.status_code,

            "ssl_valid": ssl_info["ssl_valid"],

            "ssl_issuer": ssl_info["issuer"],

            "ssl_expiry": ssl_info["expires"],

            "security_score": score,

            "risk_level": risk,

            "recommendations": recommendations,

            "x_frame_options": x_frame,

            "content_security_policy": csp,

            "strict_transport_security": hsts,

            "x_content_type_options": x_content,

            "referrer_policy": referrer,

            "permissions_policy": permissions,

            "server_header_hidden": not bool(server),

            "secure_cookie": secure_cookie

        })

    except Exception as e:

        return jsonify({

            "url": url,

            "reachable": False,

            "error": str(e)

        })
@app.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    hashed_password = generate_password_hash(password)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    try:

        cursor.execute(
            """
            INSERT INTO users
            (username, email, password)
            VALUES (?, ?, ?)
            """,
            (username, email, hashed_password)
        )

        conn.commit()
        conn.close()

        return jsonify({
            "success": True,
            "message": "User Registered Successfully"
        })

    except sqlite3.IntegrityError:

        conn.close()

        return jsonify({
            "success": False,
            "message": "Email already registered."
        })

    except Exception as e:

        conn.close()

        return jsonify({
            "success": False,
            "message": str(e)
        })

@app.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT id,
               username,
               password
        FROM users
        WHERE email = ?
        """,
        (email,)
    )

    user = cursor.fetchone()

    if user and check_password_hash(user[2], password):

        cursor.execute(
            """
            INSERT INTO login_history (username)
            VALUES (?)
            """,
            (user[1],)
        )

        conn.commit()
        conn.close()

        return jsonify({
            "success": True,
            "user_id": user[0],
            "username": user[1]
        })

    conn.close()

    return jsonify({
        "success": False,
        "message": "Invalid Credentials"
    }), 401






@app.route("/login-history")
def login_history():

    conn = sqlite3.connect(DB_PATH)

    cursor = conn.cursor()

    cursor.execute(

        """

        SELECT *

        FROM login_history

        ORDER BY id DESC

        """

    )

    rows = cursor.fetchall()

    conn.close()

    return jsonify(rows)  


@app.route("/history", methods=["POST"])
def history():

    data = request.get_json()

    user_id = data.get("user_id")

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            id,
            url,
            security_score,
            scan_date
        FROM scan_history
        WHERE user_id = ?
        ORDER BY id DESC
        LIMIT 10
        """,
        (user_id,)
    )

    rows = cursor.fetchall()

    conn.close()

    return jsonify(rows)


@app.route("/report")
def generate_report():

    pdf = canvas.Canvas("security_report.pdf")

    pdf.setTitle("Cyber Security Assessment Report")

    # Heading
    pdf.setFont("Helvetica-Bold", 18)
    pdf.drawString(150, 800, "Cyber Security Assessment Report")

    pdf.setFont("Helvetica", 12)
    pdf.drawString(100, 775, "Generated from Cyber Security Assessment Suite")

    pdf.line(80, 760, 520, 760)

    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(100, 735, "Recent Website Scan History")

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            id,
            url,
            security_score,
            scan_date
        FROM scan_history
        ORDER BY id DESC
        LIMIT 10
    """)

    rows = cursor.fetchall()

    y = 700

    pdf.setFont("Helvetica", 11)

    if len(rows) == 0:

        pdf.drawString(100, y, "No scan history found.")

    else:

        for row in rows:

            pdf.drawString(100, y, f"Scan ID : {row[0]}")
            y -= 18

            pdf.drawString(100, y, f"Website : {row[1]}")
            y -= 18

            pdf.drawString(100, y, f"Security Score : {row[2]}%")
            y -= 18

            pdf.drawString(100, y, f"Scan Date : {row[3]}")
            y -= 30

            if y < 80:
                pdf.showPage()
                y = 800
                pdf.setFont("Helvetica", 11)

    conn.close()

    pdf.save()

    return send_file(
        "security_report.pdf",
        as_attachment=True,
        download_name="CyberSecurityReport.pdf",
        mimetype="application/pdf"
    )












@app.route("/dashboard-stats", methods=["POST"])
def dashboard_stats():

    data = request.get_json()

    user_id = data.get("user_id")

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Total scans
    cursor.execute(
        """
        SELECT COUNT(*)
        FROM scan_history
        WHERE user_id = ?
        """,
        (user_id,)
    )
    total_scans = cursor.fetchone()[0]

    # Average score
    cursor.execute(
        """
        SELECT AVG(security_score)
        FROM scan_history
        WHERE user_id = ?
        """,
        (user_id,)
    )

    avg = cursor.fetchone()[0]
    average_score = round(avg) if avg else 0

    # High-risk websites (score < 50)
    cursor.execute(
        """
        SELECT COUNT(*)
        FROM scan_history
        WHERE user_id = ?
        AND security_score < 50
        """,
        (user_id,)
    )
    high_risk = cursor.fetchone()[0]

    conn.close()

    return jsonify({
        "total_scans": total_scans,
        "average_score": average_score,
        "high_risk": high_risk,
        "reports": total_scans
    })


if __name__ == "__main__":
    app.run(debug=True)




































