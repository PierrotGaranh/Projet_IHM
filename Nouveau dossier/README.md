# 🅿️ Gestion du Parking - Application Complète

Une suite d'applications pour la gestion de parking avec interface desktop et web.

## 📁 Structure du projet

```
nouveau-dossier/
├── 📱 Applications Desktop
│   ├── parking_system.py      # Backend système de parking
│   ├── app_desktop.py         # Interface desktop Tkinter
│   └── parking_data.json      # Données persistées
│
├── 🌐 Applications Web
│   ├── app_web.py            # Serveur Flask API REST
│   ├── parking_web.html      # Interface web parking
│   ├── calculator.html       # Interface calculatrice
│   └── requirements.txt      # Dépendances Python
│
├── 🔧 Utilitaires JavaScript
│   ├── function.js           # Fonctions mathématiques avancées
│   ├── projet.js             # Tests des fonctions
│   └── package.json          # Configuration Node.js
│
└── 📄 Autres
    ├── gestpa.py             # Ancienne version CLI
    └── parking_reservations.json
```

## 🚀 Démarrage rapide

### 1. Application Desktop (Tkinter)
```bash
python app_desktop.py
```
- Interface graphique moderne
- Gestion complète des utilisateurs et places
- Statistiques et historique

### 2. Application Web (Flask)
```bash
# Installer les dépendances
pip install -r requirements.txt

# Lancer le serveur
python app_web.py
```
- Accéder à http://localhost:5000 pour l'interface parking
- Accéder à http://localhost:5000/calculator pour la calculatrice

### 3. Calculatrice Web (Standalone)
Ouvrir `calculator.html` dans un navigateur ou :
```bash
python -m http.server 8000
# Accéder à http://localhost:8000/calculator.html
```

## 🔧 Dépannage

### Problèmes courants et solutions

#### ❌ L'application ne se lance pas
```bash
# Diagnostiquer les problèmes
python diagnostic.py
```

#### ❌ Fenêtre Tkinter invisible
- Vérifiez la barre des tâches
- Utilisez Alt+Tab pour basculer entre les fenêtres
- Redémarrez votre ordinateur

#### ❌ Erreur "Module not found"
```bash
# Installer les dépendances manquantes
pip install tk tkinter
```

#### ❌ Problème de permissions
- Lancez l'application en tant qu'administrateur
- Vérifiez que le dossier n'est pas en lecture seule

#### ❌ Application se ferme immédiatement
```bash
# Utilisez le lanceur alternatif
python launch_app.py
```

### Vérifications préalables
- ✅ Python 3.6+ installé
- ✅ Tkinter disponible (`python -c "import tkinter"`)
- ✅ Permissions d'écriture dans le dossier
- ✅ Fichiers `parking_system.py` et `app_desktop.py` présents

### Scripts de lancement
- `lancer_app.bat` - Lanceur Windows simple
- `launch_app.py` - Lanceur alternatif avec diagnostic
- `diagnostic.py` - Outil de diagnostic complet

## 🎯 Fonctionnalités

### 🖥️ Interface Desktop
- **🔐 Authentification** : Connexion avec comptes utilisateurs
- **👥 Gestion utilisateurs** : Création de comptes (admin seulement)
- **🅿️ Gestion places** : Ajout, réservation, libération, suppression
- **📊 Statistiques** : Taux d'occupation, nombres de places
- **📜 Historique** : Tous les événements tracés
- **⚙️ Administration** : Fonctions réservées aux admins

### 🌐 Interface Web
- **📱 Design responsive** : Fonctionne sur mobile et desktop
- **🔄 Temps réel** : Actualisation automatique des données
- **🎨 Interface moderne** : Animations et effets visuels
- **🔍 Recherche** : Filtrage des places
- **📊 Dashboard** : Statistiques visuelles
- **⚡ API REST** : Communication avec le backend Python

### 🧮 Calculatrice Mathématique
- **➕➖✖️➗ Opérations de base** : Addition, soustraction, multiplication, division
- **🔢 Fonctions avancées** : Puissance, racine carrée, factorielle, Fibonacci
- **🔍 Nombres premiers** : Vérification et calculs
- **📐 Mathématiques** : PGCD, PPCM
- **💾 Historique** : Sauvegarde locale des calculs
- **⌨️ Raccourcis** : Utilisation du clavier

## 🔧 API REST (Flask)

### Endpoints Parking
```
GET    /api/spots           # Liste des places
POST   /api/spots           # Ajouter une place
POST   /api/spots/:id/reserve   # Réserver une place
DELETE /api/spots/:id/release   # Libérer une place
GET    /api/stats           # Statistiques
GET    /api/history         # Historique
```

### Endpoints Calculatrice
```
POST   /api/calculate/:operation  # Effectuer un calcul
```

## 👤 Rôles et Permissions

| Action | Utilisateur | Admin |
|--------|-------------|-------|
| Voir places | ✅ | ✅ |
| Réserver place | ✅ | ✅ |
| Libérer sa place | ✅ | ✅ |
| Libérer n'importe quelle place | ❌ | ✅ |
| Ajouter place | ❌ | ✅ |
| Supprimer place | ❌ | ✅ |
| Gérer utilisateurs | ❌ | ✅ |

## 💾 Persistance des données

- **Desktop** : `parking_data.json`
- **Web** : Même fichier partagé
- **Calculatrice** : `localStorage` du navigateur

## 🛠️ Technologies utilisées

- **Backend** : Python 3
- **Desktop** : Tkinter
- **Web** : Flask, HTML5, CSS3, JavaScript (ES6+)
- **API** : RESTful avec JSON
- **Persistance** : JSON files

## 🎨 Fonctionnalités avancées

### Interface Web
- Animations CSS fluides
- Design responsive
- Modals pour les interactions
- Messages de feedback
- Actualisation automatique

### Calculatrice
- Validation des entrées
- Gestion des erreurs
- Historique persistant
- Interface intuitive

### Sécurité
- Validation des données
- Gestion des erreurs
- Permissions par rôle
- Sanitisation des entrées

## 🚀 Déploiement

### Serveur de production
```bash
# Variables d'environnement
export FLASK_ENV=production
export FLASK_DEBUG=0

# Lancer le serveur
python app_web.py
```

## 🆕 Nouvelle section : SPA Vue.js + Backend Express
### Backend
1. Aller dans `backend`:
   ```bash
   cd backend
   npm install
   npm run start
   ```
2. API de test:
   - `GET /api/hello`
   - `POST /api/echo`

### Frontend
1. Aller dans `frontend`:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Ouvrir `http://localhost:5173`
3. Appelle `/api/hello` via proxy sur `http://localhost:5173/api/hello`

### Production (build Vue + servir depuis Express)
1. Depuis `frontend`:
   ```bash
   npm run build
   ```
2. Depuis `backend`:
   ```bash
   npm run start
   ```
3. Ouvrir `http://localhost:3000`


### Avec Gunicorn (recommandé)
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app_web:app
```

## 📝 Scripts disponibles

```bash
npm run start      # Lancer projet.js
npm run calculator # Serveur HTTP simple
npm run web        # Lancer l'app web Flask
```

## 🔧 Développement

### Ajouter une nouvelle fonction mathématique
1. Implémenter dans `function.js`
2. Exporter dans le module
3. Ajouter l'endpoint dans `app_web.py`
4. Mettre à jour l'interface HTML

### Personnaliser l'interface
- Modifier les fichiers HTML pour le design
- Ajuster le CSS pour les couleurs/thèmes
- Étendre les fonctionnalités JavaScript

---

**🎉 Prêt à gérer votre parking !**