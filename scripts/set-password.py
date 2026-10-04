#!/usr/bin/env python3
"""Set the optional local UI key without printing it or putting it in shell history."""
import argparse
import getpass
from pathlib import Path
import sys
from deck import set_key

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--disable', action='store_true', help='Clear the local key; private-tab unlock becomes unavailable.')
args = parser.parse_args()
script = Path(__file__).resolve().parents[1] / 'config/custom.js'
if not script.exists():
    sys.exit('Run python3 scripts/setup.py first.')
try:
    if args.disable:
        set_key(script, None)
    else:
        if not sys.stdin.isatty():
            sys.exit('Use an interactive terminal so the key can be entered without echo.')
        key = getpass.getpass('New local access key: ')
        if key != getpass.getpass('Confirm access key: '):
            sys.exit('Keys did not match. Nothing changed.')
        set_key(script, key)
except (ValueError, EOFError, KeyboardInterrupt) as exc:
    sys.exit(str(exc) or 'Cancelled. Nothing changed.')
print('Local key updated. Close existing dashboard tabs and open a fresh one.')
print('This is a UI convenience lock, not authentication. See docs/SECURITY.md.')
