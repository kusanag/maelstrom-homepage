#!/usr/bin/env python3
"""Create ignored local config from safe examples; never overwrite service edits."""
import argparse
from pathlib import Path
from deck import prepare

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--update-theme', action='store_true', help='Replace local theme CSS, JS and supplied images, preserving the local key. Back up theme edits first.')
args = parser.parse_args()
prepare(Path(__file__).resolve().parents[1], update_theme=args.update_theme)
print('Local config and .env are ready. Service files and existing .env were preserved.')
print('Optional private-tab key: python3 scripts/set-password.py')
print('Start the dashboard: python3 scripts/start.py')
