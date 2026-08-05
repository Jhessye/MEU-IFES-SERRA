import os

from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


@auth_bp.route('/login', methods=['POST'])
def login_admin():
    data = request.get_json(silent=True) or {}
    username = data.get('username')
    password = data.get('password')

    admin_username = os.getenv('ADMIN_USERNAME')
    admin_password = os.getenv('ADMIN_PASSWORD')

    if not admin_username or not admin_password:
        return jsonify({"error": "Credenciais administrativas não configuradas"}), 500

    if username != admin_username or password != admin_password:
        return jsonify({"error": "Credenciais inválidas"}), 401

    access_token = create_access_token(identity=username, additional_claims={"role": "admin"})
    return jsonify({"access_token": access_token}), 200