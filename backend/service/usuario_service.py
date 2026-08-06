from backend.model.usuario import Usuario
from backend.extensions import db

def listar_usuarios():
    usuarios = db.session.get(Usuario, Usuario.id).all()
    return [usuario.to_dict() for usuario in usuarios]

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

def set_notificacao(usuario_id, tipo, valor):
    usuario = db.session.get(Usuario, usuario_id)
    if not usuario:
        return None #usuario nao existe

    if tipo == "noticia":
        usuario.recebeNotificacaoNoticia = valor
    elif tipo == "edital":
        usuario.recebeNotificacaoEdital = valor
    elif tipo == "oportunidade":
        usuario.recebeNotificacaoOportunidade = valor
    else:
        return None #tipo invalido

    db.session.commit()
    return usuario.to_dict()