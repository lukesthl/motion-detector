#!/bin/bash
trap "exit" INT TERM ERR
trap "kill 0" EXIT

(cd ./app && pnpm run tauri dev) &
(cd ./backend && bun run dev) &
wait