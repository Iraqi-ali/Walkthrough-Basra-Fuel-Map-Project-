with open("app.js", "r") as f:
    content = f.read()

content = content.replace(
    '<button class="btn-report-product" data-station-id="${st.stationId}" data-product="${pName}" data-status="${isAvail ? \'available\' : \'empty\'}" title="الإبلاغ عن هذه المادة" aria-label="الإبلاغ عن مادة ${pName}">',
    '<button class="btn-report-product" data-station-id="${st.stationId}" data-product="${pName}" data-status="${isAvail ? \'available\' : \'empty\'}" title="الإبلاغ عن هذه المادة" aria-label="الإبلاغ عن مادة ${pName}">\n                            <i class="fas fa-flag"></i>\n                        </button>'
)

content = content.replace(
    '<button class="btn-report-product" data-station-id="${st.stationId}" data-product="${pName}" data-status="${isAvail ? \'available\' : \'empty\'}" title="الإبلاغ عن هذه المادة">\n                            <i class="fas fa-flag"></i>\n                        </button>',
    '<button class="btn-report-product" data-station-id="${st.stationId}" data-product="${pName}" data-status="${isAvail ? \'available\' : \'empty\'}" title="الإبلاغ عن هذه المادة" aria-label="الإبلاغ عن مادة ${pName}">\n                            <i class="fas fa-flag"></i>\n                        </button>'
)
