FROM denoland/deno:2.4.5

# The port that your application listens to.
EXPOSE 4444
WORKDIR /app
USER deno

COPY . .
RUN deno cache main.ts
RUN deno task build

CMD ["deno", "run", "-A", "main.ts"]
