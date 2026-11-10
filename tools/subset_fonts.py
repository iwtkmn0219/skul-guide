"""갈무리 글꼴을 사이트에 쓰는 글자만 남겨 서브셋한다.

남기는 글자: ASCII, KS X 1001 한글 2,350자, public/의 html·js·css에 실제로 쓰인 모든 글자.
fontTools와 brotli는 개발용이다: python -m pip install --user fonttools brotli
"""
import argparse
import os
import shutil
import sys

FONTS = ('Galmuri11.woff2', 'Galmuri11-Bold.woff2', 'Galmuri14.woff2')
EXTENSIONS = ('.html', '.js', '.css')
DOWNLOAD_HELP = """원본 글꼴이 없습니다. 다음 명령으로 받으세요.
  mkdir -p sources/galmuri && cd sources/galmuri
  npm pack galmuri@2.40.3
  tar -xzf galmuri-2.40.3.tgz package/dist/Galmuri11.woff2 package/dist/Galmuri11-Bold.woff2 package/dist/Galmuri14.woff2 package/dist/LICENSE.txt
  mv package/dist/* . && rm -r package galmuri-2.40.3.tgz && cd ../.."""


def ks_x_1001_hangul():
    """EUC-KR 0xB0A1~0xC8FE의 완성형 한글 2,350자."""
    chars = []
    for lead in range(0xB0, 0xC9):
        for trail in range(0xA1, 0xFF):
            try:
                c = bytes((lead, trail)).decode('euc-kr')
            except UnicodeDecodeError:
                continue
            if '가' <= c <= '힣':
                chars.append(c)
    return chars


def collect_chars(public_dir):
    """public_dir 아래 .html/.js/.css 파일에 쓰인 글자(제어 문자 제외)."""
    found = set()
    for root, _dirs, files in os.walk(public_dir):
        for name in files:
            if not name.endswith(EXTENSIONS):
                continue
            with open(os.path.join(root, name), encoding='utf-8') as f:
                found.update(c for c in f.read() if ord(c) >= 0x20 and ord(c) != 0x7F)
    return found


def subset_text(public_dir):
    chars = {chr(c) for c in range(0x20, 0x7F)}
    chars.update(ks_x_1001_hangul())
    chars.update(collect_chars(public_dir))
    return ''.join(sorted(chars))


def main(argv=None):
    parser = argparse.ArgumentParser(description='갈무리 글꼴 서브셋')
    parser.add_argument('--src', required=True, help='원본 글꼴 폴더(FONTS와 LICENSE.txt)')
    parser.add_argument('--public', required=True, help='사이트 폴더(public)')
    parser.add_argument('--chars-out', required=True, help='남긴 글자 목록을 쓸 파일')
    args = parser.parse_args(argv)

    try:
        from fontTools import subset
        from fontTools.ttLib import TTFont
    except ImportError:
        print('fontTools가 없습니다: python -m pip install --user fonttools brotli', file=sys.stderr)
        return 1

    missing = [f for f in FONTS + ('LICENSE.txt',) if not os.path.isfile(os.path.join(args.src, f))]
    if missing:
        print(f'없는 파일: {", ".join(missing)}', file=sys.stderr)
        print(DOWNLOAD_HELP, file=sys.stderr)
        return 1

    text = subset_text(args.public)
    out_dir = os.path.join(args.public, 'fonts')
    os.makedirs(out_dir, exist_ok=True)
    for name in FONTS:
        options = subset.Options()
        options.flavor = 'woff2'
        options.layout_features = ['*']
        options.name_IDs = ['*']
        options.notdef_outline = True
        font = TTFont(os.path.join(args.src, name))
        subsetter = subset.Subsetter(options)
        subsetter.populate(text=text)
        subsetter.subset(font)
        cmap = font.getBestCmap()
        out = os.path.join(out_dir, name)
        subset.save_font(font, out, options)
        lost = ''.join(c for c in text if ord(c) > 0x7E and ord(c) not in cmap)
        print(f'{name}: {os.path.getsize(out) / 1024:.1f}KB' + (f' (글꼴에 없는 글자: {lost})' if lost else ''))

    shutil.copyfile(os.path.join(args.src, 'LICENSE.txt'), os.path.join(out_dir, 'OFL.txt'))
    with open(args.chars_out, 'w', encoding='utf-8', newline='') as f:
        f.write(text)
    return 0


if __name__ == '__main__':
    sys.exit(main())
