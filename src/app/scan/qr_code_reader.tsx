'use client'

import { useCallback, useEffect, useMemo, useState } from "react"
import BarcodeDetector from "barcode-detector"

interface QrCodeProps {
  onData: (data: string) => void
  onError: (error: Error) => void
}

export default function QrCodeReader({ onData, onError }: QrCodeProps) {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>()
  const [video, setVideo] = useState<HTMLVideoElement | null>()
  const [media, setMedia] = useState<MediaStream>()

  const requestVideo = useCallback(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      stream.onremovetrack =  () => setMedia(undefined)
      setMedia(stream)
    }).catch(onError)
  }, [onError])

  useEffect(requestVideo, [requestVideo])
  useEffect(() => {
    if (!media || !video) return
    video.srcObject = media
  }, [media, video])

  const detector = useMemo<BarcodeDetector>(() => new BarcodeDetector({ formats: ["qr_code"] }), [])

  useEffect(() => {
    if (!canvas || !media || !video) return
    const context = canvas.getContext("2d")!
    context.clearRect(0, 0, 400, 400)
    context.drawImage(video, 0, 0, 400, 400)
    const image = context.getImageData(0, 0, 400, 400)
    detector.detect(image).then((barcodes) => {
      console.log(barcodes)
    }).catch((reason) => {
      console.warn(reason)
    })
  }, [canvas, detector, media, video])

  return (
    <>
      <canvas hidden ref={setCanvas} />
      <video playsInline autoPlay className="w-full h-full" ref={setVideo} />
    </>
  )
}
