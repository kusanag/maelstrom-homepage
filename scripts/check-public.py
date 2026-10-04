#!/usr/bin/env python3
"""Check staged and working-tree files for accidental local deployments and common secret forms.

This guard does not replace a secret scanner, manual review or history inspection.
It prints only file paths and rule names, never matching secret values.
"""
from pathlib import Path
import re
import struct
import subprocess
import sys

root = Path(__file__).resolve().parents[1]
paths = subprocess.check_output(['git', 'ls-files', '-z'], cwd=root).decode().split('\0')
issues = []
rules = {
    'private key': re.compile(rb'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----'),
    'GitHub token': re.compile(rb'\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b'),
    'AWS access ID': re.compile(rb'\b(?:AKIA|ASIA)[A-Z0-9]{16}\b'),
    'private IPv4 endpoint': re.compile(rb'(?<![\d.])(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})(?![\d.])'),
    'credential in URL': re.compile(rb'https?://[^\s/@]+:[^\s/@]+@'),
    'local home path': re.compile(rb'/(?:home|Users)/[^\s/]+/'),
    'configured UI verifier': re.compile(rb'var HASH = "[a-f0-9]{64}";'),
}
for name in filter(None, paths):
    p = root / name
    if name.startswith(('config/', 'backups/', 'secrets/', 'test-results/')) or (p.name.startswith('.env') and p.name != '.env.example'):
        issues.append((name, 'local deployment file tracked'))
    if p.is_symlink():
        issues.append((name, 'symlink requires manual review'))
        continue
    if not p.is_file():
        issues.append((name, 'tracked file missing'))
        continue
    staged = subprocess.check_output(['git', 'show', ':' + name], cwd=root)
    working = p.read_bytes()
    versions = [('index', staged)]
    if working != staged:
        versions.append(('working tree', working))
    for version, data in versions:
        for label, pattern in rules.items():
            if pattern.search(data):
                issues.append((name, f'{label} ({version})'))
        if p.suffix == '.png':
            pos = 8
            while pos + 12 <= len(data):
                size = struct.unpack('>I', data[pos:pos+4])[0]
                tag = data[pos+4:pos+8]
                if tag not in {b'IHDR', b'PLTE', b'IDAT', b'IEND', b'tRNS', b'sRGB', b'gAMA', b'cHRM', b'pHYs'}:
                    issues.append((name, f'image metadata requires review ({version})'))
                pos += size + 12
if not any(paths):
    sys.exit('No tracked files to audit. Stage the intended public files first.')
for name, label in issues:
    print(f'FAIL {name}: {label}')
print(f'Checked {len(list(filter(None, paths)))} tracked files; {len(issues)} findings.')
sys.exit(bool(issues))
