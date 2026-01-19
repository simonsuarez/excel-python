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

```bash
# Con Docker Compose

docker-compose up --build

# Sin Docker

uvicorn main:app --reload
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

Integración continua con GitHub Actions:

- **Ejecuta tests unitarios** en cada push a main.
- **Linter con Ruff** y análisis de seguridad con Bandit y Pip-Audit.
- **Coverage report** opcional.

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
