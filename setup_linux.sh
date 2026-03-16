#!/bin/bash
echo "Instalando dependencias para Debian/Ubuntu..."
sudo apt-get update
sudo apt-get install -y python3-pip python3-venv libwebkit2gtk-4.0-37

echo "Creando entorno virtual..."
python3 -m venv venv
source venv/bin/activate

echo "Instalando dependencias de Python..."
pip install -r requirements.txt

echo "Para ejecutar la aplicación: python3 main.py"
echo "Para generar el ejecutable en Linux: python3 build_exe.py"
