from backend.model.edital import Edital
from backend.extensions import db
from backend.model.usuario import Usuario
from backend.service import notificacao_service

def listar_editais(page=1, per_page=20):
    page = int(page or 1)
    per_page = int(per_page or 20)
    paginacao = Edital.query.paginate(page=page, per_page=per_page, error_out=False)
    return {
        "items": [edital.to_dict() for edital in paginacao.items],
        "total": paginacao.total,
        "page": page,
        "pages": paginacao.pages,
    }

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
        notificacao_service.notificar_novo_edital(novo_edital)
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
