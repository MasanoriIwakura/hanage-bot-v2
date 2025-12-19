# hanage-bot-v2

[ekibana](https://www.ekibana.com/) 非公式のBot

## 主な機能

- 指定した年月のekibanaスケジュールを取得

## For Developer

## Requirements

- bun
- wrangler

## Getting Started

```sh
bun install
bun dev
```

```sh
wrangler login
bun run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
bun run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```
