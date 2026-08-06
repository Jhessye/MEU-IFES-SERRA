from backend.model.edital import Edital
from backend.model.noticia import Noticia
from backend.model.oportunidade import Oportunidade

def pesquisar_noticias(termo):
    
    if not termo:
        return []
    
    # Busca notícias que COMEÇAM com o termo
    noticias = Noticia.query.filter(
        Noticia.titulo.like(f"{termo}%")
    ).all()
    
    return noticias

def pesquisar_editais(termo):

    if not termo:
        return []
    
    # Busca editais que COMEÇAM com o termo
    editais = Edital.query.filter(
        Edital.titulo.like(f"{termo}%")
    ).all()
    
    return editais

def pesquisar_oportunidades(termo):
    
    if not termo:
        return []
    
    # Busca oportunidades que COMEÇAM com o termo
    oportunidades = Oportunidade.query.filter(
        Oportunidade.titulo.like(f"{termo}%")
    ).all()
    
    return oportunidades