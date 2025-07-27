FROM python:3.12-slim

WORKDIR /backend

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

RUN rm -rf chroma_db
COPY . .

CMD ["gunicorn", "--workers", "4", "--bind", "0.0.0.0:5000", "app:app"]