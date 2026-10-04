# Customize your deck

Make deployment-specific edits under **`config/`**, which setup creates and Git ignores. Keep `theme/` and `examples/` free of real endpoints or credentials if you plan to share a fork.

## Files you will edit

| File | Purpose |
| --- | --- |
| `config/services.yaml` | Service cards, links, optional API widgets |
| `config/settings.yaml` | Group-to-tab mapping, background, page title, general layout |
| `config/widgets.yaml` | Greeting, search, date/time and optional header widgets |
| `config/bookmarks.yaml` | Footer links |
| `config/custom.css` | Colors, spacing, typography, responsive layout |
| `config/custom.js` | Boot, effects, group mapping and local private-tab verifier |
| `.env` | Container settings and your widget credentials |

After YAML changes, use Homepage's refresh control. After changing existing CSS/JS, reload the browser. Restart the container when adding new image filenames because Homepage's static-file index is created at startup.

## Groups and tabs

The starter has five main GRID groups, a full-width BACKGROUND TASKS strip, a VITALS dashboard and PRIVATE TOOLS on the hidden PRIVATE tab. Demo health cards are plain links, not working measurements.

Keep the tab names `GRID`, `VITALS` and `PRIVATE` unless you also update the corresponding CSS selectors and JavaScript tab references. Change service names freely. A renamed group must match in **both** `services.yaml` and `settings.yaml`.

The `GROUPS` object near the top of `custom.js` assigns visual roles and tiny panel codes. When renaming a specially styled group, update that map too. Unknown groups get the standard card style. Roles such as `ghost` (full-width inventory strip) and `health` (summary row) select special layouts.

```yaml
# config/settings.yaml, under layout:
WORKSPACE:
  tab: GRID
  style: column
  icon: mdi-notebook-#ff293d
```

```yaml
# config/services.yaml:
- WORKSPACE:
    - My Service:
        icon: mdi-application-#ff293d
        href: https://example.com/my-service
        description: Your description
```

Use the matching structure from [Homepage's settings guide](https://gethomepage.dev/configs/settings/) and [service documentation](https://gethomepage.dev/configs/services/).

## Service widgets and credentials

The starter deliberately has no API widgets, polling URLs, host discovery or mounted Docker socket. Add only the integrations you need.

For a widget that requires an API key, put its value in `.env` using a `HOMEPAGE_VAR_` prefix, then reference it in the widget YAML. The Compose file passes that environment file into Homepage. Follow the schema for your chosen widget; the snippet below only illustrates secret substitution:

```yaml
# Inside a widget that supports a key field:
key: "{{HOMEPAGE_VAR_MY_SERVICE_KEY}}"
```

Add the corresponding `HOMEPAGE_VAR_MY_SERVICE_KEY` entry locally in `.env`, and run `docker compose up -d --force-recreate homepage` after changing environment variables. Never place a real key in examples, screenshots, issue reports or a commit. [Official environment substitution documentation](https://gethomepage.dev/installation/docker/#using-environment-secrets).

The theme highlights changing native widget values briefly. Cards containing the red-circle status marker receive alert styling; the theme does not infer backend health independently. It does not contact services itself.

## Identity, colors and fonts

- Change the greeting in `config/widgets.yaml` and browser title in `config/settings.yaml`.
- Change `GRID-07 // NETRUNNER` in the greeting's CSS `::after` rule for a local callsign.
- Core colors are near the top of `custom.css`: `--ms-red`, `--ms-bright`, `--ms-text`, `--ms-muted` and `--ms-ink`. Some translucent rails and plates use literal colors; search the existing hex value when replacing the full palette.
- Rajdhani is used for readable service names, Share Tech Mono for data, Orbitron for small technical markings. The CSS imports them from Google Fonts. To avoid external font requests, self-host properly licensed copies and replace the import with `@font-face` declarations, or use system fonts.

The greeting is no longer overwritten by JavaScript, and the search widget uses whichever provider you configure in YAML.

## Background and emblem

The starter includes the same dark artwork used in the preview. Set `background.image` in `settings.yaml` to a same-origin file under `/images/`. Preserve the background element so the effect can sample its pixels. Remote wallpapers can display, but the effect intentionally does not sample their pixels.

The header and password dialog reference `/images/maelstrom-icon.png` in `custom.js`, with a red SVG filter. Replace that file or change both references for your own emblem. The boot's `NW_ASCII` constant holds the Samurai ASCII sigil; replace it with your own monospace text artwork if desired. See artwork notices before redistributing assets.

## Motion

In `custom.js`, `LINES`, `GLITCH_AT`, `SUB_AT` and `DISMISS_AT` control the intro timeline. `quietDelay()` controls the random interference gaps; `burstDuration` and the eased envelope control each burst. Keep distortion scoped to the greeting and a small number of cards: filtering the entire page is expensive on ultrawide screens.

Session keys:

| Key | Meaning |
| --- | --- |
| `ms_boot_samurai_v2` | Intro already shown in this tab session |
| `ms_blackwall_off` | FX toggle switched off |
| `nw_vault_open` | PRIVATE convenience lock opened |

No plaintext password is stored. Reduced motion skips the intro and disables interference. Typing, modal dialogs and background tabs suppress effects. Returning to a tab preserves the scheduled deadline, or chooses a fresh long wait if it has expired.

## Existing Homepage installation

Back up your configuration. Copy the shared CSS/JS and images into the paths used by your Homepage installation; use the example YAML to adapt your existing groups and tabs. This theme is an overlay on native Homepage, not a separate server. Ensure your image directory is mounted at `/app/public/images`, and restart after adding filenames. The optional setup scripts target this repository's own ignored `config/` directory; configure the key there before copying the resulting `custom.js`, or adapt the path locally.
