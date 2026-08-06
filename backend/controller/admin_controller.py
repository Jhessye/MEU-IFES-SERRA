# backend/controller/admin_controller.py
from flask import jsonify, Blueprint, request
from flask_jwt_extended import get_jwt_identity
from backend.decorators.auth import admin_required
from backend.service import admin_service

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')
#Um admin pode deletar a própria conta, inclusive a última que resta, e aí ninguém mais consegue criar admin via API (só via CLI de novo)

@admin_bp.route('/', methods=['GET'])
@admin_required
def listar_admins():
    admins = admin_service.listar_admins()
    return jsonify(admins), 200


@admin_bp.route('/', methods=['POST'])
@admin_required
def criar_admin():
    data = request.get_json()
    novo_admin = admin_service.criar_admin(data)
    if novo_admin is None:
        return jsonify({"error": "Dados incompletos ou username já existe"}), 400
    return jsonify(novo_admin), 201


@admin_bp.route('/<uuid:admin_id>', methods=['DELETE'])
@admin_required
def deletar_admin(admin_id):
    resultado = admin_service.deletar_admin(admin_id)
    if resultado is None:
        return jsonify({"error": "Admin não encontrado"}), 404
    return jsonify({"message": "Admin deletado com sucesso"}), 200

@admin_bp.route('/<uuid:admin_id>/senha', methods=['PUT'])
@admin_required
def alterar_senha(admin_id):
    if str(admin_id) != get_jwt_identity():
        return jsonify({"error": "Você só pode alterar sua própria senha"}), 403

    data = request.get_json(silent=True) or {}
    resultado = admin_service.alterar_senha(
        admin_id,
        data.get('senha_atual'),
        data.get('senha_nova')
    )

    if resultado == "nao_encontrado":
        return jsonify({"error": "Admin não encontrado"}), 404
    if resultado == "senha_incorreta":
        return jsonify({"error": "Senha atual incorreta"}), 401
    if resultado == "senha_invalida":
        return jsonify({"error": "Nova senha deve ter pelo menos 6 caracteres"}), 400

    return jsonify({"message": "Senha alterada com sucesso"}), 200