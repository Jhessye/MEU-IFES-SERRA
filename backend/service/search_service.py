from backend.model.edital import Edital
from backend.model.noticia import Noticia
from backend.model.oportunidade import Oportunidade
from sqlalchemy import and_

def _filtro_dinamico(campo, termo):
    
    palavras = termo.strip().split()
    return and_(*[campo.ilike(f"%{palavra}%") for palavra in palavras])


def pesquisar_noticias(termo):
    if not termo:
        return []
    return Noticia.query.filter(
        _filtro_dinamico(Noticia.titulo, termo)
    ).all()

def pesquisar_editais(termo):
    if not termo:
        return []
    return Edital.query.filter(
        _filtro_dinamico(Edital.titulo, termo)
    ).all()

def pesquisar_oportunidades(termo):
    if not termo:
        return []
    return Oportunidade.query.filter(
        _filtro_dinamico(Oportunidade.titulo, termo)
    ).all()