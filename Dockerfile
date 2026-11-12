# Dockerfile multi-stage / all-in-one untuk menjalankan Laravel + Python ytmusicapi di Render
FROM php:8.2-cli

# Install dependencies sistem, Python 3, pip, dan git
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    git \
    unzip \
    libzip-dev \
    && docker-php-ext-install zip pcntl \
    && rm -rf /var/lib/apt/lists/*

# Install composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Setup working directory
WORKDIR /app

# Copy seluruh source code backend
COPY backend /app

# Buat virtualenv Python dan pasang ytmusicapi
RUN python3 -m venv /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir ytmusicapi

# Set path environment agar python dan composer bisa diakses langsung
ENV PATH="/opt/venv/bin:$PATH"
ENV YTMUSIC_PYTHON="/opt/venv/bin/python"

# Install composer dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permission storage Laravel
RUN chmod -R 777 /app/storage /app/bootstrap/cache

# Expose port yang ditentukan oleh Render (PORT default 10000 atau 80)
ENV PORT=10000
EXPOSE 10000

# Jalankan artisan serve
CMD php artisan serve --host=0.0.0.0 --port=${PORT}
