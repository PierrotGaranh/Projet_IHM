#!/usr/bin/env python3
"""
Lanceur alternatif pour l'application de parking
Utilise des paramètres optimisés pour éviter les problèmes d'affichage
"""

import os
import sys
import subprocess

def launch_app():
    """Lancer l'application avec des paramètres optimisés"""
    print("🚀 Lancement de l'application de parking...")

    # Variables d'environnement pour Tkinter
    env = os.environ.copy()
    env['TK_SILENCE_DEPRECATION'] = '1'

    # Commande pour lancer l'application
    cmd = [sys.executable, 'app_desktop.py']

    try:
        # Lancer l'application
        process = subprocess.Popen(
            cmd,
            env=env,
            cwd=os.getcwd(),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

        print("✅ Application lancée!")
        print("📝 Si la fenêtre ne s'affiche pas:")
        print("   1. Vérifiez la barre des tâches")
        print("   2. Utilisez Alt+Tab pour basculer")
        print("   3. Redémarrez votre ordinateur si nécessaire")
        print("\n⏹️ Appuyez sur Ctrl+C pour arrêter le processus...")

        # Attendre que l'utilisateur arrête
        try:
            process.wait()
        except KeyboardInterrupt:
            print("\n🛑 Arrêt de l'application...")
            process.terminate()
            process.wait()

    except Exception as e:
        print(f"❌ Erreur lors du lancement: {e}")
        return False

    return True

def check_requirements():
    """Vérifier les prérequis"""
    print("🔍 Vérification des prérequis...")

    requirements = [
        ('tkinter', 'Interface graphique'),
        ('json', 'Gestion des données'),
        ('os', 'Système de fichiers'),
        ('parking_system', 'Backend parking'),
        ('app_desktop', 'Interface desktop')
    ]

    all_ok = True
    for module, description in requirements:
        try:
            if module in ['parking_system', 'app_desktop']:
                __import__(module)
            else:
                __import__(module)
            print(f"✅ {description}: OK")
        except ImportError as e:
            print(f"❌ {description}: Manquant - {e}")
            all_ok = False

    return all_ok

def main():
    """Fonction principale"""
    print("🅿️ Lanceur d'application de parking")
    print("=" * 40)

    if not check_requirements():
        print("\n❌ Prérequis manquants. Veuillez installer les dépendances nécessaires.")
        return

    print("\n" + "=" * 40)
    launch_app()

if __name__ == '__main__':
    main()