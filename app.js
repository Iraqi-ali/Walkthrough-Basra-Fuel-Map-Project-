// Global Constants and Thresholds
const AVAILABILITY_THRESHOLD = 9000; // threshold for "available" fuel in liters
const BASRA_CENTER = [30.5081, 47.7835];
const REPORT_THRESHOLD = 2;

// Application State
let appState = {
    stations: [],
    filteredStations: [],
    userCoords: null,
    currentProductFilter: 'الكل',
    searchQuery: '',
    map: null,
    markersGroup: null,
    activeCardId: null
};

let userSessionId = null;

// UI Elements
const DOM = {
    splashScreen: document.getElementById('splashScreen'),
    loaderBar: document.getElementById('loaderBar'),
    loaderText: document.getElementById('loaderText'),
    appContainer: document.getElementById('app'),
    dateDisplay: document.getElementById('dateDisplay'),
    lastUpdated: document.getElementById('lastUpdated'),
    refreshBtn: document.getElementById('refreshBtn'),
    refreshIcon: document.getElementById('refreshIcon'),
    stationSearch: document.getElementById('stationSearch'),
    productFilters: document.getElementById('productFiltersContainer'),
    geoSortBtn: document.getElementById('geoSortBtn'),
    geoStatus: document.getElementById('geoStatus'),
    resultsCount: document.getElementById('resultsCount'),
    stationsList: document.getElementById('stationsList'),
    appMain: document.querySelector('.app-main'),
    tabListBtn: document.getElementById('tabListBtn'),
    tabMapBtn: document.getElementById('tabMapBtn'),
    
    // Stats Ribbon values
    statTotalStations: document.getElementById('statTotalStations'),
    statRegular: document.getElementById('statRegular'),
    statPremium: document.getElementById('statPremium'),
    statSuper: document.getElementById('statSuper'),
    statDiesel: document.getElementById('statDiesel'),
    statVisitors: document.getElementById('statVisitors')
};

// Helper Icon Map
const productIcons = {
    'بنزين': 'fa-gas-pump text-green',
    'بنزين عادي': 'fa-gas-pump text-green',
    'بنزين محسن': 'fa-bolt-lightning text-orange',
    'بنزين سوبر': 'fa-crown text-red',
    'زيت الغاز': 'fa-truck-field text-grey',
    'زيت الغاز مولدات': 'fa-engine-warning text-grey',
    'نفط أبيض': 'fa-fire-burner text-blue',
    'غاز سائل (LPG)': 'fa-fire-flame-simple text-orange',
    'غاز سائل': 'fa-fire-flame-simple text-orange',
    'اسطوانات غاز': 'fa-cylinder text-orange'
};

// Helper: Create unique user session ID
function getUserSessionId() {
    let sessionId = localStorage.getItem('fuel_map_session_id');
    if (!sessionId) {
        sessionId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('fuel_map_session_id', sessionId);
    }
    return sessionId;
}

// Clean and normalize fuel product names
function cleanProductName(name) {
    if (!name) return "";
    let clean = name.trim().replace(/\s+/g, ' ');
    clean = clean.replace(/ی/g, 'ي');
    if (clean === 'زيت الغاز') return 'زيت الغاز';
    return clean;
}

// Distance Calculation (Haversine Formula in KM)
function calculateDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Initialize Leaflet Map
function initMap() {
    appState.map = L.map('map', {
        zoomControl: false,
        attributionControl: false
    }).setView(BASRA_CENTER, 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(appState.map);

    L.control.zoom({
        position: 'bottomright'
    }).addTo(appState.map);

    appState.markersGroup = L.layerGroup().addTo(appState.map);
}

// Update visitor counter display
async function updateVisitorCount() {
    try {
        const response = await fetch('/api/visitors');
        const data = await response.json();
        if (DOM.statVisitors) {
            DOM.statVisitors.innerText = data.count.toLocaleString('ar-IQ');
        }
    } catch (err) {
        console.error('Failed to fetch visitor count:', err);
    }
}

// Submit station report
async function submitStationReport(stationId, reportType, productName = null) {
    if (!userSessionId) {
        userSessionId = getUserSessionId();
    }
    
    try {
        const response = await fetch('/api/report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                station_id: stationId,
                type: reportType,
                product_name: productName,
                user_session_id: userSessionId
            })
        });
        
        const result = await response.json();
        return result;
    } catch (err) {
        console.error('Report submission error:', err);
        return { success: false, message: 'حدث خطأ في الاتصال بالخادم' };
    }
}

// Show report dialog
function showReportDialog(stationName, productName = null, suggestedType = null) {
    return new Promise((resolve) => {
        const modalHtml = `
            <div id="reportModal" class="report-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
                <div class="report-modal-content" style="background: var(--bg-secondary); border-radius: 20px; padding: 24px; max-width: 400px; width: 90%; border: 1px solid var(--border-color);">
                    <h3 style="margin-bottom: 16px;">الإبلاغ عن حالة المحطة</h3>
                    <p style="margin-bottom: 20px; color: var(--text-secondary);">
                        <strong>${stationName}</strong>
                        ${productName ? `<br>المنتج: ${productName}` : ''}
                    </p>
                    <p style="margin-bottom: 16px; font-size: 0.85rem; color: var(--text-secondary);">
                        يرجى تأكيد حالة الوقود في هذه المحطة. سيتم تغيير الحالة بعد ${REPORT_THRESHOLD} إبلاغات مستقلة.
                    </p>
                    <div style="display: flex; gap: 12px; margin-bottom: 16px;">
                        <button id="reportAvailableBtn" class="btn btn-primary" style="flex: 1; background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                            <i class="fas fa-circle-check"></i> وقود متوفر
                        </button>
                        <button id="reportEmptyBtn" class="btn btn-secondary" style="flex: 1; background: rgba(239, 68, 68, 0.15); color: var(--color-empty); border-color: var(--color-empty);">
                            <i class="fas fa-circle-xmark"></i> غير متوفر
                        </button>
                    </div>
                    <button id="closeReportModal" class="btn btn-secondary" style="width: 100%; background: transparent;">إلغاء</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        const modal = document.getElementById('reportModal');
        const closeModal = () => {
            modal.remove();
            resolve(null);
        };
        
        document.getElementById('reportAvailableBtn').onclick = () => {
            modal.remove();
            resolve({ type: 'available', product: productName });
        };
        
        document.getElementById('reportEmptyBtn').onclick = () => {
            modal.remove();
            resolve({ type: 'empty', product: productName });
        };
        
        document.getElementById('closeReportModal').onclick = closeModal;
        
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };
    });
}

// Show toast notification
function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--bg-secondary);
        border-radius: 12px;
        padding: 12px 24px;
        color: white;
        z-index: 10001;
        border: 1px solid var(--border-color);
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        direction: rtl;
        text-align: center;
        min-width: 200px;
        max-width: 90%;
        animation: fadeInUp 0.3s ease;
    `;
    
    const colors = {
        success: 'var(--color-available)',
        error: 'var(--color-empty)',
        info: 'var(--accent-blue)'
    };
    
    toast.style.borderTop = `3px solid ${colors[type] || colors.info}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-exclamation' : 'fa-info-circle'}" style="margin-left: 8px;"></i>
        ${message}
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOutDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Fetch Stations Data from Local API
async function loadData(isInitial = false) {
    if (isInitial) {
        DOM.loaderBar.style.width = '30%';
        DOM.loaderText.innerText = 'جاري الاتصال بالخادم...';
    } else {
        DOM.refreshIcon.classList.add('spin');
        DOM.refreshBtn.disabled = true;
    }

    try {
        const response = await fetch('/api/stations');
        if (!response.ok) throw new Error('API server returned error code');
        const data = await response.json();
        
        if (isInitial) DOM.loaderBar.style.width = '70%';

        appState.stations = (data.stations || []).map(st => {
            let normalizedProducts = {};
            if (st.products) {
                if (Array.isArray(st.products)) {
                    st.products.forEach(p => {
                        const name = cleanProductName(p.productName);
                        normalizedProducts[name] = {
                            availableQuantity: p.availableQuantity || p.quantity || 0,
                            totalCapacity: p.totalCapacity || 0
                        };
                    });
                } else {
                    Object.entries(st.products).forEach(([name, details]) => {
                        const cleanName = cleanProductName(name);
                        normalizedProducts[cleanName] = {
                            availableQuantity: details.availableQuantity || 0,
                            totalCapacity: details.totalCapacity || null
                        };
                    });
                }
            }
            
            const lat = st.latitude !== undefined ? st.latitude : st.lat;
            const lng = st.longitude !== undefined ? st.longitude : st.lng;
            
            const reportInfo = data.reports_summary ? data.reports_summary[st.stationId] : null;

            return {
                ...st,
                lat: lat ? parseFloat(lat) : null,
                lng: lng ? parseFloat(lng) : null,
                products: normalizedProducts,
                reportInfo: reportInfo
            };
        });

        if (data.last_updated) {
            const updateTime = new Date(data.last_updated);
            DOM.lastUpdated.innerText = `آخر تحديث: ${updateTime.toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            DOM.lastUpdated.innerText = 'آخر تحديث: الآن';
        }

        if (data.visitor_count !== undefined && DOM.statVisitors) {
            DOM.statVisitors.innerText = data.visitor_count.toLocaleString('ar-IQ');
        }

        if (isInitial) DOM.loaderBar.style.width = '90%';

        updateStatsRibbon();
        applyFilters();

        if (isInitial) {
            DOM.loaderBar.style.width = '100%';
            setTimeout(() => {
                DOM.splashScreen.style.opacity = '0';
                setTimeout(() => {
                    DOM.splashScreen.style.display = 'none';
                    DOM.appContainer.style.opacity = '1';
                }, 800);
            }, 300);
        }
    } catch (err) {
        console.error(err);
        if (isInitial) {
            DOM.loaderText.innerText = 'حدث خطأ في تحميل البيانات. يرجى إعادة المحاولة.';
            DOM.loaderBar.style.backgroundColor = 'var(--color-empty)';
        } else {
            showToast('تعذر تحديث البيانات من الخادم، يرجى التحقق من الاتصال.', 'error');
        }
    } finally {
        DOM.refreshIcon.classList.remove('spin');
        DOM.refreshBtn.disabled = false;
    }
}

// Update counters in stats ribbon
function updateStatsRibbon() {
    DOM.statTotalStations.innerText = appState.stations.length;

    let regularCount = 0;
    let premiumCount = 0;
    let superCount = 0;
    let dieselCount = 0;

    appState.stations.forEach(st => {
        if (st.products['بنزين'] && st.products['بنزين'].availableQuantity > AVAILABILITY_THRESHOLD) regularCount++;
        if (st.products['بنزين محسن'] && st.products['بنزين محسن'].availableQuantity > AVAILABILITY_THRESHOLD) premiumCount++;
        if (st.products['بنزين سوبر'] && st.products['بنزين سوبر'].availableQuantity > AVAILABILITY_THRESHOLD) superCount++;
        if (st.products['زيت الغاز'] && st.products['زيت الغاز'].availableQuantity > AVAILABILITY_THRESHOLD) dieselCount++;
    });

    DOM.statRegular.innerText = regularCount;
    DOM.statPremium.innerText = premiumCount;
    DOM.statSuper.innerText = superCount;
    DOM.statDiesel.innerText = dieselCount;
}

// Check if a station has a specific product in stock
function isProductAvailable(station, productName) {
    if (productName === 'الكل') return true;
    const prod = station.products[productName];
    return prod && prod.availableQuantity > AVAILABILITY_THRESHOLD;
}

// Search and Filter logic
function applyFilters() {
    const query = DOM.stationSearch.value.trim().toLowerCase();
    const product = appState.currentProductFilter;

    appState.filteredStations = appState.stations.filter(st => {
        const matchesSearch = 
            st.stationName.toLowerCase().includes(query) || 
            (st.cityName && st.cityName.toLowerCase().includes(query));
        
        const matchesProduct = isProductAvailable(st, product);

        return matchesSearch && matchesProduct;
    });

    if (appState.userCoords) {
        appState.filteredStations.forEach(st => {
            st.distance = calculateDistance(
                appState.userCoords.latitude,
                appState.userCoords.longitude,
                st.lat,
                st.lng
            );
        });
        
        appState.filteredStations.sort((a, b) => {
            if (a.distance === null) return 1;
            if (b.distance === null) return -1;
            return a.distance - b.distance;
        });
    } else {
        appState.filteredStations.sort((a, b) => a.stationName.localeCompare(b.stationName, 'ar'));
    }

    DOM.resultsCount.innerText = `${appState.filteredStations.length} محطة مطابقة`;
    
    renderStationsList();
    renderMapMarkers();
}

// Render list cards in the sidebar
function renderStationsList() {
    DOM.stationsList.innerHTML = '';
    
    if (appState.filteredStations.length === 0) {
        DOM.stationsList.innerHTML = `
            <div class="text-center py-5 text-muted">
                <i class="fas fa-gas-pump fa-3x opacity-20 mb-3"></i>
                <p>لا توجد محطات مطابقة للبحث أو الفلتر الحالي.</p>
            </div>
        `;
        return;
    }

    appState.filteredStations.forEach(st => {
        const hasCoords = st.lat !== null && st.lng !== null;
        
        let productsHtml = '';
        Object.entries(st.products).forEach(([pName, pDetails]) => {
            const isAvail = pDetails.availableQuantity > AVAILABILITY_THRESHOLD;
            const iconClass = productIcons[pName] || 'fa-droplet text-green';
            const qtyText = pDetails.availableQuantity > 0 
                ? `${Math.round(pDetails.availableQuantity).toLocaleString()} لتر` 
                : 'نفذ المخزون';

            productsHtml += `
                <div class="product-row">
                    <div class="product-label">
                        <i class="fas ${iconClass}"></i>
                        <span>${pName}</span>
                    </div>
                    <div class="product-availability">
                        <span class="qty-pill">${qtyText}</span>
                        <span class="status-badge ${isAvail ? 'status-available' : 'status-empty'}">
                            <i class="fas ${isAvail ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
                            ${isAvail ? 'متوفر' : 'غير متوفر'}
                        </span>
                        <button class="btn-report-product" data-station-id="${st.stationId}" data-product="${pName}" data-status="${isAvail ? 'available' : 'empty'}" title="الإبلاغ عن هذه المادة">
                            <i class="fas fa-flag"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        let reportInfoHtml = '';
        if (st.reportInfo && (st.reportInfo.votes?.available > 0 || st.reportInfo.votes?.empty > 0)) {
            reportInfoHtml = `
                <div class="report-info" style="background: rgba(0,0,0,0.2); border-radius: 8px; padding: 6px 12px; margin-top: 8px; font-size: 0.7rem;">
                    <i class="fas fa-users"></i> تقارير المستخدمين: 
                    <span class="text-green">${st.reportInfo.votes?.available || 0} متوفر</span> | 
                    <span class="text-red">${st.reportInfo.votes?.empty || 0} غير متوفر</span>
                    ${st.reportInfo.lock_until ? `<span class="text-muted"> | حتى منتصف الليل</span>` : ''}
                </div>
            `;
        }

        const distText = st.distance !== undefined && st.distance !== null
            ? `<span class="distance-indicator"><i class="fas fa-route"></i> تبعد ${st.distance.toFixed(1)} كم</span>`
            : '';

        const card = document.createElement('div');
        card.className = `station-card ${appState.activeCardId === st.stationId ? 'active-card' : ''}`;
        card.dataset.id = st.stationId;
        
        card.innerHTML = `
            <div class="station-card-header">
                <div class="station-title-area">
                    <h4 class="station-name">${st.stationName}</h4>
                    <span class="station-city">${st.cityName || 'قضاء البصرة'}</span>
                </div>
                <span class="badge-importance">${st.positionImportance || 'محطة وقود'}</span>
            </div>
            
            <div class="station-details">
                ${productsHtml || '<p class="small text-muted py-2 text-center">لا توجد بيانات تفصيلية للمنتجات</p>'}
            </div>
            
            ${reportInfoHtml}

            <div class="station-card-meta">
                ${distText}
                <div class="card-actions" onclick="event.stopPropagation();">
                    ${hasCoords ? `
                        <a href="https://www.google.com/maps/dir/?api=1&destination=${st.lat},${st.lng}" 
                           target="_blank" class="btn-icon-only btn-directions" title="الاتجاهات في خرائط جوجل">
                            <i class="fas fa-diamond-turn-right"></i>
                        </a>
                    ` : ''}
                    <button class="btn-icon-only btn-report-station" data-station-id="${st.stationId}" title="الإبلاغ عن حالة المحطة">
                        <i class="fas fa-flag"></i>
                    </button>
                </div>
            </div>
        `;

        card.addEventListener('click', (e) => {
            if (e.target.closest('.btn-report-product') || e.target.closest('.btn-report-station')) return;
            selectStation(st);
        });

        DOM.stationsList.appendChild(card);
    });

    document.querySelectorAll('.btn-report-station').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const stationId = btn.dataset.stationId;
            const station = appState.stations.find(s => s.stationId == stationId);
            
            if (!station) return;
            
            const result = await showReportDialog(station.stationName, null);
            if (result) {
                showToast('جاري إرسال الإبلاغ...', 'info');
                const reportResult = await submitStationReport(stationId, result.type);
                if (reportResult.success) {
                    showToast(reportResult.message, 'success');
                    await loadData(false);
                } else {
                    showToast(reportResult.message, 'error');
                }
            }
        });
    });
    
    document.querySelectorAll('.btn-report-product').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const stationId = btn.dataset.stationId;
            const productName = btn.dataset.product;
            const currentStatus = btn.dataset.status;
            const station = appState.stations.find(s => s.stationId == stationId);
            
            if (!station) return;
            
            const suggestedType = currentStatus === 'available' ? 'empty' : 'available';
            const result = await showReportDialog(station.stationName, productName, suggestedType);
            
            if (result) {
                showToast('جاري إرسال الإبلاغ...', 'info');
                const reportResult = await submitStationReport(stationId, result.type, productName);
                if (reportResult.success) {
                    showToast(reportResult.message, 'success');
                    await loadData(false);
                } else {
                    showToast(reportResult.message, 'error');
                }
            }
        });
    });
}

// Render markers on the Leaflet Map
function renderMapMarkers() {
    appState.markersGroup.clearLayers();

    appState.filteredStations.forEach(st => {
        if (st.lat === null || st.lng === null) return;

        let isMainFuelAvailable = false;
        if (appState.currentProductFilter === 'الكل') {
            isMainFuelAvailable = Object.values(st.products).some(p => p.availableQuantity > AVAILABILITY_THRESHOLD);
        } else {
            isMainFuelAvailable = isProductAvailable(st, appState.currentProductFilter);
        }

        const markerClass = isMainFuelAvailable ? 'marker-available' : 'marker-empty';
        const iconHtml = `
            <div class="marker-pin ${markerClass}">
                <i class="fas fa-gas-pump"></i>
            </div>
        `;

        const customIcon = L.divIcon({
            html: iconHtml,
            className: 'custom-div-marker',
            iconSize: [36, 36],
            iconAnchor: [18, 36],
            popupAnchor: [0, -36]
        });

        const marker = L.marker([st.lat, st.lng], { icon: customIcon });

        let popupProductsHtml = '';
        Object.entries(st.products).forEach(([pName, pDetails]) => {
            const isAvail = pDetails.availableQuantity > AVAILABILITY_THRESHOLD;
            popupProductsHtml += `
                <div class="popup-product-item">
                    <span>${pName}:</span>
                    <strong class="${isAvail ? 'status-available' : 'status-empty'}">
                        ${isAvail ? 'متوفر' : 'غير متوفر'}
                    </strong>
                </div>
            `;
        });

        const popupHtml = `
            <div class="popup-details">
                <h3 class="popup-title">${st.stationName}</h3>
                <div class="popup-products">
                    ${popupProductsHtml || '<p class="small text-muted">لا تتوفر تفاصيل المنتجات</p>'}
                </div>
                <div class="popup-actions">
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${st.lat},${st.lng}" 
                       target="_blank" class="btn btn-primary" style="padding: 6px 12px; font-size: 0.75rem;">
                        <i class="fas fa-diamond-turn-right"></i> الاتجاهات
                    </a>
                </div>
            </div>
        `;

        marker.bindPopup(popupHtml);
        st.marker = marker;
        
        marker.on('click', () => {
            highlightCard(st.stationId);
        });

        appState.markersGroup.addLayer(marker);
    });

    if (appState.userCoords) {
        const userIcon = L.divIcon({
            html: `
                <div style="position: relative; width: 20px; height: 20px;">
                    <div style="width: 14px; height: 14px; background: #3b82f6; border: 3px solid white; border-radius: 50%; position: absolute; top:3px; left:3px; box-shadow:0 0 10px rgba(0,0,0,0.5);"></div>
                    <div style="width: 20px; height: 20px; border: 2px solid #3b82f6; border-radius: 50%; animation: rippleEffect 1.5s infinite linear; position: absolute; top:0; left:0;"></div>
                </div>
            `,
            className: 'user-marker',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        L.marker([appState.userCoords.latitude, appState.userCoords.longitude], { icon: userIcon }).addTo(appState.markersGroup);
    }
}

// Select a station
function selectStation(st) {
    appState.activeCardId = st.stationId;
    highlightCard(st.stationId);

    if (st.lat !== null && st.lng !== null) {
        appState.map.setView([st.lat, st.lng], 14, { animate: true });
        
        if (st.marker) {
            st.marker.openPopup();
        }

        if (window.innerWidth <= 768) {
            switchTab('map');
        }
    } else {
        alert(`المحطة "${st.stationName}" لا تتوفر لها إحداثيات جغرافية حالياً لتعيينها على الخريطة.`);
    }
}

// Highlight station card in list
function highlightCard(stationId) {
    appState.activeCardId = stationId;
    
    document.querySelectorAll('.station-card').forEach(card => {
        if (parseInt(card.dataset.id) === stationId) {
            card.classList.add('active-card');
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            card.classList.remove('active-card');
        }
    });
}

// Switch between List and Map on mobile devices
function switchTab(tabName) {
    if (tabName === 'list') {
        DOM.tabListBtn.classList.add('active');
        DOM.tabMapBtn.classList.remove('active');
        DOM.appMain.classList.remove('show-map');
    } else if (tabName === 'map') {
        DOM.tabMapBtn.classList.add('active');
        DOM.tabListBtn.classList.remove('active');
        DOM.appMain.classList.add('show-map');
        setTimeout(() => {
            if (appState.map) appState.map.invalidateSize();
        }, 300);
    }
}

// Geolocation Sort Activation
function activateGeolocation() {
    if (!navigator.geolocation) {
        alert('ميزة تحديد الموقع الجغرافي غير مدعومة في متصفحك الحالي.');
        return;
    }

    DOM.geoStatus.classList.remove('hidden');
    DOM.geoStatus.innerText = 'جاري تحديد موقعك الجغرافي...';
    DOM.geoSortBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
        (position) => {
            appState.userCoords = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            
            DOM.geoStatus.innerText = 'تم تحديد موقعك! تم ترتيب المحطات حسب الأقرب.';
            DOM.geoSortBtn.innerHTML = '<i class="fas fa-location-crosshairs"></i> <span>موقعك نشط (مرتب حسب الأقرب)</span>';
            DOM.geoSortBtn.classList.remove('btn-primary');
            DOM.geoSortBtn.classList.add('btn-secondary');
            DOM.geoSortBtn.disabled = false;

            applyFilters();
            appState.map.setView([position.coords.latitude, position.coords.longitude], 12);
        },
        (error) => {
            console.error(error);
            DOM.geoStatus.innerText = 'فشل تحديد الموقع. يرجى إعطاء الصلاحية للمتصفح.';
            DOM.geoSortBtn.disabled = false;
        },
        { enableHighAccuracy: true, timeout: 8000 }
    );
}

// Force Server Data Refresh
async function triggerServerRefresh() {
    DOM.refreshIcon.classList.add('spin');
    DOM.refreshBtn.disabled = true;
    DOM.lastUpdated.innerText = 'جاري التحديث من المصدر...';

    try {
        const response = await fetch('/api/refresh', { method: 'POST' });
        const resData = await response.json();
        
        if (resData.success) {
            await loadData(false);
        } else {
            throw new Error(resData.message || 'Refresh error');
        }
    } catch (err) {
        console.error(err);
        showToast('فشل تحديث البيانات من الموقع الأصلي. قد يكون الموقع متوقفاً مؤقتاً.', 'error');
        await loadData(false);
    }
}

// Set up UI Event Listeners
function setupListeners() {
    userSessionId = getUserSessionId();
    
    DOM.stationSearch.addEventListener('input', applyFilters);

    DOM.productFilters.addEventListener('click', (e) => {
        const pill = e.target.closest('.filter-pill');
        if (!pill) return;

        document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
        pill.classList.add('active');

        appState.currentProductFilter = pill.dataset.product;
        applyFilters();
    });

    DOM.geoSortBtn.addEventListener('click', activateGeolocation);
    DOM.refreshBtn.addEventListener('click', triggerServerRefresh);
    DOM.tabListBtn.addEventListener('click', () => switchTab('list'));
    DOM.tabMapBtn.addEventListener('click', () => switchTab('map'));

    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('click', () => {
            const product = card.dataset.filter;
            if (!product && product !== '') return;
            document.querySelectorAll('.filter-pill').forEach(pill => {
                if (pill.dataset.product === product) {
                    pill.classList.add('active');
                } else {
                    pill.classList.remove('active');
                }
            });
            appState.currentProductFilter = product;
            applyFilters();
            
            const activePill = document.querySelector('.filter-pill.active');
            if (activePill) activePill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
    });
    
    updateVisitorCount();
}

// Initialize Page Load
window.addEventListener('DOMContentLoaded', () => {
    DOM.dateDisplay.innerText = new Date().toLocaleDateString('ar-IQ', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    initMap();
    setupListeners();
    loadData(true);
});
