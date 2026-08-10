from backend.service import noticia_service
from flask import jsonify
from apiflask import APIBlueprint
from backend.decorators.auth import admin_required
from backend.schema.noticia_schema import NoticiaInSchema

noticia_bp = APIBlueprint('noticia', __name__, url_prefix='/noticia')

@noticia_bp.route('/', methods=['GET'])
def listar_noticias():
    noticias = noticia_service.listar_noticias()
    return jsonify(noticias), 200   

@noticia_bp.route('/', methods=['POST'])
@admin_required
@noticia_bp.input(NoticiaInSchema)
def criar_noticia(json_data):
    nova_noticia = noticia_service.criar_noticia(json_data)
    if nova_noticia is None:
        return jsonify({"error": "Dados incompletos"}), 400
    return jsonify(nova_noticia), 201

@noticia_bp.route('/<uuid:noticia_id>', methods=['PUT'])
@admin_required
@noticia_bp.input(NoticiaInSchema)
def atualizar_noticia(noticia_id, json_data):
    noticia_atualizada = noticia_service.atualizar_noticia(noticia_id, json_data)
    if noticia_atualizada is None:
        return jsonify({"error": "Notícia não encontrada ou dados incompletos"}), 404
    return jsonify(noticia_atualizada), 200

@noticia_bp.route('/<uuid:noticia_id>', methods=['DELETE'])
@admin_required
def deletar_noticia(noticia_id):
    noticia_deletada = noticia_service.deletar_noticia(noticia_id)
    if noticia_deletada is None:
        return jsonify({"error": "Notícia não encontrada"}), 404
    return jsonify({"message": "Notícia deletada com sucesso"}), 200