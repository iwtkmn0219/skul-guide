import os
import shutil
import tempfile
import unittest

from subset_fonts import ks_x_1001_hangul, subset_text


class KsHangulTest(unittest.TestCase):
    def test_2350_syllables(self):
        ks = ks_x_1001_hangul()
        self.assertEqual(len(ks), 2350)
        self.assertIn('가', ks)
        self.assertIn('힝', ks)
        self.assertNotIn('똠', ks)
        self.assertNotIn('쫒', ks)


class SubsetTextTest(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.mkdtemp()
        files = {
            'index.html': '<p>쫒★</p>\r\n',
            os.path.join('js', 'a.js'): "'ⓩ'",
            os.path.join('css', 'a.css'): 'a::after{content:"▸"}',
            os.path.join('fonts', 'OFL.txt'): '똠',
        }
        for rel, content in files.items():
            path = os.path.join(self.dir, rel)
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, 'w', encoding='utf-8', newline='') as f:
                f.write(content)

    def tearDown(self):
        shutil.rmtree(self.dir)

    def test_includes_ascii_ks_and_used_chars(self):
        text = subset_text(self.dir)
        for c in ' A~가힝쫒★ⓩ▸':
            self.assertIn(c, text)

    def test_skips_other_files_and_control_chars(self):
        text = subset_text(self.dir)
        self.assertNotIn('똠', text)
        self.assertNotIn('\n', text)
        self.assertNotIn('\r', text)

    def test_sorted_and_unique(self):
        text = subset_text(self.dir)
        self.assertEqual(text, ''.join(sorted(set(text))))


if __name__ == '__main__':
    unittest.main()
