from backend.model.noticia import Noticia
from backend.extensions import db
from backend.service import notificacao_service

def listar_noticias(page=1, per_page=20):
    page = int(page or 1)
    per_page = int(per_page or 20)
    paginacao = Noticia.query.paginate(page=page, per_page=per_page, error_out=False)
    return {
        "items": [noticia.to_dict() for noticia in paginacao.items],
        "total": paginacao.total,
        "page": page,
        "pages": paginacao.pages,
    }

def criar_noticia(data):
    try:
        print("DATA RECEBIDA:", data)

        titulo = data.get("titulo")
        link = data.get("link")
        autor = data.get("autor")
        data_noticia = data.get("data")
        texto = data.get("texto")
        imagem = data.get("imagem")

        print("titulo:", titulo)
        print("link:", link)
        print("autor:", autor)
        print("data:", data_noticia, type(data_noticia))
        print("texto:", texto)
        print("imagem:", imagem)

        if not titulo or not autor or not data_noticia or not texto:
            print("DADOS INCOMPLETOS")
            return None

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

    except Exception as e:
        print("ERRO REAL:", type(e).__name__, str(e))
        db.session.rollback()
        raise

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