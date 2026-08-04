from service import noticia_service
from flask import jsonify, Blueprint, request

noticia_bp = Blueprint('noticia', __name__, url_prefix='/noticia')

@noticia_bp.route('/', methods=['GET'])
def listar_noticias():
    noticias = noticia_service.listar_noticias()
    return jsonify(noticias), 200   

@noticia_bp.route('/', methods=['POST'])
def criar_noticia():
    data = request.get_json()
    nova_noticia = noticia_service.criar_noticia(data)
    if nova_noticia is None:
        return jsonify({"error": "Dados incompletos"}), 400
    return jsonify(nova_noticia), 201

@noticia_bp.route('/<int:noticia_id>', methods=['PUT'])
def atualizar_noticia(noticia_id):
    data = request.get_json()
    noticia_atualizada = noticia_service.atualizar_noticia(noticia_id, data)
    if noticia_atualizada is None:
        return jsonify({"error": "Notícia não encontrada ou dados incompletos"}), 404
    return jsonify(noticia_atualizada), 200

@noticia_bp.route('/<int:noticia_id>', methods=['DELETE'])
def deletar_noticia(noticia_id):
    noticia_deletada = noticia_service.deletar_noticia(noticia_id)
    if noticia_deletada is None:
        return jsonify({"error": "Notícia não encontrada"}), 404
    return jsonify({"message": "Notícia deletada com sucesso"}), 200