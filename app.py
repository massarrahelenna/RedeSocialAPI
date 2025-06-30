from flask import Flask, request, jsonify, send_from_directory
from flask_pymongo import PyMongo
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from bson.objectid import ObjectId
import os
import datetime

# Carrega variáveis do .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configurações do MongoDB e pasta de uploads
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
app.config["UPLOAD_FOLDER"] = "uploads"

# Inicializa o PyMongo
mongo = PyMongo(app)

# Cria pasta de uploads se não existir
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# Rota inicial
@app.route("/")
def index():
    return "API da Rede Social rodando! Use /api/photos para interagir."

# Ignora erro do favicon
@app.route("/favicon.ico")
def favicon():
    return "", 204

# 📤 Upload de foto (POST)
@app.route("/api/photos", methods=["POST"])
def upload_photo():
    if 'image' not in request.files:
        return jsonify({"error": "Imagem não enviada"}), 400

    image = request.files['image']
    if image.filename == '':
        return jsonify({"error": "Arquivo não selecionado"}), 400

    filename = secure_filename(image.filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    image.save(filepath)

    photo_data = {
        "user": request.form.get("user"),
        "description": request.form.get("description"),
        "image_path": filename,
        "created_at": datetime.datetime.utcnow(),
        "comments": []  # campo de comentários vazio (inicialmente)
    }

    result = mongo.db.photos.insert_one(photo_data)
    photo_data["_id"] = str(result.inserted_id)

    return jsonify(photo_data), 201

# Listar as fotos (GET)
@app.route("/api/photos", methods=["GET"])
def get_photos():
    photos = list(mongo.db.photos.find())
    for photo in photos:
        photo["_id"] = str(photo["_id"])
        photo["image_url"] = f"http://localhost:5000/uploads/{photo['image_path']}"
        photo["comments"] = photo.get("comments", [])  
    return jsonify(photos)

# Adiciona comentário (POST)
@app.route('/api/photos/<photo_id>/comments', methods=['POST'])
def add_comment(photo_id):
    data = request.json
    photo = mongo.db.photos.find_one({'_id': ObjectId(photo_id)})
    if photo:
        comments = photo.get('comments', [])
        comments.append({
            'user': data.get('user'),
            'text': data.get('text')
        })
        mongo.db.photos.update_one(
            {'_id': ObjectId(photo_id)},
            {'$set': {'comments': comments}}
        )
        return jsonify({'message': 'Comentário adicionado com sucesso'}), 200
    return jsonify({'error': 'Foto não encontrada'}), 404


# Deletar foto 
@app.route("/api/photos/<id>", methods=["DELETE"])
def delete_photo(id):
    result = mongo.db.photos.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 1:
        return jsonify({"message": "Foto deletada com sucesso"}), 200
    else:
        return jsonify({"error": "Foto não encontrada"}), 404

# Servir imagem (GET)
@app.route("/uploads/<filename>")
def serve_image(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

# Inicia o servidor
if __name__ == "__main__":
    app.run(debug=True)
