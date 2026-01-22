#!/usr/bin/env python3
"""
Extract all outbound links from HTML files and generate a text file listing
each link with the page it appears on.
"""

import os
import re
from pathlib import Path
from urllib.parse import urlparse
from html.parser import HTMLParser
from collections import defaultdict

# Base URL for the site
BASE_URL = "https://jordanbaucke.github.io/personal-website"
BASE_DOMAIN = "jordanbaucke.com"

class LinkExtractor(HTMLParser):
    """HTML parser to extract links from HTML files."""
    
    def __init__(self, source_file):
        super().__init__()
        self.source_file = source_file
        self.links = []
        self.current_tag = None
        self.current_attrs = {}
        
    def handle_starttag(self, tag, attrs):
        self.current_tag = tag
        self.current_attrs = dict(attrs)
        
        if tag == 'a' and 'href' in self.current_attrs:
            href = self.current_attrs['href']
            if href and not href.startswith('#') and not href.startswith('javascript:'):
                self.links.append(href)
    
    def handle_startendtag(self, tag, attrs):
        # Handle self-closing tags like <img>
        pass

def is_external_link(url):
    """Check if a URL is external (not pointing to the same site)."""
    if not url:
        return False
    
    # Skip anchors, javascript, mailto, tel
    if url.startswith('#') or url.startswith('javascript:') or url.startswith('mailto:') or url.startswith('tel:'):
        return False
    
    # Skip relative paths (internal links)
    if not url.startswith('http://') and not url.startswith('https://'):
        return False
    
    try:
        parsed = urlparse(url)
        domain = parsed.netloc.lower()
        
        # Check if it's an external domain
        if BASE_DOMAIN in domain or 'jordanbaucke.github.io' in domain:
            return False
        
        return True
    except Exception:
        return False

def extract_links_from_file(file_path):
    """Extract all external links from an HTML file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        parser = LinkExtractor(file_path)
        parser.feed(content)
        
        external_links = []
        for link in parser.links:
            if is_external_link(link):
                external_links.append(link)
        
        return external_links
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return []

def main():
    """Main function to extract links from all HTML files."""
    project_root = Path(__file__).parent.parent
    html_files = [
        project_root / 'index.html',
        project_root / 'podcasts.html',
        project_root / 'library.html',
    ]
    
    # Dictionary to store links and their source pages
    link_map = defaultdict(list)
    
    for html_file in html_files:
        if not html_file.exists():
            print(f"Warning: {html_file} not found")
            continue
        
        print(f"Processing {html_file.name}...")
        links = extract_links_from_file(html_file)
        
        for link in links:
            link_map[link].append(html_file.name)
    
    # Generate output file
    output_file = project_root / 'tests' / 'outbound_links.txt'
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("Outbound Links Report\n")
        f.write("=" * 80 + "\n\n")
        f.write(f"Generated: {Path(__file__).stat().st_mtime}\n")
        f.write(f"Total unique external links: {len(link_map)}\n\n")
        f.write("-" * 80 + "\n\n")
        
        # Sort links alphabetically
        for link in sorted(link_map.keys()):
            pages = sorted(set(link_map[link]))
            f.write(f"URL: {link}\n")
            f.write(f"Found on: {', '.join(pages)}\n")
            f.write("\n")
    
    print(f"\n✓ Extracted {len(link_map)} unique external links")
    print(f"✓ Report saved to: {output_file}")
    
    # Also generate a simple list for lychee
    lychee_input = project_root / 'tests' / 'lychee_input.txt'
    with open(lychee_input, 'w', encoding='utf-8') as f:
        for link in sorted(link_map.keys()):
            f.write(f"{link}\n")
    
    print(f"✓ Lychee input file saved to: {lychee_input}")

if __name__ == '__main__':
    main()
