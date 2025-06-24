FROM python:3.11

WORKDIR /app

# Kopiraj requirements i instaliraj
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# Kopiraj sve datoteke (app.py, model.py, frontend/)
COPY . .

# Otvori port 5000
EXPOSE 5000

# Pokreni aplikaciju
CMD ["python", "app.py"]
