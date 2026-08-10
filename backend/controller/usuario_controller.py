from backend.decorators.auth import admin_required
from backend.service import usuario_service
from flask import jsonify, request
from apiflask import APIBlueprint
from backend.schema.usuario_schema import UsuarioInSchema


usuario_bp = APIBlueprint('usuario', __name__, url_prefix='/usuario')

@usuario_bp.route('/', methods=['GET'])
def listar_usuarios():
    usuarios = usuario_service.listar_usuarios()
    return jsonify(usuarios), 200

@usuario_bp.route('/', methods=['POST'])
@usuario_bp.input(UsuarioInSchema)
def criar_usuario(json_data):
        
    novo_usuario = usuario_service.criar_usuario(json_data)
    if novo_usuario is None:
        return jsonify({"error": "Dados incompletos"}), 400
    return jsonify(novo_usuario), 201

@usuario_bp.route('/<uuid:usuario_id>', methods=['PUT'])
@usuario_bp.input(UsuarioInSchema)
def atualizar_usuario(usuario_id, json_data):
    usuario_atualizado = usuario_service.atualizar_usuario(usuario_id, json_data)
    if usuario_atualizado is None:
        return jsonify({"error": "Usuário não encontrado ou dados incompletos"}), 404
    return jsonify(usuario_atualizado), 200

@usuario_bp.route('/<uuid:usuario_id>', methods=['DELETE'])
def deletar_usuario(usuario_id):
    usuario_deletado = usuario_service.deletar_usuario(usuario_id)
    if usuario_deletado is None:
        return jsonify({"error": "Usuário não encontrado"}), 404
    return jsonify({"message": "Usuário deletado com sucesso"}), 200

@usuario_bp.route('/<uuid:usuario_id>/salvar_edital/<uuid:edital_id>', methods=['POST'])
def salvar_edital(usuario_id, edital_id):
    sucesso = usuario_service.salvar_edital(usuario_id, edital_id)
    if not sucesso:
        return jsonify({"error": "Usuário ou Edital não encontrado"}), 404
    return jsonify({"message": "Edital salvo com sucesso"}), 200

@usuario_bp.route('/<uuid:usuario_id>/dessalvar_edital/<uuid:edital_id>', methods=['DELETE'])
def dessalvar_edital(usuario_id, edital_id):
    sucesso = usuario_service.dessalvar_edital(usuario_id, edital_id)
    if not sucesso:
        return jsonify({"error": "Usuário ou Edital não encontrado"}), 404
    return jsonify({"message": "Edital dessalvo com sucesso"}), 200

@usuario_bp.route('/<uuid:usuario_id>/salvar_oportunidade/<uuid:oportunidade_id>', methods=['POST'])
def salvar_oportunidade(usuario_id, oportunidade_id):
    sucesso = usuario_service.salvar_oportunidade(usuario_id, oportunidade_id)
    if not sucesso:
        return jsonify({"error": "Usuário ou Oportunidade não encontrado"}), 404
    return jsonify({"message": "Oportunidade salva com sucesso"}), 200

@usuario_bp.route('/<uuid:usuario_id>/dessalvar_oportunidade/<uuid:oportunidade_id>', methods=['DELETE'])
def dessalvar_oportunidade(usuario_id, oportunidade_id):
    sucesso = usuario_service.dessalvar_oportunidade(usuario_id, oportunidade_id)
    if not sucesso:
        return jsonify({"error": "Usuário ou Oportunidade não encontrado"}), 404
    return jsonify({"message": "Oportunidade dessalva com sucesso"}), 200

@usuario_bp.route('/<uuid:usuario_id>/notificacao/noticia', methods=['PATCH'])
def alternar_notificacao_noticia(usuario_id):
    usuario_atualizado = usuario_service.alternar_notificacao(usuario_id, 'recebeNotificacaoNoticia')
    if usuario_atualizado is None:
        return jsonify({"error": "Usuário não encontrado"}), 404
    return jsonify(usuario_atualizado), 200

@usuario_bp.route('/<uuid:usuario_id>/notificacao/edital', methods=['PATCH'])
def alternar_notificacao_edital(usuario_id):
    usuario_atualizado = usuario_service.alternar_notificacao(usuario_id, 'recebeNotificacaoEdital')
    if usuario_atualizado is None:
        return jsonify({"error": "Usuário não encontrado"}), 404
    return jsonify(usuario_atualizado), 200

@usuario_bp.route('/<uuid:usuario_id>/notificacao/oportunidade', methods=['PATCH'])
def alternar_notificacao_oportunidade(usuario_id):
    usuario_atualizado = usuario_service.alternar_notificacao(usuario_id, 'recebeNotificacaoOportunidade')
    if usuario_atualizado is None:
        return jsonify({"error": "Usuário não encontrado"}), 404
    return jsonify(usuario_atualizado), 200

@usuario_bp.route('/<uuid:usuario_id>/dispositivo', methods=['POST'])
def registrar_dispositivo(usuario_id):
    data = request.get_json()
    token = data.get('token')
    sucesso = usuario_service.registrar_dispositivo(usuario_id, token)
    if not sucesso:
        return jsonify({"error": "Usuário não encontrado"}), 404
    return jsonify({"message": "Dispositivo registrado"}), 200