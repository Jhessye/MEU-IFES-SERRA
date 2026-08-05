from backend.model.noticia import Noticia
from backend.extensions import db

def listar_noticias():
    noticias = db.session.get(Noticia, Noticia.id).all()
    return [noticia.to_dict() for noticia in noticias]  

def criar_noticia(data):
    nova_noticia = Noticia(
        titulo=data["titulo"],
        autor=data["autor"],
        data=data["data"],
        texto=data["texto"],
        imagem=data.get("imagem")
    )
    if not nova_noticia.titulo or not nova_noticia.autor or not nova_noticia.data or not nova_noticia.texto:
        return None #dados incompletos
    db.session.add(nova_noticia)
    db.session.commit()
    return nova_noticia.to_dict()

def atualizar_noticia(noticia_id, data):
    noticia = db.session.get(Noticia, noticia_id)
    if not noticia:
        return None #noticia nao existe

    if not data.get('titulo') or not data.get('autor') or not data.get('data') or not data.get('texto'):
        return None #dados incompletos

    noticia.titulo = data['titulo']
    noticia.autor = data['autor']
    noticia.data = data['data']
    noticia.texto = data['texto']
    noticia.imagem = data.get('imagem')

    db.session.commit()
    return noticia.to_dict()

def deletar_noticia(noticia_id):
    noticia = db.session.get(Noticia, noticia_id)
    if not noticia:
        return None #noticia nao existe
    db.session.delete(noticia)
    db.session.commit()
    return True