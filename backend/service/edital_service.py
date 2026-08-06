from backend.model.edital import Edital
from backend.extensions import db
from backend.model.usuario import Usuario

def listar_editais():
    edital = db.session.get(Edital, Edital.id).all()
    return [edital.to_dict() for edital in edital]

def criar_edital(data):
    try:
        titulo = data.get("titulo")
        link = data.get("link")
        pdf = data.get("pdf")
        formulario = data.get("formulario")
        texto = data.get("texto")

        if not titulo or not link or not texto:
            return None #dados incompletos

        novo_edital = Edital(
            titulo=titulo,
            link=link,
            pdf=pdf,
            formulario=formulario,
            texto=texto
        )
        db.session.add(novo_edital)
        db.session.commit()
        return novo_edital.to_dict()
    except (AttributeError, TypeError, KeyError, ValueError):
        return None

def atualizar_edital(edital_id, data):
    edital = db.session.get(Edital, edital_id)
    if not edital:
        return None #edital nao existe

    try:
        titulo = data.get("titulo")
        link = data.get("link")
        pdf = data.get("pdf")
        formulario = data.get("formulario")
        texto = data.get("texto")

        if not titulo or not link or not texto:
            return None #dados incompletos

        edital.titulo = titulo
        edital.link = link
        edital.pdf = pdf
        edital.formulario = formulario
        edital.texto = texto

        db.session.commit()
        return edital.to_dict()
    except (AttributeError, TypeError, KeyError, ValueError):
        return None

def deletar_edital(edital_id):
    edital = db.session.get(Edital, edital_id)
    if not edital:
        return None #edital nao existe
    db.session.delete(edital)
    db.session.commit()
    return True

def favoritar_edital(usuario_id, edital_id):
    usuario = db.session.get(Usuario, usuario_id)
    edital = db.session.get(Edital, edital_id)

    if not usuario or not edital:
        return False # Usuário ou Edital não encontrado

    if edital not in usuario.editais_salvos:
        usuario.editais_salvos.append(edital)
        db.session.commit()
    
    return True

def desfavoritar_edital(usuario_id, edital_id):
    usuario = db.session.get(Usuario, usuario_id)
    edital = db.session.get(Edital, edital_id)

    if not usuario or not edital:
        return False

    if edital in usuario.editais_salvos:
        usuario.editais_salvos.remove(edital)
        db.session.commit()
        
    return True