from model.usuario import Usuario
from extensions import db

def listar_usuarios():
    usuarios = Usuario.query.all()
    return [usuario.to_dict() for usuario in usuarios]

def criar_usuario(data):
    novo_usuario = Usuario(
        recebeNotificacaoNoticia=data["recebeNotificacaoNoticia"],
        recebeNotificacaoEdital=data["recebeNotificacaoEdital"],
        recebeNotificacaoOportunidade=data["recebeNotificacaoOportunidade"]
    )
    db.session.add(novo_usuario)
    db.session.commit()
    return novo_usuario.to_dict()

def atualizar_usuario(usuario_id, data):
    usuario = Usuario.query.get(usuario_id)
    if not usuario:
        return None #usuario nao existe

    usuario.recebeNotificacaoNoticia = data["recebeNotificacaoNoticia"]
    usuario.recebeNotificacaoEdital = data["recebeNotificacaoEdital"]
    usuario.recebeNotificacaoOportunidade = data["recebeNotificacaoOportunidade"]

    db.session.commit()
    return usuario.to_dict()

def deletar_usuario(usuario_id):
    usuario = Usuario.query.get(usuario_id)
    if not usuario:
        return None #usuario nao existe
    db.session.delete(usuario)
    db.session.commit()
    return True