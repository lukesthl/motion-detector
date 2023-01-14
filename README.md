<a href="https://github.com/lukesthl/motion-detector">
  <img alt="Motion Detector" src="https://user-images.githubusercontent.com/44963006/212477797-60f2af55-8942-4747-88c7-50e646d2caff.png">
  <h1 align="center">Motion Detector</h1>
</a>

<p align="center">
An Application that utilizes a sensor on a Raspberry Pi to detect motion and collect the data. It provides an App UI to configure actions, which will be then triggered by the sensor.
</p>
<p align="center">
  <a href="#about-the-project"><strong>About The Project</strong></a> ·
  <a href="#requirements"><strong>Requirements</strong></a> ·
  <a href="#server-installation"><strong>Server Installation</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#author"><strong>Author</strong></a>
</p>
<br/>

## About The Project

https://user-images.githubusercontent.com/44963006/212476461-877e338d-739c-4798-a310-51b64a1e9e24.mp4

## Requirements

- [Motion Detector App](https://github.com/lukesthl/motion-detector/releases) installed (MacOS, Windows, Ubuntu)
- Raspberry Pi
  - 64-bit OS
  - [Bun](https://github.com/oven-sh/bun#install) installed
  - Python 3 and [GPIO zero](https://gpiozero.readthedocs.io/en/stable/installing.html) installed
  - Server (RPi) must only be reached in local network
  - Raspberry Pi with Infrared Sensor connected on GPIO Pin

## Server Installation

### Raspberry Pi

1. Clone the repository onto your Raspberry Pi:

```bash
git clone https://github.com/lukesthl/motion-detector.git

cd backend; bun i
```

2. Setup the Environment:

```bash
cp .env.example .env
```

Edit <b>SERVER_ORIGIN</b> to your preffered name and change the <b>GPIO_PIN</b> to your connected sensor pin.

2. Start Server:

```bash
bun run prod
```

## Tech Stack

### Frontend (App)

- [Tauri](https://tauri.app/) – Tauri is a framework for building tiny, blazingly fast binaries for all major desktop platforms
- [SvelteKit](https://kit.svelte.dev/) – SvelteKit is built on Svelte, a UI framework for making interactive webpages
- [TailwindCSS](https://tailwindcss.com/) - Tailwind CSS is basically a utility-first CSS framework for rapidly building custom user interfaces

### Backend (Raspberry Pi Server)

- [Bun](https://bun.sh/) – Bun is a fast all-in-one JavaScript runtime like nodejs or deno
- [SQLite](https://www.sqlite.org/) – SQL database engine (only one currently supported by bun)

## Ideas

- [ ] Dashboard
- [ ] Add more Actions (E-Mail, Phillips Hue, Sound)
- [ ] Mobile App Support (https://tauri.app/blog/2022/12/09/tauri-mobile-alpha/)

## Known Limitations

- MacOS Notifications not popping up (only shown in notification panel): https://github.com/tauri-apps/tauri/issues/5488
- Bun Docker build with aarch64: https://github.com/oven-sh/bun/issues/1219

## Author

- Luke Stahl ([@lukesthl](https://github.com/lukesthl))
