from backend.model.oportunidade import Oportunidade
from backend.extensions import db
from backend.model.usuario import Usuario
from backend.service import notificacao_service
from datetime import date

def calcular_dias_inscricao(data_fim, data_atual=None):
    return (data_fim - (data_atual or date.today())).days

def listar_oportunidades(page=1, per_page=20):
    page = int(page or 1)
    per_page = int(per_page or 20)
    paginacao = Oportunidade.query.paginate(page=page, per_page=per_page, error_out=False)
    return {
        "items": [oportunidade.to_dict() for oportunidade in paginacao.items],
        "total": paginacao.total,
        "page": page,
        "pages": paginacao.pages,
    }

def criar_oportunidade(data):
    try:
        titulo = data.get("titulo")
        link_vaga = data.get("link_vaga")
        carga_horaria = data.get("cargaHoraria")
        requisitos = data.get("requisitos")
        observacoes = data.get("observacoes")
        data_fim = data.get("dataFinalInscricao")

        if not titulo or not carga_horaria or not requisitos or not data_fim:
            return None #dados incompletos

        if calcular_dias_inscricao(data_fim) < 0:
            return None #dados incompletos

        nova_oportunidade = Oportunidade(
            titulo=titulo,
            link_vaga=link_vaga,
            cargaHoraria=carga_horaria,
            requisitos=requisitos,
            observacoes=observacoes,
            dataFinalInscricao=data_fim
        )
        db.session.add(nova_oportunidade)
        db.session.commit()
        notificacao_service.notificar_nova_oportunidade(nova_oportunidade)
        return nova_oportunidade.to_dict()
    except (AttributeError, TypeError, KeyError, ValueError):
        return None

def atualizar_oportunidade(oportunidade_id, data):
    oportunidade = db.session.get(Oportunidade, oportunidade_id)
    if not oportunidade:
        return None #oportunidade nao existe

    try:
        titulo = data.get("titulo")
        link_vaga = data.get("link_vaga")
        carga_horaria = data.get("cargaHoraria")
        requisitos = data.get("requisitos")
        observacoes = data.get("observacoes")
        data_fim = data.get("dataFinalInscricao")

        if not titulo or not carga_horaria or not requisitos or not data_fim:
            return None #dados incompletos

        if calcular_dias_inscricao(data_fim) < 0:
            return None #dados incompletos

        oportunidade.titulo = titulo
        oportunidade.link_vaga = link_vaga
        oportunidade.cargaHoraria = carga_horaria
        oportunidade.requisitos = requisitos
        oportunidade.observacoes = observacoes
        oportunidade.dataFinalInscricao = data_fim

        db.session.commit()
        return oportunidade.to_dict()
    except (AttributeError, TypeError, KeyError, ValueError):
        return None

def deletar_oportunidade(oportunidade_id):
    oportunidade = db.session.get(Oportunidade, oportunidade_id)
    if not oportunidade:
        return None #oportunidade nao existe
    db.session.delete(oportunidade)
    db.session.commit()
    return True
