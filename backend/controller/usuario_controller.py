from service import usuario_service
from flask import jsonify, Blueprint, request

usuario_bp = Blueprint('usuario', __name__, url_prefix='/usuario')

@usuario_bp.route('/', methods=['GET'])
def listar_usuarios():
    usuarios = usuario_service.listar_usuarios()
    return jsonify(usuarios), 200

@usuario_bp.route('/', methods=['POST'])
def criar_usuario():
    data = request.get_json()
    novo_usuario = usuario_service.criar_usuario(data)
    if novo_usuario is None:
        return jsonify({"error": "Dados incompletos"}), 400
    return jsonify(novo_usuario), 201

@usuario_bp.route('/<int:usuario_id>', methods=['PUT'])
def atualizar_usuario(usuario_id):
    data = request.get_json()
    usuario_atualizado = usuario_service.atualizar_usuario(usuario_id, data)
    if usuario_atualizado is None:
        return jsonify({"error": "Usuário não encontrado ou dados incompletos"}), 404
    return jsonify(usuario_atualizado), 200

@usuario_bp.route('/<int:usuario_id>', methods=['DELETE'])
def deletar_usuario(usuario_id):
    usuario_deletado = usuario_service.deletar_usuario(usuario_id)
    if usuario_deletado is None:
        return jsonify({"error": "Usuário não encontrado"}), 404
    return jsonify({"message": "Usuário deletado com sucesso"}), 200