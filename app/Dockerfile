FROM python:3.12-slim-bookworm

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    libpq5 \      
    curl \      
    && rm -rf /var/lib/apt/lists/*

# instalar dependencias si existe requirements.txt
COPY requirements.txt .
RUN if [ -f requirements.txt ]; then pip install --no-cache-dir -r requirements.txt; fi

# copiar código
COPY . /app

EXPOSE 8000

# Ajusta "main:app" si tu app se expone desde otro módulo/objeto
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]