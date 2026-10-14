import sys

with open('app.js', 'r') as f:
    js = f.read()

js = js.replace(
    '''<button class="btn-report-product" data-station-id="${st.stationId}" data-product="${pName}" data-status="${isAvail ? 'available' : 'empty'}" title="الإبلاغ عن هذه المادة">''',
    '''<button class="btn-report-product" data-station-id="${st.stationId}" data-product="${pName}" data-status="${isAvail ? 'available' : 'empty'}" title="الإبلاغ عن هذه المادة" aria-label="الإبلاغ عن مادة ${pName}">'''
)

js = js.replace(
    '''<a href="https://www.google.com/maps/dir/?api=1&destination=${st.lat},${st.lng}"
                           target="_blank" class="btn-icon-only btn-directions" title="الاتجاهات في خرائط جوجل">''',
    '''<a href="https://www.google.com/maps/dir/?api=1&destination=${st.lat},${st.lng}"
                           target="_blank" class="btn-icon-only btn-directions" title="الاتجاهات في خرائط جوجل" aria-label="الاتجاهات في خرائط جوجل للمحطة ${st.stationName}">'''
)

js = js.replace(
    '''<button class="btn-icon-only btn-report-station" data-station-id="${st.stationId}" title="الإبلاغ عن حالة المحطة">''',
    '''<button class="btn-icon-only btn-report-station" data-station-id="${st.stationId}" title="الإبلاغ عن حالة المحطة" aria-label="الإبلاغ عن حالة المحطة ${st.stationName}">'''
)

js = js.replace(
    '<i class="fas fa-diamond-turn-right"></i>',
    '<i class="fas fa-diamond-turn-right" aria-hidden="true"></i>'
)

js = js.replace(
    '<i class="fas fa-flag"></i>',
    '<i class="fas fa-flag" aria-hidden="true"></i>'
)


with open('app.js', 'w') as f:
    f.write(js)
