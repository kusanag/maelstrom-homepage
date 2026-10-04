# Troubleshooting

| Symptom | Check |
| --- | --- |
| Docker cannot start because a port is in use | Change `HOMEPAGE_PORT` and allowed-host port values in `.env`, then recreate the container. |
| Host validation error | `HOMEPAGE_ALLOWED_HOSTS` must match the hostname and port in your browser. Avoid a wildcard. |
| Cannot connect from another device | The demo binds to loopback deliberately. Configure real authentication and HTTPS before exposing it beyond localhost. |
| All groups appear together without tabs on first start | Run `python3 scripts/start.py`, or use Homepage’s refresh control to regenerate cached settings. |
| New services do not appear | Check YAML indentation and matching group names, then use Homepage's refresh control. |
| Theme or private key changes do not appear | Reload the page. Close old tabs to clear their prior unlocked session. |
| New image is missing | Confirm both volume mounts and restart the container to refresh the static-file index. |
| No glitches immediately after opening | The first burst also waits a random 30–150 seconds. Check FX, reduced motion, tab visibility and whether an input/dialog has focus. |
| PRIVATE key cannot be checked | Browser crypto requires HTTPS or localhost; plain HTTP on another host is not a secure context. |
| PRIVATE never unlocks | Run `python3 scripts/set-password.py`; there is intentionally no default key. |
| Shortcut does nothing | The browser or desktop may intercept Ctrl+Shift+L. Change that binding, or edit the JavaScript shortcut. |
| Boot no longer replays | It runs once per tab session. Open a fresh tab or remove `ms_boot_samurai_v2` in session storage. |
| Brief dark loading screen | CSS covers the hydration gap before the intro. It releases automatically after six seconds if the script fails; very late scripts skip the intro. |
| Text looks different offline | Google Fonts may be blocked. Self-host the fonts or use system fonts. |
| Widget reports unavailable | Check the widget's official schema and your local API credentials. Demo cards have no live integrations. |
| Scrolling on a smaller screen | The grid adapts to screen width; fitting every launcher depends on your card count and widget heights. |
| File permission errors | Ensure the Docker process can write its config mount. Avoid broadly making secret files world-readable. |

Useful local commands:

```sh
docker compose ps
docker compose logs --tail=80 homepage
docker compose restart homepage
```

Logs and rendered Compose configuration may contain sensitive deployment information. Review and redact them before sharing.

## Compatibility

Tested with Homepage v2.4.0 and Chromium. The theme uses native `<dialog>`, CSS `:has()`, canvas, SVG filters and `crypto.subtle`; use a modern browser. Other browsers may render the glitch filter differently. Homepage markup can change between releases, so test upgrades before changing the pinned image.
