from flask import jsonify, Blueprint, request
from services import edital_service

edital_bp = Blueprint('edital', __name__, url_prefix='/autores')

@edital_bp.route('/', methods=['GET'])
def listar_editais():
    editais = edital_service.listar_editais()
    return jsonify(editais), 200

@edital_bp.route('/', methods=['POST'])
def criar_edital():
    data = request.get_json()
    novo_edital = edital_service.criar_edital(data)
    if novo_edital is None:
        return jsonify({"error": "Dados incompletos"}), 400
    return jsonify(novo_edital), 201

@edital_bp.route('/<int:edital_id>', methods=['PUT'])
def atualizar_edital(edital_id):
    data = request.get_json()
    edital_atualizado = edital_service.atualizar_edital(edital_id, data)
    if edital_atualizado is None:
        return jsonify({"error": "Edital não encontrado ou dados incompletos"}), 404
    return jsonify(edital_atualizado), 200

@edital_bp.route('/<int:edital_id>', methods=['DELETE'])
def deletar_edital(edital_id):
    edital_deletado = edital_service.deletar_edital(edital_id)
    if edital_deletado is None:
        return jsonify({"error": "Edital não encontrado"}), 404
    return jsonify({"message": "Edital deletado com sucesso"}), 200