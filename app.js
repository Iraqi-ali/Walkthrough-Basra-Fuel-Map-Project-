// أضف إلى DOM object
const DOM = {
    // ... باقي العناصر ...
    statVisitors: document.getElementById('statVisitors'),
    // ... باقي العناصر ...
};

// Global Constants and Thresholds
const AVAILABILITY_THRESHOLD = 9000; // threshold for "available" fuel in liters
const BASRA_CENTER = [30.5081, 47.7835];

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
    statDiesel: document.getElementById('statDiesel')
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

// Clean and normalize fuel product names
function cleanProductName(name) {
    if (!name) return "";
    let clean = name.trim().replace(/\s+/g, ' ');
    // Normalize Persian/Kurdish 'ی' to standard Arabic 'ي'
    clean = clean.replace(/ی/g, 'ي');
    // Normalize variants
    if (clean === 'زيت الغاز') return 'زيت الغاز';
    return clean;
}

// Distance Calculation (Haversine Formula in KM)
function calculateDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // returns distance in km
}

// Initialize Leaflet Map
function initMap() {
    appState.map = L.map('map', {
        zoomControl: false,
        attributionControl: false
    }).setView(BASRA_CENTER, 11);

    // Standard OpenStreetMap tile layer (inverted via CSS for modern dark style)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(appState.map);

    // Reposition zoom controls to bottom-right
    L.control.zoom({
        position: 'bottomright'
    }).addTo(appState.map);

    // Group to hold markers for clearing/updating
    appState.markersGroup = L.layerGroup().addTo(appState.map);
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

        // Process data
        appState.stations = (data.stations || []).map(st => {
            // Clean products dictionary keys
            let normalizedProducts = {};
            if (st.products) {
                if (Array.isArray(st.products)) {
                    // if it is array format
                    st.products.forEach(p => {
                        const name = cleanProductName(p.productName);
                        normalizedProducts[name] = {
                            availableQuantity: p.availableQuantity || p.quantity || 0,
                            totalCapacity: p.totalCapacity || 0
                        };
                    });
                } else {
                    // if it is object format
                    Object.entries(st.products).forEach(([name, details]) => {
                        const cleanName = cleanProductName(name);
                        normalizedProducts[cleanName] = {
                            availableQuantity: details.availableQuantity || 0,
                            totalCapacity: details.totalCapacity || null
                        };
                    });
                }
            }
            
            // Handle latitude / longitude fallback keys
            const lat = st.latitude !== undefined ? st.latitude : st.lat;
            const lng = st.longitude !== undefined ? st.longitude : st.lng;

            return {
                ...st,
                lat: lat ? parseFloat(lat) : null,
                lng: lng ? parseFloat(lng) : null,
                products: normalizedProducts
            };
        });

        // Set Last Update Time
        if (data.last_updated) {
            const updateTime = new Date(data.last_updated);
            DOM.lastUpdated.innerText = `آخر تحديث: ${updateTime.toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            DOM.lastUpdated.innerText = 'آخر تحديث: الآن';
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
            alert('تعذر تحديث البيانات من الخادم، يرجى التحقق من الاتصال.');
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
        // Search matches Name or CityName
        const matchesSearch = 
            st.stationName.toLowerCase().includes(query) || 
            (st.cityName && st.cityName.toLowerCase().includes(query));
        
        // Product filter matches
        const matchesProduct = isProductAvailable(st, product);

        return matchesSearch && matchesProduct;
    });

    // If User location is loaded, calculate distances and sort
    if (appState.userCoords) {
        appState.filteredStations.forEach(st => {
            st.distance = calculateDistance(
                appState.userCoords.latitude,
                appState.userCoords.longitude,
                st.lat,
                st.lng
            );
        });
        
        // Sort by distance (stations with null coordinates sorted to the bottom)
        appState.filteredStations.sort((a, b) => {
            if (a.distance === null) return 1;
            if (b.distance === null) return -1;
            return a.distance - b.distance;
        });
    } else {
        // Default sort (by station ID or Name)
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
        
        // Product status items html
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
                    </div>
                </div>
            `;
        });

        // Distance text
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

            <div class="station-card-meta">
                ${distText}
                <div class="card-actions" onclick="event.stopPropagation();">
                    ${hasCoords ? `
                        <a href="https://www.google.com/maps/dir/?api=1&destination=${st.lat},${st.lng}" 
                           target="_blank" class="btn-icon-only btn-directions" title="الاتجاهات في خرائط جوجل">
                            <i class="fas fa-diamond-turn-right"></i>
                        </a>
                    ` : ''}
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            selectStation(st);
        });

        DOM.stationsList.appendChild(card);
    });
}

// Render markers on the Leaflet Map
function renderMapMarkers() {
    appState.markersGroup.clearLayers();

    appState.filteredStations.forEach(st => {
        if (st.lat === null || st.lng === null) return; // skip if no coords

        // Determine if selected product (or overall fuel if "All") is available to choose marker color
        let isMainFuelAvailable = false;
        if (appState.currentProductFilter === 'الكل') {
            // Check if ANY fuel is available
            isMainFuelAvailable = Object.values(st.products).some(p => p.availableQuantity > AVAILABILITY_THRESHOLD);
        } else {
            // Check if specific product is available
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

        // Popup Content
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
        
        // Keep link to marker in station object
        st.marker = marker;
        
        marker.on('click', () => {
            // Highlight matching card in sidebar
            highlightCard(st.stationId);
        });

        appState.markersGroup.addLayer(marker);
    });

    // Add user location marker if active
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

// Select a station (center map on it, highlight list card, open map popup)
function selectStation(st) {
    appState.activeCardId = st.stationId;
    highlightCard(st.stationId);

    // Focus on map if coordinates exist
    if (st.lat !== null && st.lng !== null) {
        appState.map.setView([st.lat, st.lng], 14, { animate: true });
        
        if (st.marker) {
            st.marker.openPopup();
        }

        // If on mobile view, switch active tab to map
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
            // Smoothly scroll container to bring card into view
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
        // Force Leaflet to re-calculate dimensions upon visibility change
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

            // Recalculate filters and sort
            applyFilters();
            
            // Re-center map to capture user location along with stations
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
            // Fetch updated data from cache API
            await loadData(false);
        } else {
            throw new Error(resData.message || 'Refresh error');
        }
    } catch (err) {
        console.error(err);
        alert('فشل تحديث البيانات من الموقع الأصلي. قد يكون الموقع متوقفاً مؤقتاً.');
        // reset label
        await loadData(false);
    }
}

// Set up UI Event Listeners
function setupListeners() {
    // Search input typing
    DOM.stationSearch.addEventListener('input', applyFilters);

    // Product filter pill buttons
    DOM.productFilters.addEventListener('click', (e) => {
        const pill = e.target.closest('.filter-pill');
        if (!pill) return;

        document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
        pill.classList.add('active');

        appState.currentProductFilter = pill.dataset.product;
        applyFilters();
    });

    // Geolocation trigger button
    DOM.geoSortBtn.addEventListener('click', activateGeolocation);

    // Manual Refresh button
    DOM.refreshBtn.addEventListener('click', triggerServerRefresh);

    // Mobile nav tabs
    DOM.tabListBtn.addEventListener('click', () => switchTab('list'));
    DOM.tabMapBtn.addEventListener('click', () => switchTab('map'));

    // Stats ribbon interactions (clicking triggers product filters)
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('click', () => {
            const product = card.dataset.filter;
            // Activate corresponding pill in filter section
            document.querySelectorAll('.filter-pill').forEach(pill => {
                if (pill.dataset.product === product) {
                    pill.classList.add('active');
                } else {
                    pill.classList.remove('active');
                }
            });
            appState.currentProductFilter = product;
            applyFilters();
            
            // Scroll filter pill into view
            const activePill = document.querySelector('.filter-pill.active');
            if (activePill) activePill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
    });
}

// Initialize Page Load
window.addEventListener('DOMContentLoaded', () => {
    // Display Hijri/Gregorian date in Arabic
    DOM.dateDisplay.innerText = new Date().toLocaleDateString('ar-IQ', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    initMap();
    setupListeners();
    loadData(true); // Load data and trigger splash screen countdown
});
