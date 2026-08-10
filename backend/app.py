from apiflask import APIFlask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from cli import criar_admin, resetar_senha_admin
from infra.config import Config
from extensions import db
from controller import admin_controller, auth_controller, noticia_controller, search_controller, usuario_controller, edital_controller, oportunidade_controller

app = APIFlask(__name__)
app.config.from_object(Config) # conecta com o banco
CORS(app)
JWTManager(app)

db.init_app(app) # inicializa a extensão do banco de dados com a aplicação Flask

app.register_blueprint(auth_controller.auth_bp)
app.register_blueprint(usuario_controller.usuario_bp)
app.register_blueprint(edital_controller.edital_bp)
app.register_blueprint(oportunidade_controller.oportunidade_bp)
app.register_blueprint(noticia_controller.noticia_bp)
app.register_blueprint(admin_controller.admin_bp)
app.register_blueprint(search_controller.search_bp)

app.cli.add_command(criar_admin) #flask criar-admin joao minhasenha123
app.cli.add_command(resetar_senha_admin)

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True) # TIRAR QUANDO ENTRAR EM PRODUÇÃO, PARA NÃO EXPOR O CÓDIGO-FONTE