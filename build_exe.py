import PyInstaller.__main__
import os
import shutil

def build():
    print("Iniciando compilación a .exe...")
    
    # Parámetros de PyInstaller
    params = [
        'main.py',
        '--name=GeneradorPasswordPro',
        '--onefile',
        '--windowed',
        '--add-data=www;www',  # En Linux/Debian usa : en lugar de ; pero PyInstaller suele manejarlo
        '--clean',
    ]

    PyInstaller.__main__.run(params)
    
    print("Compilación finalizada.")
    if os.path.exists('dist/GeneradorPasswordPro.exe'):
        print(f"El ejecutable se encuentra en: {os.path.abspath('dist/GeneradorPasswordPro.exe')}")
    elif os.path.exists('dist/GeneradorPasswordPro'):
        print(f"El ejecutable (Linux) se encuentra en: {os.path.abspath('dist/GeneradorPasswordPro')}")

if __name__ == '__main__':
    build()
