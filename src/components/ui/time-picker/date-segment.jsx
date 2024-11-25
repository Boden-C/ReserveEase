import { useRef } from 'react';
import { useDateSegment } from 'react-aria';
import { cn } from '@/lib/utils';

function DateSegment({ segment, state }) {
    const ref = useRef(null);

    // Hook to get segment props
    const { segmentProps } = useDateSegment(segment, state, ref);

    return (
        <div
            {...segmentProps}
            ref={ref}
            className={cn(
                'focus:rounded-[2px] focus:bg-accent focus:text-accent-foreground focus:outline-none',
                segment.type !== 'literal' && 'px-[1px]',
                segment.isPlaceholder && 'text-muted-foreground'
            )}
        >
            {segment.text}
        </div>
    );
}

export default DateSegment;
