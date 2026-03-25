import { useState, useRef } from 'react'
import DropZone from './components/DropZone'
import PixelSlider from './components/PixelSlider'
import MagneticBtn from './components/MagneticBtn'

export default function App() {
  const [hasImage, setHasImage] = useState(false)
  const [hasOutput, setHasOutput] = useState(false)
  const [pixelSize, setPixelSize] = useState(12)

  const imageRef = useRef(null)
  const pixelSizeRef = useRef(12)
  const sourceCanvasRef = useRef(null)
  const outputCanvasRef = useRef(null)
  const hiddenCanvasRef = useRef(null)

  function runPixelate(img, blockSize) {
    const W = img.naturalWidth
    const H = img.naturalHeight

    const hidden = hiddenCanvasRef.current
    hidden.width = W
    hidden.height = H
    const hCtx = hidden.getContext('2d')
    hCtx.drawImage(img, 0, 0)

    const output = outputCanvasRef.current
    output.width = W
    output.height = H
    const oCtx = output.getContext('2d')

    for (let y = 0; y < H; y += blockSize) {
      for (let x = 0; x < W; x += blockSize) {
        const bw = Math.min(blockSize, W - x)
        const bh = Math.min(blockSize, H - y)
        const data = hCtx.getImageData(x, y, bw, bh).data
        let r = 0, g = 0, b = 0, a = 0
        const n = bw * bh
        for (let i = 0; i < data.length; i += 4) {
          r += data[i]; g += data[i + 1]; b += data[i + 2]; a += data[i + 3]
        }
        oCtx.fillStyle = `rgba(${Math.round(r/n)},${Math.round(g/n)},${Math.round(b/n)},${Math.round(a/n)/255})`
        oCtx.fillRect(x, y, bw, bh)
      }
    }
    setHasOutput(true)
  }

  function handleImageLoad(img) {
    imageRef.current = img
    setHasImage(true)
    setHasOutput(false)

    const canvas = sourceCanvasRef.current
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    canvas.getContext('2d').drawImage(img, 0, 0)

    runPixelate(img, pixelSizeRef.current)
  }

  function handleSliderChange(val) {
    setPixelSize(val)
    pixelSizeRef.current = val
    if (imageRef.current) runPixelate(imageRef.current, val)
  }

  function handleDownload() {
    outputCanvasRef.current?.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'pixel-art.png'
      a.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  return (
    <div className="min-h-screen bg-[#faf9f5] font-sans text-[#141413]">
      <main className="max-w-[900px] mx-auto px-6 py-14 flex flex-col items-center">

        <header className="text-center mb-10">
          <h1 className="font-serif text-[2.6rem] font-normal tracking-tight mb-1.5 text-[#141413]">
            Pixelate
          </h1>
          <p className="text-[#5e5d59] text-[0.95rem] m-0">
            Transform any image into pixel art
          </p>
        </header>

        <DropZone onImageLoad={handleImageLoad} />

        <div className="w-full max-w-[560px] mt-7 flex items-center gap-4">
          <span className="text-[0.82rem] font-medium text-[#5e5d59] uppercase tracking-widest shrink-0">
            Pixel size
          </span>
          <PixelSlider value={pixelSize} onChange={handleSliderChange} min={2} max={64} />
          <span className="text-[0.82rem] font-semibold text-[#141413] w-10 text-right shrink-0">
            {pixelSize}px
          </span>
        </div>

        <div className="w-full max-w-[560px] mt-5 flex gap-2.5">
          <MagneticBtn
            variant="primary"
            disabled={!hasImage}
            onClick={() => runPixelate(imageRef.current, pixelSizeRef.current)}
          >
            Pixelate
          </MagneticBtn>
          <MagneticBtn
            variant="secondary"
            disabled={!hasOutput}
            onClick={handleDownload}
          >
            Download
          </MagneticBtn>
        </div>

        {hasImage && (
          <>
            <hr className="w-full border-0 border-t border-[#e8e6dc] my-9" />
            <div className="w-full flex gap-5 justify-center flex-wrap">
              <div className="flex-1 min-w-[260px] max-w-[420px]">
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#b0aea5] mb-2.5">
                  Original
                </div>
                <canvas
                  ref={sourceCanvasRef}
                  className="w-full rounded-xl border border-[#e8e6dc] block"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
              <div className="flex-1 min-w-[260px] max-w-[420px]">
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#b0aea5] mb-2.5">
                  Pixel art
                </div>
                <canvas
                  ref={outputCanvasRef}
                  className="w-full rounded-xl border border-[#e8e6dc] block"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            </div>
          </>
        )}

        <canvas ref={hiddenCanvasRef} className="hidden" />
      </main>
    </div>
  )
}
