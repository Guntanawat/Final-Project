# ใช้ PostgreSQL เวอร์ชั่น 15 เป็น base image
FROM postgres:15

# กำหนด environment variables สำหรับ PostgreSQL
ENV POSTGRES_USER=myuser
ENV POSTGRES_PASSWORD=mypassword
ENV POSTGRES_DB=mydatabase

# คัดลอกไฟล์ SQL สำหรับการ initial database เข้าไปใน container
COPY ./init-db /docker-entrypoint-initdb.d/
COPY ./seed.sql /docker-entrypoint-initdb.d/seed.sql

# กำหนด port 5432 เพื่อให้สามารถเข้าถึง PostgreSQL ได้
EXPOSE 5432
