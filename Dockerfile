# Utiliser l'image de base PHP avec Apache
FROM php:8.0-apache

# Installer les extensions PHP nécessaires
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Activer le mod_rewrite pour Apache
RUN a2enmod rewrite

# Copier les fichiers de configuration Apache personnalisée dans le conteneur
COPY my-apache-config.conf /etc/apache2/sites-available/my-apache-config.conf
RUN a2ensite my-apache-config && a2dissite 000-default

# Copier les fichiers de l'application dans le conteneur
# Assurez-vous que les chemins correspondent à votre structure de fichiers locaux
COPY src/ /var/www/html/

# Donner les permissions appropriées
RUN chown -R www-data:www-data /var/www/html

# Exposer le port 80
EXPOSE 80
