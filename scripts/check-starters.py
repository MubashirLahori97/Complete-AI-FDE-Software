"""Execute the course's self-contained Python examples and compare documented output."""
import json
from pathlib import Path
import subprocess
import sys

root = Path(__file__).resolve().parent.parent
guides = []
for source in sorted((root / 'scripts' / 'curriculum').glob('*.json')):
    guides.extend(json.loads(source.read_text(encoding='utf-8')))
checked = 0
for guide in guides:
    example = guide['example']
    if example['language'] != 'python':
        continue
    folder = next(root.glob(f"{guide['day']:02d}_Day_*"))
    result = subprocess.run([sys.executable, str(folder / 'starter' / example['filename'])], cwd=root, capture_output=True, text=True, encoding='utf-8', timeout=5)
    if result.returncode:
        raise AssertionError(f"Lesson {guide['day']} example failed:\n{result.stderr}")
    actual = result.stdout.strip()
    if guide['day'] == 10:
        if not actual.startswith('Python major version: 3\nVirtual environment: '):
            raise AssertionError('Interpreter diagnostic did not report the expected fields')
    elif actual != example['output'].strip():
        raise AssertionError(f"Lesson {guide['day']} output mismatch:\nExpected:\n{example['output']}\nActual:\n{actual}")
    checked += 1
print(json.dumps({'pythonExamplesExecuted': checked, 'outputChecks': 'passed'}))
