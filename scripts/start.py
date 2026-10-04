#!/usr/bin/env python3
"""Start the local demo and refresh Homepage's initially cached settings."""
from pathlib import Path
import subprocess
import sys

root = Path(__file__).resolve().parents[1]
if not (root / 'config/settings.yaml').exists() or not (root / '.env').exists():
    sys.exit('Run python3 scripts/setup.py first.')
subprocess.run(['docker', 'compose', 'up', '-d', '--wait', '--wait-timeout', '120'], cwd=root, check=True)
# Run inside the container so customized host port mappings need no parsing.
refresh = "fetch('http://127.0.0.1:3000/api/revalidate',{method:'POST'}).then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
result = subprocess.run(['docker', 'compose', 'exec', '-T', 'homepage', 'node', '-e', refresh], cwd=root)
if result.returncode:
    sys.exit('Container started. Automatic refresh failed; use Homepage\'s refresh control after signing in if authentication is enabled.')
print('Homepage started and settings refreshed. Open your configured local port (default http://localhost:3000).')
