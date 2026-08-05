from backend.model.usuario import Usuario
from backend.extensions import db

def listar_usuarios():
    usuarios = db.session.get(Usuario, Usuario.id).all()
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
    usuario = db.session.get(Usuario, usuario_id)
    if not usuario:
        return None #usuario nao existe

    usuario.recebeNotificacaoNoticia = data["recebeNotificacaoNoticia"]
    usuario.recebeNotificacaoEdital = data["recebeNotificacaoEdital"]
    usuario.recebeNotificacaoOportunidade = data["recebeNotificacaoOportunidade"]

    db.session.commit()
    return usuario.to_dict()

def deletar_usuario(usuario_id):
    usuario = db.session.get(Usuario, usuario_id)
    if not usuario:
        return None #usuario nao existe
    db.session.delete(usuario)
    db.session.commit()
    return True