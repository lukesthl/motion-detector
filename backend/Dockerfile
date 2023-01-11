FROM jarredsumner/bun:0.4.0
WORKDIR /app
COPY package.json package.json
COPY bun.lockb bun.lockb
RUN bun -v
RUN bun install
COPY . .
EXPOSE 4001
ENTRYPOINT ["bun", "run", "prod"]