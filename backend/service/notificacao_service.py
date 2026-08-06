from firebase_admin import messaging
from backend.model.usuario import Usuario
from backend.extensions import db

def _enviar_push(usuarios, titulo, corpo, dados=None):
    tokens = [u.fcm_token for u in usuarios if u.fcm_token]
    if not tokens:
        return

    # FCM aceita até 500 tokens por chamada de multicast
    for i in range(0, len(tokens), 500):
        lote = tokens[i:i+500]
        message = messaging.MulticastMessage(
            notification=messaging.Notification(title=titulo, body=corpo),
            data=dados or {},
            tokens=lote,
        )
        response = messaging.send_each_for_multicast(message)

        tokens_invalidos = [
            lote[j] for j, r in enumerate(response.responses) if not r.success
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