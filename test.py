import sys
import re

with open('app.js', 'r') as f:
    js = f.read()

js = re.sub(
    r'<button class="btn-report-product" data-station-id="\$\{st\.stationId\}" data-product="\$\{pName\}" data-status="\$\{isAvail \? \'available\' : \'empty\'\}" title="الإبلاغ عن هذه المادة">\s*<i class="fas fa-flag"><\/i>',
    r'<button class="btn-report-product" data-station-id="${st.stationId}" data-product="${pName}" data-status="${isAvail ? \'available\' : \'empty\'}" title="الإبلاغ عن هذه المادة" aria-label="الإبلاغ عن مادة ${pName}">\n                            <i class="fas fa-flag" aria-hidden="true"></i>',
    js
)

js = re.sub(
    r'<a href="https:\/\/www\.google\.com\/maps\/dir\/\?api=1&destination=\$\{st\.lat\},\$\{st\.lng\}" \s*target="_blank" class="btn-icon-only btn-directions" title="الاتجاهات في خرائط جوجل">\s*<i class="fas fa-diamond-turn-right"><\/i>',
    r'<a href="https://www.google.com/maps/dir/?api=1&destination=${st.lat},${st.lng}" \n                           target="_blank" class="btn-icon-only btn-directions" title="الاتجاهات في خرائط جوجل" aria-label="الاتجاهات في خرائط جوجل للمحطة ${st.stationName}">\n                            <i class="fas fa-diamond-turn-right" aria-hidden="true"></i>',
    js
)

js = re.sub(
    r'<button class="btn-icon-only btn-report-station" data-station-id="\$\{st\.stationId\}" title="الإبلاغ عن حالة المحطة">\s*<i class="fas fa-flag"><\/i>',
    r'<button class="btn-icon-only btn-report-station" data-station-id="${st.stationId}" title="الإبلاغ عن حالة المحطة" aria-label="الإبلاغ عن حالة المحطة ${st.stationName}">\n                        <i class="fas fa-flag" aria-hidden="true"></i>',
    js
)

with open('app.js', 'w') as f:
    f.write(js)
