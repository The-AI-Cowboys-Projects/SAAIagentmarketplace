# ==========================================================================
# Stage 1: Builder — install Python dependencies in a clean layer
# ==========================================================================
FROM python:3.11-slim AS builder

WORKDIR /build

# System deps required for building native extensions (bcrypt, psycopg2)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ==========================================================================
# Stage 2: Runtime — minimal production image
# ==========================================================================
FROM python:3.11-slim AS runtime

# Runtime-only libraries (libpq for psycopg2, curl for healthcheck)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser -d /app -s /sbin/nologin appuser

WORKDIR /app

# Copy installed Python packages from builder stage
COPY --from=builder /install /usr/local

# Copy application code
COPY . .

# Set ownership
RUN chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

# Health check — matches /health endpoint in app/main.py
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Uvicorn production config:
#   --host 0.0.0.0     bind all interfaces (required in containers)
#   --workers 2         appropriate for 0.5 vCPU Fargate task
#   --limit-concurrency prevent overload
#   --access-log        enable for CloudWatch
CMD ["uvicorn", "app.main:app", \
     "--host", "0.0.0.0", \
     "--port", "8000", \
     "--workers", "2", \
     "--limit-concurrency", "100", \
     "--access-log"]
