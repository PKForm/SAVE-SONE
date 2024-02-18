#!/bin/bash

# Activate virtual environment (if applicable)
# source /path/to/venv/bin/activate

# Collect static files
python3 manage.py collectstatic --noinput

# Apply database migrations
python3 manage.py migrate

# Restart web server (if necessary)
# sudo systemctl restart gunicorn

# Start Django server
# python manage.py runserver 0.0.0.0:8000