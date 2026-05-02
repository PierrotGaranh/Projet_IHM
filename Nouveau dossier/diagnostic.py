#!/usr/bin/env python3
"""
Script de diagnostic pour l'application de parking
Vérifie les problèmes courants et propose des solutions
"""

import os
import json
import sys
from parking_system import ParkingSystem

def check_files():
    """Vérifier l'état des fichiers de données"""
    print("🔍 Vérification des fichiers de données...")

    data_files = ['parking_data.json', 'parking_reservations.json']

    for file in data_files:
        if os.path.exists(file):
            try:
                with open(file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                print(f"✅ {file}: {len(data)} entrées")
            except Exception as e:
                print(f"❌ {file}: Erreur de lecture - {e}")
        else:
            print(f"⚠️ {file}: Fichier inexistant")

def check_permissions():
    """Vérifier les permissions d'écriture"""
    print("\n🔐 Vérification des permissions...")

    test_file = 'test_write.tmp'
    try:
        with open(test_file, 'w') as f:
            f.write('test')
        os.remove(test_file)
        print("✅ Permissions d'écriture: OK")
    except Exception as e:
        print(f"❌ Permissions d'écriture: {e}")

def check_dependencies():
    """Vérifier les dépendances"""
    print("\n📦 Vérification des dépendances...")

    dependencies = ['tkinter', 'json', 'os', 'datetime']
    for dep in dependencies:
        try:
            __import__(dep)
            print(f"✅ {dep}: OK")
        except ImportError:
            print(f"❌ {dep}: Manquant")

def test_parking_system():
    """Tester le système de parking"""
    print("\n🅿️ Test du système de parking...")

    try:
        system = ParkingSystem()
        print("✅ Système initialisé")

        # Test ajout de place
        success, msg = system.add_spot('TEST001')
        print(f"✅ Ajout de place: {msg}")

        # Test réservation
        success, msg = system.reserve_spot('TEST001', 'TestUser')
        print(f"✅ Réservation: {msg}")

        # Test statistiques
        stats = system.get_statistics()
        print(f"✅ Statistiques: {stats}")

        # Nettoyer
        system.delete_spot('TEST001')
        print("✅ Nettoyage terminé")

    except Exception as e:
        print(f"❌ Erreur système: {e}")
        import traceback
        traceback.print_exc()

def check_tkinter_display():
    """Vérifier l'affichage Tkinter"""
    print("\n🖥️ Test de l'interface Tkinter...")

    try:
        import tkinter as tk
        root = tk.Tk()
        root.title("Test Tkinter")
        root.geometry("200x100")

        label = tk.Label(root, text="Test réussi!")
        label.pack(pady=20)

        # Fermer automatiquement après 1 seconde
        root.after(1000, root.destroy)
        root.mainloop()

        print("✅ Tkinter: OK")
    except Exception as e:
        print(f"❌ Tkinter: {e}")

def main():
    """Fonction principale de diagnostic"""
    print("🚀 Diagnostic de l'application de parking")
    print("=" * 50)

    check_files()
    check_permissions()
    check_dependencies()
    test_parking_system()
    check_tkinter_display()

    print("\n" + "=" * 50)
    print("📋 Résumé du diagnostic terminé")
    print("\n💡 Solutions recommandées:")
    print("1. Assurez-vous que Python et Tkinter sont installés")
    print("2. Vérifiez les permissions d'écriture dans le dossier")
    print("3. Utilisez 'python app_desktop.py' pour lancer l'application")
    print("4. Si problème persiste, redémarrez votre ordinateur")

if __name__ == '__main__':
    main()