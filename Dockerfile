FROM denoland/deno:2.5.0

EXPOSE 4444
WORKDIR /app

COPY . .
RUN deno cache main.ts

CMD ["deno", "run", "-A", "main.ts"]
