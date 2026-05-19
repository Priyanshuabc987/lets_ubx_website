import os
import re

directories = ['src', 'public', 'docs']

def fix_quotes(filepath):
    if not os.path.isfile(filepath): return
    if not any(filepath.endswith(ext) for ext in ['.ts', '.tsx', '.js', '.jsx']): return
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Fix strings starting with Let's UBX
        new_content = re.sub(r"'Let's UBX(.*?)'", r'"Let\'s UBX\1"', content)
        
        # What if it's somewhere inside the string? e.g. 'Welcome to Let's UBX' -> "Welcome to Let's UBX"
        # We can find any string bounded by single quotes that contains Let's UBX inside it.
        # But this regex handles it nicely if it's on a single line:
        def replace_inline(match):
            inner = match.group(1)
            # If there's an unescaped single quote inside (the one from Let's UBX),
            # let's just make the whole string double-quoted (and escape inner double quotes if any, though unlikely).
            # Easier: replace the whole match with double quotes.
            # But we must be careful with inner double quotes.
            inner_fixed = inner.replace('"', '\\"')
            return f'"{inner_fixed}"'
            
        new_content = re.sub(r"'([^'\n]*Let's UBX[^'\n]*)'", replace_inline, new_content)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed quotes in {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

for d in directories:
    if os.path.exists(d):
        for root, dirs, files in os.walk(d):
            for file in files:
                fix_quotes(os.path.join(root, file))
