# Security and privacy

## Two different locks

The optional **PRIVATE tab** hides a navigation tab with CSS and asks for a masked access key before showing it. The key is compared to a local SHA-256 verifier in browser JavaScript. This is a convenience feature, not a security boundary: someone who can open the dashboard can inspect its configuration, read the verifier, change session storage, or bypass the UI. Do not use your account password as this key, and do not rely on it to protect sensitive links or information.

**Real authentication** belongs in Homepage's built-in authentication and/or a trusted authenticated reverse proxy or VPN, plus each linked service's own access controls. See [Homepage security and authentication](https://gethomepage.dev/installation/#security-authentication).

The supplied Compose configuration disables Homepage authentication only for the local loopback demo. It also disables MCP and binds to `127.0.0.1` by default. Before changing the bind address, configure genuine authentication and HTTPS, and explicitly set allowed hosts. Allowed-host validation is not authentication. This repository does not deploy a public dashboard.

## Configure the optional PRIVATE tab

1. Run `python3 scripts/setup.py`.
2. Run `python3 scripts/set-password.py` in an interactive terminal.
3. Enter and confirm a separate local key. Input is hidden, and it is not passed as a command-line argument.
4. Open the dashboard using HTTPS or localhost, and press **Ctrl+Shift+L**.
5. Press the same shortcut to re-lock, or close the tab to end its session.

No working default key is supplied. Without a configured key, the neutral unlock dialog explains how to set one. `python3 scripts/set-password.py --disable` removes the local verifier and disables unlocking. Key changes do not revoke already-open client sessions: close existing tabs and open a fresh one. A duplicated tab can inherit browser session storage, so use a genuinely fresh tab when testing the intro or lock.

The script edits only `config/custom.js`, ignored by Git. Setup/theme updates preserve the local verifier. The form masks typing and clears the field on submission, cancellation and closing; an in-flight check cannot unlock after you cancel.

## Keeping a fork shareable

- Keep personal service definitions under ignored `config/` and secrets in ignored `.env` or another private secret store.
- `.gitignore` prevents ordinary accidental additions; it is not a security guarantee and cannot stop `git add -f` or remove prior commits.
- Before publishing changes, inspect `git diff --cached`, run `python3 scripts/check-public.py`, and scan the complete Git history with a secret scanner such as Gitleaks.
- Generate previews only with fictional example services. A screenshot can expose personal names, activity, titles, IP addresses or internal URLs even if the config is ignored.
- Never include backups, logs, diagnostic dumps, local access-key verifiers or environment files in a public issue.
- If a credential is exposed, revoke/rotate it. Deleting a file or commit is not enough.

## External requests

Google Fonts are loaded by the CSS unless you replace the import. Homepage may fetch icons and any configured service widgets. Search uses the provider you choose. The decorative JavaScript adds no analytics, telemetry or independent service API calls; interference samples only the same-origin background image, not screenshots of the page or form contents.

Please report vulnerabilities using GitHub's private vulnerability reporting if enabled. Avoid putting sensitive details into a public issue.
