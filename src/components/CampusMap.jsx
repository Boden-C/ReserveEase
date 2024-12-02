import { useEffect, useRef } from 'react';
import OpenSeadragon from 'openseadragon';

const CUSTOM_NAV_IMAGES = {
    zoomIn: {
        REST: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
    </svg>`,
        GROUP: null,
        HOVER: null,
        DOWN: null,
    },
    zoomOut: {
        REST: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/>
    </svg>`,
        GROUP: null,
        HOVER: null,
        DOWN: null,
    },
    home: {
        REST: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>`,
        GROUP: null,
        HOVER: null,
        DOWN: null,
    },
};

function svgToDataUrl(svgString) {
    return `data:image/svg+xml;base64,${btoa(svgString)}`;
}

const parkingSpots = {
    A1: { x: 0.4, y: 0.5, id: 'A1', isAvailable: true },
    A2: { x: 0.6, y: 0.3, id: 'A2', isAvailable: false },
    A3: { x: 0.8, y: 0.7, id: 'A3', isAvailable: true },
    A4: { x: 0.2, y: 0.2, id: 'A4', isAvailable: false },
    A5: { x: 0.3, y: 0.8, id: 'A5', isAvailable: true },
    A6: { x: 0.7, y: 0.4, id: 'A6', isAvailable: false },
    A7: { x: 0.9, y: 0.9, id: 'A7', isAvailable: true },
    A8: { x: 0.1, y: 0.6, id: 'A8', isAvailable: false },
    A9: { x: 0.5, y: 0.1, id: 'A9', isAvailable: true },
    A10: { x: 0.8, y: 0.2, id: 'A10', isAvailable: false },
    A11: { x: 0.2, y: 0.9, id: 'A11', isAvailable: true },
    A12: { x: 0.6, y: 0.6, id: 'A12', isAvailable: false },
    A13: { x: 0.4, y: 0.2, id: 'A13', isAvailable: true },
};

export default function CampusMap({ selectedSpace, onSpaceSelect }) {
    const viewerRef = useRef(null);
    const mapRef = useRef(null);
    const overlayRefs = useRef({});
    const trackersRef = useRef({});

    // Initialize viewer only once
    useEffect(() => {
        if (!mapRef.current || viewerRef.current) return;

        const navImages = Object.fromEntries(
            Object.entries(CUSTOM_NAV_IMAGES).map(([key, value]) => [
                key,
                {
                    ...value,
                    REST: svgToDataUrl(value.REST),
                },
            ])
        );

        const options = {
            element: mapRef.current,
            tileSources: {
                type: 'image',
                url: './src/assets/campus-map.png',
            },
            showNavigationControl: true,
            defaultZoomLevel: 1,
            minZoomLevel: 0.5,
            maxZoomLevel: 10,
            visibilityRatio: 1,
            constrainDuringPan: true,
            navImages,
            controlsFadeDelay: 0,
            controlsFadeLength: 0,
            navigatorPosition: 'TOP_RIGHT',
            zoomInButton: 'zoom-in',
            zoomOutButton: 'zoom-out',
            homeButton: 'home',
            gestureSettingsMouse: {
                clickToZoom: false,
                dblClickToZoom: true,
            },
        };

        viewerRef.current = OpenSeadragon(options);

        return () => {
            // Cleanup MouseTrackers
            Object.values(trackersRef.current).forEach(tracker => tracker.destroy());
            trackersRef.current = {};
            
            // Destroy viewer
            viewerRef.current?.destroy();
            viewerRef.current = null;
        };
    }, []); // Empty dependency array - only run once is fine here as we're just initializing the viewer

    // Handle marker creation and updates
    useEffect(() => {
        if (!viewerRef.current) return;

        const markerSvg = (color) => `
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <path fill="${color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5" fill="white"/>
            </svg>
        `;

        // Create handleClick function that will be used by the MouseTracker
        const createClickHandler = (id) => () => {
            console.log('Marker clicked:', id);
            onSpaceSelect(id);
        };

        // Remove existing overlays
        Object.keys(overlayRefs.current).forEach(id => {
            viewerRef.current.removeOverlay(`marker-${id}`);
        });
        overlayRefs.current = {};

        // Add/update markers
        Object.entries(parkingSpots).forEach(([id, spot]) => {
            const element = document.createElement('div');
            element.id = `marker-${id}`;
            const color = spot.isAvailable ? '#22c55e' : '#ef4444';
            element.innerHTML = markerSvg(color);
            element.className = 'cursor-pointer transition-transform hover:scale-110';

            if (selectedSpace === id) {
                element.classList.add('scale-125');
            }

            viewerRef.current.addOverlay({
                element,
                location: new OpenSeadragon.Point(spot.x, spot.y),
                placement: 'CENTER',
                checkResize: false,
            });

            overlayRefs.current[id] = element;

            // Remove old tracker if it exists
            if (trackersRef.current[id]) {
                trackersRef.current[id].destroy();
            }

            // Create new tracker
            trackersRef.current[id] = new OpenSeadragon.MouseTracker({
                element: element,
                clickHandler: createClickHandler(id)
            });
        });

        return () => {
            // Cleanup MouseTrackers when updating markers
            Object.values(trackersRef.current).forEach(tracker => tracker.destroy());
            trackersRef.current = {};
        };
    }, [selectedSpace, onSpaceSelect]); // Include both dependencies

    return (
        <div className="h-full flex-1">
            <div ref={mapRef} className="w-full h-full" />
            <style>{`
                .openseadragon-container {
                    background: transparent !important;
                }
                .navigator {
                    background: transparent !important;
                }
                .openseadragon-control {
                    background: white !important;
                    border-radius: 4px !important;
                    padding: 4px !important;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
                    margin: 4px !important;
                }
            `}</style>
        </div>
    );
}