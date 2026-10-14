import sys

# Patch index.html
with open('index.html', 'r') as f:
    html = f.read()
html = html.replace(
    '<input type="text" id="stationSearch" class="form-control" placeholder="ابحث باسم المحطة أو القضاء أو المنطقة...">',
    '<input type="text" id="stationSearch" class="form-control" placeholder="ابحث باسم المحطة أو القضاء أو المنطقة..." title="اختصار: /" aria-keyshortcuts="/">\n                    <kbd style="position: absolute; left: 32px; top: 50%; transform: translateY(-50%); background: rgba(255, 255, 255, 0.1); color: var(--text-secondary); padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; font-family: monospace; border: 1px solid var(--border-color); pointer-events: none;" aria-hidden="true">/</kbd>'
)
with open('index.html', 'w') as f:
    f.write(html)

# Patch style.css
with open('style.css', 'r') as f:
    css = f.read()
css = css.replace(
    'padding: 12px 42px 12px 16px;',
    'padding: 12px 42px 12px 42px;'
)
with open('style.css', 'w') as f:
    f.write(css)

# Patch app.js
with open('app.js', 'r') as f:
    js = f.read()
js = js.replace(
    'updateVisitorCount();\n}',
    """document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== DOM.stationSearch && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            DOM.stationSearch.focus();
        }
    });

    updateVisitorCount();
}"""
)
with open('app.js', 'w') as f:
    f.write(js)
