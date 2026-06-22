import { useRef, useCallback } from "react";

export function useLongPress({ onLongPress, onClick, delay = 500 }) {
    const timerRef = useRef(null);
    const isLongPress = useRef(false);

    const start = useCallback((e) => {
        // Only trigger on main mouse button (0) or touch
        if (e && e.type === "mousedown" && e.button !== 0) return;
        isLongPress.current = false;
        timerRef.current = setTimeout(() => {
            isLongPress.current = true;
            if (onLongPress) onLongPress();
        }, delay);
    }, [onLongPress, delay]);

    const clear = useCallback((e) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (!isLongPress.current && onClick) onClick(e);
    }, [onClick]);

    const cancel = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        isLongPress.current = false;
    }, []);

    const handleCaptureClick = useCallback((e) => {
        if (isLongPress.current) {
            e.stopPropagation();
            e.preventDefault();
            isLongPress.current = false;
        }
    }, []);

    return {
        onMouseDown: start,
        onMouseUp: clear,
        onMouseLeave: cancel,
        onTouchStart: start,
        onTouchEnd: clear,
        onTouchMove: cancel,
        onClickCapture: handleCaptureClick,
    };
}