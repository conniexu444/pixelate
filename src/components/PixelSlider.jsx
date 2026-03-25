// Adapted from cuicui: application-ui/sliders/simple-modern-slider
// Recolored to match the warm Pixelate palette
export default function PixelSlider({ value, onChange, min = 2, max = 64 }) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="relative flex-1">
      <input
        type="range"
        aria-orientation="horizontal"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={[
          'w-full cursor-col-resize appearance-none bg-transparent outline-none transition-all',
          'active:scale-105',
          'disabled:pointer-events-none disabled:opacity-50',
          // webkit thumb
          '[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-1',
          '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full',
          '[&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:bg-[#c6613f]',
          // webkit track
          '[&::-webkit-slider-runnable-track]:h-8 [&::-webkit-slider-runnable-track]:w-full',
          '[&::-webkit-slider-runnable-track]:rounded-xl [&::-webkit-slider-runnable-track]:border-0',
          '[&::-webkit-slider-runnable-track]:bg-[#e3dacc] [&::-webkit-slider-runnable-track]:px-2 [&::-webkit-slider-runnable-track]:py-2',
          'active:[&::-webkit-slider-runnable-track]:bg-[#d8d2c6]',
          // moz thumb
          '[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-1',
          '[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-0',
          '[&::-moz-range-thumb]:bg-[#c6613f]',
          // moz track
          '[&::-moz-range-track]:h-8 [&::-moz-range-track]:w-full',
          '[&::-moz-range-track]:rounded-xl [&::-moz-range-track]:border-0',
          '[&::-moz-range-track]:bg-[#e3dacc] [&::-moz-range-track]:px-2',
          '[&::-moz-range-track]:transition-all active:[&::-moz-range-track]:bg-[#d8d2c6]',
        ].join(' ')}
      />
    </div>
  )
}
