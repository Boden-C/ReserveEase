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

/**
 * Interactive campus map component
 * @param {Object} props Component props
 * @param {string|null} props.selectedSpace Currently selected space ID
 * @param {(id: string) => void} props.onSpaceSelect Callback when a space is selected
 * @param {Array<ParkingSpace>} props.parkingSpaces Array of parking spaces with availability
 * @param {boolean} props.isLoading Loading state indicator
 * @returns {JSX.Element} CampusMap component
 */
export default function CampusMap({ selectedSpace, onSpaceSelect, parkingSpaces = [], isLoading }) {
    const viewerRef = useRef(null);
    const mapRef = useRef(null);
    const overlayRefs = useRef({});
    const trackersRef = useRef({});

    // Initialize viewer only once (keeping your existing initialization code)
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
            Object.values(trackersRef.current).forEach((tracker) => tracker.destroy());
            trackersRef.current = {};
            viewerRef.current?.destroy();
            viewerRef.current = null;
        };
    }, []);

    // Handle marker creation and updates
    useEffect(() => {
        if (!viewerRef.current || isLoading) return;

        const markerSvg = (color) => `
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <path fill="${color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5" fill="white"/>
            </svg>
        `;

        const createClickHandler = (id) => () => {
            console.log('Marker clicked:', id);
            onSpaceSelect(id);
        };

        // Remove existing overlays
        Object.keys(overlayRefs.current).forEach((id) => {
            viewerRef.current.removeOverlay(`marker-${id}`);
        });
        overlayRefs.current = {};

        // Add/update markers
        parkingSpaces.forEach((spot) => {
            const element = document.createElement('div');
            element.id = `marker-${spot.space_id}`;
            const color = spot.isAvailable ? '#22c55e' : '#ef4444';
            element.innerHTML = markerSvg(color);
            element.className = 'cursor-pointer transition-transform hover:scale-110';

            if (selectedSpace === spot.space_id) {
                element.classList.add('scale-125');
            }

            viewerRef.current.addOverlay({
                element,
                location: new OpenSeadragon.Point(spot.x, spot.y),
                placement: 'CENTER',
                checkResize: false,
            });

            overlayRefs.current[spot.space_id] = element;

            if (trackersRef.current[spot.space_id]) {
                trackersRef.current[spot.space_id].destroy();
            }

            trackersRef.current[spot.space_id] = new OpenSeadragon.MouseTracker({
                element: element,
                clickHandler: createClickHandler(spot.space_id),
            });
        });

        return () => {
            Object.values(trackersRef.current).forEach((tracker) => tracker.destroy());
            trackersRef.current = {};
        };
    }, [parkingSpaces, selectedSpace, onSpaceSelect, isLoading]);

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
