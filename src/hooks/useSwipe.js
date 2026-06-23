import { useRef, useState } from "react"

const useSwipe = ({ threshold = 150, maxSwipeX = 200, onSwip }) => {
    const startX = useRef(null)
    const dragging = useRef(false)

    const [transformX, setTransformX] = useState(0)

    const start = (e) => {
        startX.current = e.clientX || e.touches[0].clientX
    }

    const move = (e) => {
        if (startX.current === null) return

        const x = e.clientX || e.touches[0].clientX
        const diff = x - startX.current

        // Start dragging only after the pointer has moved a little, then capture it
        if (!dragging.current && Math.abs(diff) > 10) {
            dragging.current = true
            e.currentTarget.setPointerCapture(e.pointerId)
        }

        if (dragging.current) {
            e.preventDefault()
            if (diff >= 0) {
                setTransformX(Math.min(diff, maxSwipeX))
            }
        }
    }

    const end = (e) => {
        if (dragging.current) {
            try {
                e.currentTarget.releasePointerCapture(e.pointerId)
            } catch (err) {
                // ignore errors
            }
            if (transformX >= threshold) {
                onSwip?.()
            }
        }

        dragging.current = false
        startX.current = null
        setTransformX(0)
    }

    return {
        transformX,
        style: {
            transform: `translateX(${transformX}px)`,
        },
        isDragging: dragging.current,
        bind: {
            onPointerDown: start,
            onPointerUp: end,
            onPointerCancel: end,
            onPointerMove: move,
        }
    }
}

export default useSwipe