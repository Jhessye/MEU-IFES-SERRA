# backend/service/notificacao_service.py
import requests
from backend.model.usuario import Usuario
from backend.extensions import db

EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"


def _enviar_push(usuarios, titulo, corpo, dados=None):
    tokens = [u.fcm_token for u in usuarios if u.fcm_token]
    if not tokens:
        return

    for i in range(0, len(tokens), 100):  # Expo aceita até 100 por chamada
        lote = tokens[i:i + 100]
        mensagens = [
            {"to": token, "title": titulo, "body": corpo, "data": dados or {}}
            for token in lote
        ]
        try:
            resposta = requests.post(
                EXPO_PUSH_URL,
                json=mensagens,
                headers={"Content-Type": "application/json", "Accept": "application/json"},
                timeout=10,
            )
            resultado = resposta.json()
        except requests.RequestException:
            continue

        tokens_invalidos = [
            lote[j] for j, item in enumerate(resultado.get("data", []))
            if item.get("status") == "error"
            and item.get("details", {}).get("error") == "DeviceNotRegistered"
        ]
        if tokens_invalidos:
            Usuario.query.filter(Usuario.fcm_token.in_(tokens_invalidos)) \
                .update({"fcm_token": None}, synchronize_session=False)
            db.session.commit()


def notificar_novo_edital(edital):
    usuarios = Usuario.query.filter_by(recebeNotificacaoEdital=True).all()
    _enviar_push(usuarios, "Novo edital disponível", edital.titulo,
                 dados={"tipo": "edital", "id": str(edital.id)})


def notificar_nova_oportunidade(oportunidade):
    usuarios = Usuario.query.filter_by(recebeNotificacaoOportunidade=True).all()
    _enviar_push(usuarios, "Nova oportunidade disponível", oportunidade.titulo,
                 dados={"tipo": "oportunidade", "id": str(oportunidade.id)})


def notificar_nova_noticia(noticia):
    usuarios = Usuario.query.filter_by(recebeNotificacaoNoticia=True).all()
    _enviar_push(usuarios, "Nova notícia publicada", noticia.titulo,
                 dados={"tipo": "noticia", "id": str(noticia.id)})