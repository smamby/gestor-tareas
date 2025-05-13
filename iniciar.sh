#!/bin/bash

# Variables para mayor claridad y mantenimiento
REPO_URL="https://github.com/smamby/gestor-tareas.git" # URL del repositorio
IMAGE_NAME="gestor-image"
CONTAINER_NAME="gestor"
PORT_MAPPING="3000:3000"
ENV_FILE=".env"
URL_TO_OPEN="http://localhost:3000"
BROWSER="chrome"  # Puedes cambiarlo a "firefox", "safari", etc.

# Función para imprimir mensajes de error y salir
error_exit() {
  echo "Error: $1" >&2  # Imprimir en el flujo de error estándar
  exit 1
}

# Clonar el repositorio
echo "Clonando el repositorio: $REPO_URL"
git clone "$REPO_URL" || error_exit "La clonación del repositorio falló."
cd gestor-tareas # Navegar al directorio del repositorio clonado

# Detener y eliminar el contenedor existente si existe
docker stop "$CONTAINER_NAME" &>/dev/null  # Silenciar la salida si no existe
docker rm "$CONTAINER_NAME" &>/dev/null    # Silenciar la salida si no existe

# Construir la imagen Docker
echo "Construyendo la imagen Docker: $IMAGE_NAME"
docker build -t "$IMAGE_NAME" . || error_exit "La construcción de la imagen Docker falló."

# Ejecutar el contenedor
echo "Ejecutando el contenedor: $CONTAINER_NAME"
docker run --name "$CONTAINER_NAME" -d -p "$PORT_MAPPING" --env-file "$ENV_FILE" "$IMAGE_NAME" || error_exit "El inicio del contenedor falló."

# Esperar a que la aplicación esté lista (usando curl)
echo "Esperando a que la aplicación esté lista en $URL_TO_OPEN"
TIMEOUT=60  # Tiempo máximo de espera en segundos
for i in $(seq 1 $TIMEOUT); do
  curl -s --fail "$URL_TO_OPEN" > /dev/null 2>&1
  if [ $? -eq 0 ]; then
    echo "La aplicación está lista."
    break
  fi
  echo "Esperando... ($i/$TIMEOUT)"
  sleep 1
done

if [ $i -eq $TIMEOUT ]; then
  error_exit "Tiempo de espera agotado. La aplicación no se inició en $TIMEOUT segundos."
fi

# Abrir el navegador (multiplataforma)
echo "Abriendo el navegador en: $URL_TO_OPEN"
case "$OSTYPE" in
  "darwin"*)  # macOS
    open "$URL_TO_OPEN" ;;
  "linux-gnu"*)  # Linux
    if command -v "$BROWSER" >/dev/null 2>&1; then
      "$BROWSER" "$URL_TO_OPEN"
    else
      echo "Advertencia: $BROWSER no encontrado. Intenta abrir el URL manualmente: $URL_TO_OPEN"
    fi
    ;;
  "cygwin"|"msys"|"win32"*)  # Windows
    if command -v "start" >/dev/null 2>&1; then
      start "$URL_TO_OPEN"
    else
      echo "Advertencia: 'start' no encontrado. Intenta abrir el URL manualmente: $URL_TO_OPEN"
    fi
    ;;
  *)
    echo "Sistema operativo no reconocido. Intenta abrir el URL manualmente: $URL_TO_OPEN"
    ;;
esac

echo "Script completado."
exit 0