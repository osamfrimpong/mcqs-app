FROM php:8.2-cli

# Install system dependencies
RUN apt-get update -y && \
    apt-get install -y \
    libmcrypt-dev \
    git \
    openssl \
    zip \
    unzip \
    nodejs \
    npm

# Install PHP dependencies
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN docker-php-ext-install pdo

WORKDIR /app
COPY . /app

# Install PHP and Node.js dependencies
RUN composer install && \
    npm install && \
    touch .env && \
    echo "APP_KEY=$APP_KEY" >> .env && \
    php artisan key:generate && \
    php artisan migrate --force && \
    php artisan cache:clear && \
    php artisan config:clear && \
    npm run build

CMD [ "php", "artisan", "serve", "--host=0.0.0.0", "--port=80" ]

EXPOSE 80