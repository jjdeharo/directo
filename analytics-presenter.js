(function () {
    const ANALYTICS_BASE_URL = 'https://bilateria.org/app/estadistica/';
    const ANALYTICS_COOLDOWN_MS = 30 * 60 * 1000;
    const ANALYTICS_TIMEOUT_MS = 4000;
    const triggeredSites = {};

    function getStorageKey(siteId) {
        return `analytics:last-presenter-visit:${siteId}`;
    }

    function shouldCountVisit(siteId) {
        try {
            const rawValue = window.localStorage.getItem(getStorageKey(siteId));
            if (!rawValue) {
                return true;
            }
            const lastVisit = parseInt(rawValue, 10);
            if (!Number.isFinite(lastVisit)) {
                return true;
            }
            return (Date.now() - lastVisit) > ANALYTICS_COOLDOWN_MS;
        } catch (error) {
            return true;
        }
    }

    function rememberVisit(siteId) {
        try {
            window.localStorage.setItem(getStorageKey(siteId), String(Date.now()));
        } catch (error) {
            // Analytics must never block the app.
        }
    }

    function requestTracking(siteId) {
        if (!siteId || triggeredSites[siteId]) {
            return;
        }

        triggeredSites[siteId] = true;

        const countVisit = shouldCountVisit(siteId);
        const callbackName = `directoAnalyticsCallback_${siteId.replace(/[^a-z0-9_]/gi, '_')}_${Date.now()}`;
        const query = new URLSearchParams();
        const script = document.createElement('script');
        let timeoutId = 0;
        let finished = false;

        query.set('callback', callbackName);
        if (!countVisit) {
            query.set('summary_only', '1');
        }

        function cleanup() {
            if (finished) {
                return;
            }
            finished = true;
            window.clearTimeout(timeoutId);
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
            try {
                delete window[callbackName];
            } catch (error) {
                window[callbackName] = undefined;
            }
        }

        window[callbackName] = function () {
            if (countVisit) {
                rememberVisit(siteId);
            }
            cleanup();
        };

        timeoutId = window.setTimeout(cleanup, ANALYTICS_TIMEOUT_MS);
        script.async = true;
        script.src = `${ANALYTICS_BASE_URL}${siteId}/track.php?${query.toString()}`;
        script.onerror = cleanup;
        document.head.appendChild(script);
    }

    window.analyticsMarkPresenterView = function (siteId) {
        if (typeof window.requestIdleCallback === 'function') {
            window.requestIdleCallback(function () {
                requestTracking(siteId);
            }, { timeout: 2500 });
            return;
        }

        window.setTimeout(function () {
            requestTracking(siteId);
        }, 1200);
    };
})();
