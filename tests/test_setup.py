import hashlib
from pathlib import Path
import shutil
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from deck import prepare, set_key, read_hash

SOURCE = Path(__file__).resolve().parents[1]

class SetupTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        for directory in ('theme', 'examples'):
            shutil.copytree(SOURCE / directory, self.root / directory)
        shutil.copyfile(SOURCE / '.env.example', self.root / '.env.example')

    def test_clean_install_has_no_default_key(self):
        prepare(self.root)
        self.assertEqual(read_hash(self.root / 'config/custom.js'), '')
        self.assertTrue((self.root / 'config/images/backwall_cyberpunk.png').exists())
        self.assertEqual((self.root / '.env').stat().st_mode & 0o777, 0o600)

    def test_repeat_setup_preserves_personal_edits(self):
        prepare(self.root)
        (self.root / 'config/services.yaml').write_text('local edit\n')
        (self.root / 'config/custom.css').write_text('local theme edit\n')
        (self.root / '.env').write_text('local environment\n')
        prepare(self.root)
        self.assertEqual((self.root / 'config/services.yaml').read_text(), 'local edit\n')
        self.assertEqual((self.root / 'config/custom.css').read_text(), 'local theme edit\n')
        self.assertEqual((self.root / '.env').read_text(), 'local environment\n')

    def test_theme_update_preserves_key_and_services(self):
        prepare(self.root)
        key = 'browser-fixture-only'
        set_key(self.root / 'config/custom.js', key)
        (self.root / 'config/services.yaml').write_text('local edit\n')
        prepare(self.root, update_theme=True)
        self.assertEqual(read_hash(self.root / 'config/custom.js'), hashlib.sha256(key.encode()).hexdigest())
        self.assertNotIn(key, (self.root / 'config/custom.js').read_text())
        self.assertEqual((self.root / 'config/services.yaml').read_text(), 'local edit\n')
        self.assertEqual(read_hash(self.root / 'theme/custom.js'), '')

    def test_disable_key_and_reject_empty_or_unknown_format(self):
        prepare(self.root)
        p = self.root / 'config/custom.js'
        with self.assertRaises(ValueError):
            set_key(p, '')
        set_key(p, 'fixture-only')
        set_key(p, None)
        self.assertEqual(read_hash(p), '')
        p.write_text('unrecognized script')
        with self.assertRaises(ValueError):
            set_key(p, 'fixture-only')
        self.assertEqual(p.read_text(), 'unrecognized script')

if __name__ == '__main__':
    unittest.main()
