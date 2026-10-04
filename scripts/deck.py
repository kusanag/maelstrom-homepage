"""Local installation helpers. No credentials are written into theme sources."""
import hashlib
from pathlib import Path
import re
import shutil

HASH_PATTERN = re.compile(r'var HASH = "([a-f0-9]{64}|)";')


def read_hash(script: Path) -> str:
    matches = HASH_PATTERN.findall(script.read_text())
    if len(matches) != 1:
        raise ValueError('Expected exactly one local key setting; file left unchanged.')
    return matches[0]


def set_key(script: Path, password: str | None) -> None:
    if password == '':
        raise ValueError('An empty key is not allowed. Use --disable to remove the gate key.')
    read_hash(script)  # Validate before writing.
    digest = hashlib.sha256(password.encode()).hexdigest() if password is not None else ''
    script.write_text(HASH_PATTERN.sub(lambda _: f'var HASH = "{digest}";', script.read_text()))


def prepare(root: Path, update_theme: bool = False) -> None:
    config = root / 'config'
    config.mkdir(exist_ok=True)
    for source in (root / 'examples/config').glob('*.yaml'):
        target = config / source.name
        if not target.exists():
            shutil.copyfile(source, target)
    old_key = read_hash(config / 'custom.js') if (config / 'custom.js').exists() else ''
    for name in ('custom.css', 'custom.js'):
        target = config / name
        if update_theme or not target.exists():
            content = (root / 'theme' / name).read_text()
            if name == 'custom.js':
                content = HASH_PATTERN.sub(lambda _: f'var HASH = "{old_key}";', content)
            target.write_text(content)
    images = config / 'images'
    images.mkdir(exist_ok=True)
    for source in (root / 'theme/images').glob('*.png'):
        if update_theme or not (images / source.name).exists():
            shutil.copyfile(source, images / source.name)
    env = root / '.env'
    if not env.exists():
        # Create with restrictive permissions from the first write.
        import os
        fd = os.open(env, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        with os.fdopen(fd, 'w') as f:
            f.write((root / '.env.example').read_text())
