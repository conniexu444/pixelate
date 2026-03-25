import { useState, useRef } from 'react'

export default function DropZone({ onImageLoad }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef(null)

  function loadFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      onImageLoad(img)
      URL.revokeObjectURL(url)
    }
    img.src = url
  }

  function handleDragOver(e) {
    e.preventDefault()
    setIsDragOver(true)
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragOver(false)
    loadFile(e.dataTransfer.files[0])
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={[
        'w-full max-w-[560px] rounded-xl border-2 border-dashed px-6 py-14 text-center cursor-pointer',
        'transition-colors duration-200 select-none',
        isDragOver
          ? 'border-[#c6613f] bg-[#ece8df]'
          : 'border-[#e3dacc] bg-[#f0eee6] hover:border-[#c6613f] hover:bg-[#ece8df]',
      ].join(' ')}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => loadFile(e.target.files[0])}
      />
      <div className="text-[2.2rem] mb-3.5 leading-none">📷</div>
      <p className="text-[0.95rem] text-[#5e5d59] m-0">
        <strong className="text-[#c6613f] font-semibold">Click to upload</strong> or drag &amp; drop
      </p>
      <p className="text-[0.8rem] text-[#b0aea5] mt-1.5 mb-0">PNG · JPG · WebP · GIF</p>
    </div>
  )
}
