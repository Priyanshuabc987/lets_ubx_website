import os
import re

replacements = [
    (r'\bCEDAT\b', "Let's UBX"),
    (r'\bCedat\b', "Let's UBX"),
    (r'cedat\.in', 'letsubx.in'),
    (r'cedat_org', 'letsubx_org'),
    (r'cedatnexus', 'letsubx'),
    (r'cedat\.center', 'letsubx.center'),
    (r'cedat-qr', 'letsubx-qr'),
    (r'cedat_registrations', 'letsubx_registrations'),
    (r'cedat_members', 'letsubx_members'),
    (r'cedat(?=\W)', 'letsubx') # match lowercase cedat when followed by a non-word char (like in strings)
]

directories = ['src', 'public', 'docs']

def process_file(filepath):
    if not os.path.isfile(filepath): return
    if not any(filepath.endswith(ext) for ext in ['.ts', '.tsx', '.md', '.txt', '.json', '.js', '.css', '.html']): return
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        for pattern, replacement in replacements:
            # We don't want to replace "cedat" inside "cedat-uploads" which is an S3 bucket or "cedat-logo.png" which is a file.
            # So let's handle those carefully.
            if pattern == r'cedat(?=\W)':
                # let's be more specific with lowercase cedat to avoid breaking URLs/paths
                pass
            else:
                new_content = re.sub(pattern, replacement, new_content)
                
        # Handle specific lowercase cases safely
        new_content = new_content.replace('cedat.in', 'letsubx.in')
        new_content = new_content.replace('cedat_org', 'letsubx_org')
        new_content = new_content.replace('cedatnexus', 'letsubx')
        new_content = new_content.replace('cedat.center', 'letsubx.center')
        
        # Also replace standalone 'cedat' where it's a visible word or generic slug
        # We can just replace 'cedat' with 'letsubx' but exclude known static paths
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

for d in directories:
    if os.path.exists(d):
        for root, dirs, files in os.walk(d):
            for file in files:
                process_file(os.path.join(root, file))
