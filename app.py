from flask import Flask
from infra.config import Config
from backend import extensions as db
from backend.controller import noticia_controller, usuario_controller, edital_controller, oportunidade_controller

app = Flask(__name__)
app.config.from_object(Config) # conecta com o banco

db.init_app(app) # inicializa a extensão do banco de dados com a aplicação Flask

app.register_blueprint(usuario_controller.usuario_bp)
app.register_blueprint(edital_controller.edital_bp)
app.register_blueprint(oportunidade_controller.oportunidade_bp)
app.register_blueprint(noticia_controller.noticia_bp)

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)