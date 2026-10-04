# Contributing

Keep changes generic: never contribute a personalized service list, credentials, internal endpoints, device identifiers, logs or screenshots of a real deployment. Use the included fictional examples.

1. Fork or clone the repository and run the README quickstart.
2. Develop shared CSS/JS in `theme/`. Use `python3 scripts/setup.py --update-theme` to copy changes into your ignored local config; this replaces local theme edits but preserves the local key and service YAML.
3. Run setup tests, the publication guard and the browser suites:

   ```sh
   python3 -m unittest discover -s tests -p 'test_*.py'
   node --check theme/custom.js
   python3 scripts/check-public.py
   npm ci
   npx playwright install chromium
   npm run test:browser
   ```

4. Run a full-history secret scanner before publishing a fork. The lightweight guard is an additional check, not a guarantee against every secret format.
5. In a pull request, describe the visible behavior and the checks you ran. Keep real infrastructure details out of the description and attachments.

For browser tests, `HOMEPAGE_URL` defaults to `http://localhost:3000`; `ARTIFACT_DIR` defaults to ignored `test-results/`. Tests use fictional data and browser-only password substitution. The interference suite shortens long idle waits only inside its browser while recording and validating the real requested delays.

Motion changes must retain reduced-motion support, the FX toggle, modal/input suppression and cheap rendering between bursts. Avoid full-page SVG filters and avoid copying live page/form contents into effects. Typography changes should preserve readable service names and keyboard focus indicators.

Do not submit third-party artwork without permission and attribution. Keep code and artwork licensing distinct.
