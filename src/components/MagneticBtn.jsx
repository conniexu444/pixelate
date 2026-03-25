// Adapted from cuicui: common-ui/buttons/magnetic-button/magnetic-background-button.tsx
// CSS-only magnetic effect (no motion library required)
import { useState, useRef } from 'react'

export default function MagneticBtn({
  children,
  variant = 'secondary',
  disabled = false,
  magneticStrength = 0.4,
  exitForce = 16,
  onClick,
  ...props
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [lastMouse, setLastMouse] = useState(null)
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef(null)

  function handleMouseMove(e) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    const max = Math.max(rect.width, rect.height)
    const ux = dx / dist
    const uy = dy / dist
    const clamped = Math.min(dist, max)
    const mag = (clamped / max) * magneticStrength * (rect.width / 4)
    setPosition({ x: ux * mag, y: uy * mag })
    setLastMouse({ x: e.clientX, y: e.clientY })
  }

  function getFarPosition() {
    if (!ref.current || !lastMouse) return { x: 0, y: 0 }
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = cx - lastMouse.x
    const dy = cy - lastMouse.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist === 0) return { x: 0, y: 0 }
    return { x: -(dx / dist) * exitForce, y: -(dy / dist) * exitForce }
  }

  const isPrimary = variant === 'primary'

  return (
    <button
      ref={ref}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setIsHovered(true)
        setPosition(getFarPosition())
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        setPosition(getFarPosition())
      }}
      className={[
        'relative inline-flex items-center justify-center rounded-lg font-semibold px-5 py-2.5 text-sm tracking-wide transition-colors z-10 select-none',
        isPrimary ? 'text-[#faf9f5]' : 'text-[#3d3d3a] border border-[#e3dacc]',
        disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
      ].join(' ')}
      {...props}
    >
      {/* Magnetic background span — from cuicui */}
      <span
        className={[
          'absolute inset-0 -z-10 rounded-lg pointer-events-none',
          'before:inset-0 before:absolute before:transition-all before:rounded-lg',
          isPrimary ? 'before:bg-[#c6613f]' : 'before:bg-[#f0eee6]',
          isPrimary
            ? 'before:opacity-100 before:scale-100'
            : isHovered
              ? 'before:opacity-100 before:scale-100 duration-150 ease-out'
              : 'before:opacity-0 before:scale-90 before:duration-300 before:ease-out before:blur-sm',
        ].join(' ')}
        style={{ transform: `translate3D(${position.x}px, ${position.y}px, 0)` }}
      />
      {children}
    </button>
  )
}
