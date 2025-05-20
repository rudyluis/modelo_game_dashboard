from flask import Flask, render_template, request, redirect, url_for, flash
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from sqlalchemy.orm import sessionmaker
from models.base import engine
from models.model import Usuario, VideoGameSale
from werkzeug.security import generate_password_hash, check_password_hash
import os
from flask import jsonify
app = Flask(__name__)

app.secret_key = os.environ.get("SECRET_KEY", "dev_key_fallback")

# Crear sesión SQLAlchemy
Session = sessionmaker(bind=engine)
db_session = Session()

# Setup de LoginManager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth'

@login_manager.user_loader
def load_user(user_id):
    return db_session.query(Usuario).get(int(user_id))

# Ruta principal
@app.route('/')
def home():
    return render_template('auth.html')


@app.route('/auth', methods=['GET', 'POST'])
def auth():
    if request.method == 'POST':
        action = request.form['action']
        username = request.form['username']
        password = request.form['password']
        if action == 'register':
            if db_session.query(Usuario).filter(username == username).first():
                flash('El usuario ya existe','danger')
            else:
                new_user = Usuario(
                    username=username, 
                    password=generate_password_hash(password)
                )
                db_session.add(new_user)
                db_session.commit()
                flash('Usuario creado exitosamente','success')  
                return redirect(url_for('auth'))
        elif action == 'login':
            user = db_session.query(Usuario).filter(username == username).first()
            if user and check_password_hash(user.password, password):
                login_user(user)
                flash('Sesión iniciada exitosamente','success')
                return redirect(url_for('dashboard'))
            else:
                flash('Usuario o contraseña incorrectos','danger')
                return redirect(url_for('auth'))
    return render_template('auth.html')  # Renderizamos el formulario

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', username= current_user.username)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth'))

if __name__ == '__main__':
    app.run(debug=True)
