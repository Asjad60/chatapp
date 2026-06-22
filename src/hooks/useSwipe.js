import { useRef, useState } from "react"

const useSwipe = ({ threshold = 150, maxSwipeX = 200, onSwip }) => {
    const startX = useRef(null)
    const dragging = useRef(false)

    const [transformX, setTransformX] = useState(0)

    const start = (e) => {
        dragging.current = true
        startX.current = e.clientX || e.touches[0].clientX

        e.currentTarget.setPointerCapture(e.pointerId)
    }

    const move = (e) => {
        if (!dragging.current) return

        e.preventDefault()

        const x = e.clientX || e.touches[0].clientX
        const diff = x - startX.current

        if (diff >= 0) {
            setTransformX(Math.min(diff, maxSwipeX))
        }
    }

    const end = () => {
        dragging.current = false
        startX.current = null

        if (transformX >= threshold) {
            onSwip?.()
        }

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