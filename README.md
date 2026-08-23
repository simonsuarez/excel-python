# ExcelPython

Proyecto FastAPI para carga y gestión de usuarios desde archivos Excel, con validaciones de edad, email y duplicados.

---

## Badges

- CI: ![CI](https://github.com/simonsuarez/ExcelPython/actions/workflows/test_and_build.yml/badge.svg)

---

## Tabla de Contenidos

- [Instalación](#instalación)
- [Uso](#uso)
- [Tests](#tests)
- [CI/CD](#cicd)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Contribución](#contribución)
- [Licencia](#licencia)

---

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/simonsuarez/ExcelPython.git
cd ExcelPython

# Crear entorno virtual (opcional)
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Instalar dependencias de producción
pip install -r requirements.txt

# Instalar dependencias de desarrollo (tests, linters)
pip install -r requirements-dev.txt

```

## Levantar la aplicación

La primera vez, crea la configuración local a partir del ejemplo:

```bash
cp config.env.example config.env
```

```bash
# Con Docker Compose: PostgreSQL, FastAPI y React/Vite

docker compose up --build

# Sin Docker

uvicorn main:app --reload
```

Una vez que los contenedores estén listos:

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Swagger: http://localhost:8000/docs

El frontend utiliza el proxy de Vite para enviar `/api` al contenedor del
backend. Por eso no necesita CORS durante el desarrollo con Docker.

Para detener el entorno:

```bash
docker compose down
```

Los datos de PostgreSQL y las dependencias de Node se conservan en volúmenes
de Docker.

El servicio temporal `migrate` ejecuta las migraciones de Alembic antes de
iniciar FastAPI. Así, una base local nueva queda preparada automáticamente.

## Frontend

El frontend está en `frontend/` y utiliza:

- React
- Vite
- TypeScript y TSX
- HTML5 semántico
- CSS propio responsive

Comandos útiles dentro del contenedor:

```bash
docker compose exec frontend npm test
docker compose exec frontend npm run build
```

## Endpoints principales:

- **/health** Verifica que la API está activa.
- **/users/select_db** Test de conexión a la base de datos.
- **/users/cargar_excel** Carga usuarios desde un archivo Excel.

## Ejecutar los test

```bash
# Tests unitarios

pytest -m unit

# Tests de integración

pytest -m integration

# Coverage

pytest --cov=main --cov-report=term-missing
```

## CI/CD

La integración continua se ejecuta en cada Pull Request hacia `main`, en cada
push a `main` y también puede iniciarse manualmente.

- **Backend:** pruebas unitarias, Ruff, Bandit, Pip-Audit y construcción de la
  imagen Docker.
- **Frontend:** instalación reproducible con `npm ci`, pruebas con Vitest,
  compilación TypeScript/Vite y construcción de la imagen Docker de producción.
- La imagen del backend se publica en GHCR únicamente después de un push a
  `main`; los Pull Requests solamente construyen y validan las imágenes.

Archivo del workflow: .github/workflows/test_and_build.yml.

## Estructura del proyecto

```plaintext
.
├── app/
│ ├── main.py
│ ├── models/
│ ├── controllers/
│ ├── services/
│ └── db/
├── tests/
│ ├── unit/
│ └── integration/
├── requirements.txt
├── requirements-dev.txt
├── Dockerfile
├── docker-compose.yml
└── README.md
```
