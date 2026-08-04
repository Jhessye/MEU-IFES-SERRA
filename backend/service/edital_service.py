from model.edital import Edital
from extensions import db

def listar_editais():
    edital = Edital.query.all()
    return [edital.to_dict() for edital in edital]

def criar_edital(data):
    novo_edital = Edital(
        titulo=data["titulo"],
        link=data["link"],
        texto=data["texto"]
    )
    if not novo_edital.titulo or not novo_edital.link or not novo_edital.texto:
        return None #dados incompletos
    db.session.add(novo_edital)
    db.session.commit()
    return novo_edital.to_dict()

def atualizar_edital(edital_id, data):
    edital = Edital.query.get(edital_id)
    if not edital:
        return None #edital nao existe

    if not data.get('titulo') or not data.get('link') or not data.get('texto'):
        return None #dados incompletos

    edital.titulo = data['titulo']
    edital.link = data['link']
    edital.texto = data['texto']

    db.session.commit()
    return edital.to_dict()

def deletar_edital(edital_id):
    edital = Edital.query.get(edital_id)
    if not edital:
        return None #edital nao existe
    db.session.delete(edital)
    db.session.commit()
    return True