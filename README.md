# EgoDex · System Check

Standalone single-page tool. Contributor visits the URL; the page auto-detects their network and system info and shows a copyable report. Sibling to `egodex-vercel` (V2) and `egodex-v3-vercel` (V3).

## What it reports

**Network**
- Public IP, ISP / org, city, region, country, timezone
- Connection type, reported downlink (Mbps), RTT
- Live download speed test (2 MB blob from the server)

**System**
- OS + version, browser + version
- CPU logical cores
- RAM (approximate, when exposed)
- GPU (vendor + renderer via WebGL)
- Screen resolution + device pixel ratio
- Language / timezone

## Stack

- Static `index.html` (vanilla JS, same design language as the dashboards)
- Two serverless functions:
  - `/api/ip` — reads request IP, queries `ipapi.co` (free tier, no key), returns ISP/location
  - `/api/speedblob` — returns a fixed-size random buffer for the client to time

No env vars required.

## Deploy

`git push` → Vercel auto-deploys. Live URL: `egodex-syscheck.vercel.app`.
