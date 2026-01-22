#!/bin/bash
# Script to check external links on the website
# This script extracts links, validates them, and generates reports

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

echo "🔗 Link Validation Tool"
echo "======================"
echo ""

# Check if lychee is installed
if ! command -v lychee &> /dev/null; then
    echo "❌ Error: lychee is not installed."
    echo ""
    echo "Installation options:"
    echo "  1. Using cargo (Rust):"
    echo "     cargo install lychee"
    echo ""
    echo "  2. Using Homebrew (macOS):"
    echo "     brew install lychee"
    echo ""
    echo "  3. Download binary from:"
    echo "     https://github.com/lycheeverse/lychee/releases"
    echo ""
    exit 1
fi

# Step 1: Extract links from HTML files
echo "📄 Step 1: Extracting links from HTML files..."
if command -v python3 &> /dev/null; then
    python3 "$SCRIPT_DIR/extract_links.py"
else
    echo "❌ Error: python3 is required to extract links"
    exit 1
fi

echo ""

# Step 2: Check links using lychee
echo "🔍 Step 2: Validating external links with lychee..."
echo ""

# Run lychee on the HTML files directly
# Use exclude patterns to skip internal links and only check external ones
lychee \
    --config "$SCRIPT_DIR/lychee.toml" \
    --output "$SCRIPT_DIR/link_check_results.txt" \
    --format detailed \
    --exclude "jordanbaucke.github.io" \
    --exclude "jordanbaucke.com" \
    "$PROJECT_ROOT/index.html" \
    "$PROJECT_ROOT/podcasts.html" \
    "$PROJECT_ROOT/library.html" || true

# Check exit code
LYCHEE_EXIT_CODE=$?

echo ""
echo "📊 Results saved to: $SCRIPT_DIR/link_check_results.txt"
echo ""

if [ $LYCHEE_EXIT_CODE -eq 0 ]; then
    echo "✅ All links are valid!"
else
    echo "⚠️  Some links failed validation. Check the results file for details."
fi

echo ""
echo "📋 Summary files:"
echo "   - Outbound links list: $SCRIPT_DIR/outbound_links.txt"
echo "   - Link check results: $SCRIPT_DIR/link_check_results.txt"
echo ""

exit $LYCHEE_EXIT_CODE
