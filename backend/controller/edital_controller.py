from flask import jsonify
from apiflask import APIBlueprint
from backend.decorators.auth import admin_required
from backend.service import edital_service
from backend.schema.edital_schema import EditalInSchema

edital_bp = APIBlueprint('edital', __name__, url_prefix='/edital')

@edital_bp.route('/', methods=['GET'])
def listar_editais():
    editais = edital_service.listar_editais()
    return jsonify(editais), 200

@edital_bp.route('/', methods=['POST'])
@admin_required
@edital_bp.input(EditalInSchema)
def criar_edital(json_data):
    novo_edital = edital_service.criar_edital(json_data)
    if novo_edital is None:
        return jsonify({"error": "Dados incompletos"}), 400
    return jsonify(novo_edital), 201

@edital_bp.route('/<uuid:edital_id>', methods=['PUT'])
@admin_required
@edital_bp.input(EditalInSchema)
def atualizar_edital(edital_id, json_data):
    edital_atualizado = edital_service.atualizar_edital(edital_id, json_data)
    if edital_atualizado is None:
        return jsonify({"error": "Edital não encontrado ou dados incompletos"}), 404
    return jsonify(edital_atualizado), 200

@edital_bp.route('/<uuid:edital_id>', methods=['DELETE'])
@admin_required
def deletar_edital(edital_id):
    edital_deletado = edital_service.deletar_edital(edital_id)
    if edital_deletado is None:
        return jsonify({"error": "Edital não encontrado"}), 404
    return jsonify({"message": "Edital deletado com sucesso"}), 200