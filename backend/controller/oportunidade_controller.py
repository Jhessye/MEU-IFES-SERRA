from backend.service import oportunidade_service
from flask import jsonify, Blueprint, request
from backend.decorators.auth import admin_required

oportunidade_bp = Blueprint('oportunidade', __name__, url_prefix='/oportunidade')

@oportunidade_bp.route('/', methods=['GET'])
def listar_oportunidades():
    oportunidades = oportunidade_service.listar_oportunidades()
    return jsonify(oportunidades), 200

@oportunidade_bp.route('/', methods=['POST'])
@admin_required
def criar_oportunidade():
    data = request.get_json()
    nova_oportunidade = oportunidade_service.criar_oportunidade(data)
    if nova_oportunidade is None:
        return jsonify({"error": "Dados incompletos"}), 400
    return jsonify(nova_oportunidade), 201

@oportunidade_bp.route('/<uuid:oportunidade_id>', methods=['PUT'])
@admin_required
def atualizar_oportunidade(oportunidade_id):
    data = request.get_json()
    oportunidade_atualizada = oportunidade_service.atualizar_oportunidade(oportunidade_id, data)
    if oportunidade_atualizada is None:
        return jsonify({"error": "Oportunidade não encontrada ou dados incompletos"}), 404
    return jsonify(oportunidade_atualizada), 200

@oportunidade_bp.route('/<uuid:oportunidade_id>', methods=['DELETE'])
@admin_required
def deletar_oportunidade(oportunidade_id):
    oportunidade_deletada = oportunidade_service.deletar_oportunidade(oportunidade_id)
    if oportunidade_deletada is None:
        return jsonify({"error": "Oportunidade não encontrada"}), 404
    return jsonify({"message": "Oportunidade deletada com sucesso"}), 200