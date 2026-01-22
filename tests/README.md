# Link Validation Tests

This directory contains tools to validate external links on the website.

## Overview

The link validation system consists of:
- **`extract_links.py`**: Python script that extracts all outbound links from HTML files and generates a text file listing each link with the page it appears on
- **`check_links.sh`**: Shell script that orchestrates the link extraction and validation process
- **`lychee.toml`**: Configuration file for the lychee link checker
- **`outbound_links.txt`**: Generated file containing all outbound links and their source pages
- **`link_check_results.txt`**: Generated file containing the validation results

## Prerequisites

1. **Python 3**: Required for extracting links from HTML files
2. **lychee**: Fast, modern link checker written in Rust

### Installing lychee

Choose one of the following methods:

**Option 1: Using cargo (Rust)**
```bash
cargo install lychee
```

**Option 2: Using Homebrew (macOS)**
```bash
brew install lychee
```

**Option 3: Download binary**
Visit https://github.com/lycheeverse/lychee/releases and download the appropriate binary for your platform.

## Usage

### Run the complete link validation

```bash
./tests/check_links.sh
```

This will:
1. Extract all external links from HTML files
2. Generate `outbound_links.txt` with all links and their source pages
3. Validate all links using lychee
4. Generate `link_check_results.txt` with validation results

### Extract links only

```bash
python3 tests/extract_links.py
```

This generates `tests/outbound_links.txt` without running validation.

### Check links only (if you already have the links file)

```bash
lychee --config tests/lychee.toml --output tests/link_check_results.txt \
  index.html podcasts.html library.html
```

## Output Files

### `outbound_links.txt`
A human-readable text file listing all external links found on the site, organized by URL with the pages where each link appears.

Format:
```
URL: https://example.com
Found on: index.html, podcasts.html
```

### `link_check_results.txt`
Detailed validation results from lychee, including:
- Status of each link (OK, ERROR, TIMEOUT, etc.)
- HTTP status codes
- Error messages for failed links

## Integration with Cursor

You can add a Cursor rule to automatically track new URLs. Add this to your `.cursorrules` file:

```
When adding external links to HTML files, ensure they are added to tests/outbound_links.txt for tracking.
```

## CI/CD Integration

### GitHub Actions Example

Add this to `.github/workflows/check-links.yml`:

```yaml
name: Check Links

on:
  push:
    branches: [ main, dev ]
  pull_request:
    branches: [ main, dev ]

jobs:
  check-links:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install lychee
        run: |
          curl -L https://github.com/lycheeverse/lychee/releases/latest/download/lychee-x86_64-unknown-linux-gnu.tar.gz | tar -xz
          sudo mv lychee /usr/local/bin/
      
      - name: Extract links
        run: python3 tests/extract_links.py
      
      - name: Check links
        run: ./tests/check_links.sh
      
      - name: Upload results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: link-check-results
          path: |
            tests/outbound_links.txt
            tests/link_check_results.txt
```

## Configuration

Edit `lychee.toml` to customize:
- Timeout settings
- Retry behavior
- Accepted HTTP status codes
- User agent
- SSL certificate validation

See the [lychee documentation](https://github.com/lycheeverse/lychee) for more options.

## Troubleshooting

### lychee not found
Make sure lychee is installed and in your PATH. Verify with:
```bash
lychee --version
```

### Python script errors
Ensure you're using Python 3:
```bash
python3 --version
```

### Links timing out
Increase the timeout in `lychee.toml`:
```toml
timeout = 30  # seconds
```

### False positives
Some sites may block automated link checkers. You can:
1. Add them to the skip list in `lychee.toml`
2. Use a different user agent
3. Manually verify these links
