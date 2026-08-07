from flask import jsonify, request
from apiflask import APIBlueprint
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash
from backend.model.admin import Admin

auth_bp = APIBlueprint('auth', __name__, url_prefix='/auth')


@auth_bp.route('/login', methods=['POST'])
def login_admin():
    data = request.get_json(silent=True) or {}
    username = data.get('username')
    password = data.get('password')

    admin = Admin.query.filter_by(username=username).first()

    if not admin or not check_password_hash(admin.senha_hash, password or ''):
        return jsonify({"error": "Credenciais inválidas"}), 401

    access_token = create_access_token(identity=str(admin.id), additional_claims={"role": "admin"})
    return jsonify({"access_token": access_token}), 200