from ast import Not

from backend.model.noticia import Noticia
from backend.extensions import db
from backend.service import notificacao_service

def listar_noticias():
    noticias = Noticia.query.all()
    return [noticia.to_dict() for noticia in noticias]  

def criar_noticia(data):
    try:
        titulo = data.get("titulo")
        link = data.get("link")
        autor = data.get("autor")
        data_noticia = data.get("data")
        texto = data.get("texto")
        imagem = data.get("imagem")

        if not titulo or not autor or not data_noticia or not texto:
            return None #dados incompletos

        nova_noticia = Noticia(
            titulo=titulo,
            link=link,
            autor=autor,
            data=data_noticia,
            texto=texto,
            imagem=imagem
        )
        db.session.add(nova_noticia)
        db.session.commit()
        notificacao_service.notificar_nova_noticia(nova_noticia)
        return nova_noticia.to_dict()
    except (AttributeError, TypeError, KeyError, ValueError):
        return None

def atualizar_noticia(noticia_id, data):
    noticia = db.session.get(Noticia, noticia_id)
    if not noticia:
        return None #noticia nao existe

    try:
        titulo = data.get("titulo")
        link = data.get("link")
        autor = data.get("autor")
        data_noticia = data.get("data")
        texto = data.get("texto")
        imagem = data.get("imagem")

        if not titulo or not autor or not data_noticia or not texto:
            return None #dados incompletos

        noticia.titulo = titulo
        noticia.link = link
        noticia.autor = autor
        noticia.data = data_noticia
        noticia.texto = texto
        noticia.imagem = imagem

        db.session.commit()
        return noticia.to_dict()
    except (AttributeError, TypeError, KeyError, ValueError):
        return None

def deletar_noticia(noticia_id):
    noticia = db.session.get(Noticia, noticia_id)
    if not noticia:
        return None #noticia nao existe
    db.session.delete(noticia)
    db.session.commit()
    return True