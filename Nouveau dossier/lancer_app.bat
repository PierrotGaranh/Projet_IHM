@echo off
echo ========================================
echo 🅿️ Application de Gestion du Parking
echo ========================================
echo.

echo 🔍 Vérification de Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python n'est pas installé ou n'est pas dans le PATH
    echo 💡 Téléchargez Python depuis https://python.org
    pause
    exit /b 1
)

echo ✅ Python trouvé
echo.

echo 🚀 Lancement de l'application...
python app_desktop.py

if errorlevel 1 (
    echo.
    echo ❌ Erreur lors du lancement de l'application
    echo.
    echo 💡 Solutions possibles:
    echo    1. Assurez-vous que Tkinter est installé
    echo    2. Vérifiez les permissions du dossier
    echo    3. Essayez de lancer en tant qu'administrateur
    echo    4. Utilisez 'python launch_app.py' à la place
    echo.
    pause
) else (
    echo.
    echo ✅ Application fermée normalement
    pause
)