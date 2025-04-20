FROM python:3.9-slim

USER root 
RUN mkdir /app
COPY . /app/
WORKDIR /app/
RUN pip install -r requirements.txt



# COPY ./requirements.txt /app/


RUN apt-get update && apt-get install -y curl



CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]
