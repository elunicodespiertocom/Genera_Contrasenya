import webview
import os
import sys

def get_html_path():
    # Para PyInstaller, la ruta cambia al empaquetar
    if getattr(sys, 'frozen', False):
        base_path = sys._MEIPASS
    else:
        base_path = os.path.dirname(os.path.abspath(__file__))
    
    return os.path.join(base_path, 'www', 'index.html')

class Api:
    def close_app(self):
        print("Cerrando aplicación...")
        window.destroy()

if __name__ == '__main__':
    print("Iniciando aplicación...")
    api = Api()
    
    # Obtener ruta absoluta al index.html
    if getattr(sys, 'frozen', False):
        base_path = sys._MEIPASS
    else:
        base_path = os.path.dirname(os.path.abspath(__file__))
        
    html_file = os.path.join(base_path, 'www', 'index.html')
    
    if not os.path.exists(html_file):
        print(f"ERROR: No se encontró index.html en {html_file}")
        sys.exit(1)

    print(f"Cargando desde: {html_file}")

    # Crear la ventana cargando el archivo directamente
    window = webview.create_window(
        'Generador de Contraseñas Pro',
        url=f'file:///{os.path.abspath(html_file).replace("\\", "/")}', 
        js_api=api,
        width=1280,
        height=900,
        min_size=(900, 700),
        background_color='#020617'
    )
    
    print("Abriendo ventana...")
    # Quitamos debug=True para evitar que se abra la consola de inspección o comportamientos de navegador
    webview.start()
