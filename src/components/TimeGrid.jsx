import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';

const TimeGrid = ({ selectedDate, reservedSlots, onSelectionChange, selectedSpace }) => {
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectionStart, setSelectionStart] = useState(null);
    const [selectionEnd, setSelectionEnd] = useState(null);
    const [grid, setGrid] = useState([]);

    // Handle grid updates
    useEffect(() => {
        const slots = [];
        const baseDate = new Date(selectedDate);
        baseDate.setHours(0, 0, 0, 0);
        const now = new Date();

        for (let i = 0; i < 96; i++) {
            const slotStart = new Date(baseDate);
            slotStart.setMinutes(i * 15);
            const slotEnd = new Date(slotStart);
            slotEnd.setMinutes(slotStart.getMinutes() + 15);

            const isPast = slotStart < now;
            const isReserved = reservedSlots.some(
                (reservation) => reservation.start <= slotStart && reservation.end > slotStart
            );

            slots.push({
                start: slotStart,
                end: slotEnd,
                isReserved: isReserved || isPast,
            });
        }
        setGrid(slots);
    }, [selectedDate, reservedSlots]);

    const handleMouseDown = (slot) => {
        if (slot.isReserved) return;
        setIsSelecting(true);
        setSelectionStart(slot.start);
        setSelectionEnd(slot.start);
    };

    const handleMouseEnter = (slot) => {
        if (!isSelecting || slot.isReserved) return;
        setSelectionEnd(slot.end);
    };

    const handleMouseUp = () => {
        if (!isSelecting) return;
        setIsSelecting(false);

        if (selectionStart && selectionEnd) {
            const start = new Date(Math.min(selectionStart.getTime(), selectionEnd.getTime()));
            const end = new Date(Math.max(selectionStart.getTime(), selectionEnd.getTime()));
            onSelectionChange(start, end);
        }
    };

    function handleClearSelection() {
        setSelectionStart(null);
        setSelectionEnd(null);
        onSelectionChange(null, null);
    }

    useEffect(() => {
        handleClearSelection();
        // Honestly, no clue why this is necessary.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSpace]);

    const isSelected = useCallback(
        (slot) => {
            if (!selectionStart || !selectionEnd) return false;
            const start = Math.min(selectionStart.getTime(), selectionEnd.getTime());
            const end = Math.max(selectionStart.getTime(), selectionEnd.getTime());
            return slot.start.getTime() >= start && slot.end.getTime() <= end;
        },
        [selectionStart, selectionEnd]
    );

    return (
        <div className="select-none">
            <div className="flex">
                {/* Time labels column */}
                <div className="w-16 pr-2 relative" style={{ height: '768px' }}>
                    {Array.from({ length: 24 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-full text-right pr-1 text-sm text-gray-600"
                            style={{
                                top: `${i * 32 - 9}px`, // Adjust label position to align with hour line
                            }}
                        >
                            {format(new Date().setHours(i, 0, 0), 'HH:00')}
                        </div>
                    ))}
                </div>

                {/* Grid */}
                <div
                    className="flex-1 relative border-l border-gray-300"
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div className="grid grid-rows-96 gap-0" style={{ height: '768px' }}>
                        {grid.map((slot, i) => {
                            const isHourMark = i % 4 === 0;
                            const is30MinMark = i % 2 === 0;

                            return (
                                <div
                                    key={i}
                                    onMouseDown={() => handleMouseDown(slot)}
                                    onMouseEnter={() => handleMouseEnter(slot)}
                                    className={`
                    h-2 cursor-pointer transition-colors relative
                    ${slot.isReserved ? 'bg-red-400' : 'hover:bg-blue-50'}
                    ${isSelected(slot) ? 'bg-blue-200' : ''}
                  `}
                                >
                                    {/* Horizontal lines with different weights */}
                                    <div
                                        className={`
                    absolute left-0 right-0 top-0
                    ${
                        isHourMark
                            ? 'border-t-2 border-foreground' // Hour mark - thickest
                            : is30MinMark
                              ? 'border-t border-foreground' // 30min mark - medium
                              : 'border-t border-muted' // 15min mark - thinnest
                    }
                  `}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {selectionStart && selectionEnd && (
                <div className="mt-4 text-sm text-gray-600">
                    Selected: {format(selectionStart, 'HH:mm')} - {format(selectionEnd, 'HH:mm')}
                    <button onClick={handleClearSelection} className="ml-2 text-red-600 hover:text-red-800">
                        Clear
                    </button>
                </div>
            )}
        </div>
    );
};

export default TimeGrid;
