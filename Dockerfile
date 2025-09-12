FROM denoland/deno:2.5.0

# The port that your application listens to.
EXPOSE 4444
WORKDIR /app

COPY . .
RUN deno cache main.ts
RUN deno task build

CMD ["deno", "run", "-A", "main.ts"]
