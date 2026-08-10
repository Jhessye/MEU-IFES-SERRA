from backend.model.usuario import Usuario
from backend.extensions import db

def listar_usuarios(page=1, per_page=20):
    page = int(page or 1)
    per_page = int(per_page or 20)
    paginacao = Usuario.query.paginate(page=page, per_page=per_page, error_out=False)
    return {
        "items": [usuario.to_dict() for usuario in paginacao.items],
        "total": paginacao.total,
        "page": page,
        "pages": paginacao.pages,
    }

def criar_usuario(data):
    try:
        recebe_notificacao_noticia = data.get("recebeNotificacaoNoticia")
        recebe_notificacao_edital = data.get("recebeNotificacaoEdital")
        recebe_notificacao_oportunidade = data.get("recebeNotificacaoOportunidade")

        novo_usuario = Usuario(
            recebeNotificacaoNoticia=recebe_notificacao_noticia,
            recebeNotificacaoEdital=recebe_notificacao_edital,
            recebeNotificacaoOportunidade=recebe_notificacao_oportunidade
        )
        db.session.add(novo_usuario)
        db.session.commit()
        return novo_usuario.to_dict()
    except (AttributeError, TypeError, KeyError, ValueError):
        return None

def atualizar_usuario(usuario_id, data):
    usuario = db.session.get(Usuario, usuario_id)
    if not usuario:
        return None #usuario nao existe

    try:
        usuario.recebeNotificacaoNoticia = data.get("recebeNotificacaoNoticia")
        usuario.recebeNotificacaoEdital = data.get("recebeNotificacaoEdital")
        usuario.recebeNotificacaoOportunidade = data.get("recebeNotificacaoOportunidade")

        db.session.commit()
        return usuario.to_dict()
    except (AttributeError, TypeError, KeyError, ValueError):
        return None

def deletar_usuario(usuario_id):
    usuario = db.session.get(Usuario, usuario_id)
    if not usuario:
        return None #usuario nao existe
    db.session.delete(usuario)
    db.session.commit()
    return True

def alternar_notificacao(usuario_id, campo_preferencia):
    usuario = db.session.get(Usuario, usuario_id)
    if usuario is None:
        return None

    if campo_preferencia == 'recebeNotificacaoNoticia':
        usuario.recebeNotificacaoNoticia = not usuario.recebeNotificacaoNoticia
    elif campo_preferencia == 'recebeNotificacaoEdital':
        usuario.recebeNotificacaoEdital = not usuario.recebeNotificacaoEdital
    elif campo_preferencia == 'recebeNotificacaoOportunidade':
        usuario.recebeNotificacaoOportunidade = not usuario.recebeNotificacaoOportunidade

    db.session.commit()
    return usuario.to_dict()

def registrar_dispositivo(usuario_id, token):
    usuario = db.session.get(Usuario, usuario_id)
    if usuario is None:
        return False
    usuario.fcm_token = token
    db.session.commit()
    return True