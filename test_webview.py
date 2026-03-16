import webview
print("Testeando pywebview...")
try:
    window = webview.create_window('Test Window', 'https://google.com')
    print("Ventana creada. Iniciando...")
    webview.start()
    print("Ventana cerrada.")
except Exception as e:
    print(f"Error: {e}")
