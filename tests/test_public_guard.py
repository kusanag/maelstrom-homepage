from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

SOURCE = Path(__file__).resolve().parents[1]

class PublicationGuardTests(unittest.TestCase):
    def test_staged_secret_is_rejected_even_if_worktree_is_clean(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            (root / 'scripts').mkdir()
            shutil.copyfile(SOURCE / 'scripts/check-public.py', root / 'scripts/check-public.py')
            subprocess.run(['git', 'init', '-q'], cwd=root, check=True)
            fixture = 'var HASH = "' + 'a' * 64 + '";'
            (root / 'theme.js').write_text(fixture)
            subprocess.run(['git', 'add', 'theme.js'], cwd=root, check=True)
            (root / 'theme.js').write_text('var HASH = "";')
            result = subprocess.run([sys.executable, 'scripts/check-public.py'], cwd=root, capture_output=True, text=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('configured UI verifier', result.stdout)
            self.assertNotIn('a' * 64, result.stdout)

    def test_local_deployment_is_rejected_when_force_added(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            (root / 'scripts').mkdir()
            shutil.copyfile(SOURCE / 'scripts/check-public.py', root / 'scripts/check-public.py')
            subprocess.run(['git', 'init', '-q'], cwd=root, check=True)
            (root / '.env').write_text('PLACEHOLDER_ONLY=\n')
            subprocess.run(['git', 'add', '.env'], cwd=root, check=True)
            result = subprocess.run([sys.executable, 'scripts/check-public.py'], cwd=root, capture_output=True, text=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('local deployment file tracked', result.stdout)

if __name__ == '__main__':
    unittest.main()
