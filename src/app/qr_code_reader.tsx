'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import BarcodeDetector from 'barcode-detector'
import useAnimationFrame from '@/hooks/useAnimationFrame'

const CANVAS_DIMENSION = 200

interface QrCodeProps {
  onData: (data: string) => void
  onError: (error: Error) => void
}

export default function QrCodeReader({ onData, onError }: QrCodeProps) {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>()
  const [context, setContext] = useState<CanvasRenderingContext2D | null>()
  const [video, setVideo] = useState<HTMLVideoElement | null>()
  const [media, setMedia] = useState<MediaStream>()
  const [data, setData] = useState<string>()

  const requestVideo = useCallback(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        stream.onremovetrack = () => setMedia(undefined)
        setMedia(stream)
      })
      .catch(onError)
  }, [onError])

  useEffect(requestVideo, [requestVideo])
  useEffect(() => {
    if (!media || !video) return
    video.srcObject = media
  }, [media, video])

  useEffect(() => {
    if (!canvas) return
    const context = canvas.getContext('2d', { willReadFrequently: true })!
    setContext(context)
  }, [canvas])

  const detector = useMemo<BarcodeDetector>(
    () => new BarcodeDetector({ formats: ['qr_code'] }),
    [],
  )
  const detect = useCallback(async () => {
    if (!context || !media || !video) return
    context.clearRect(0, 0, CANVAS_DIMENSION, CANVAS_DIMENSION)
    context.drawImage(video, 0, 0, CANVAS_DIMENSION, CANVAS_DIMENSION)
    const image = context.getImageData(0, 0, CANVAS_DIMENSION, CANVAS_DIMENSION)
    try {
      const [barcode] = await detector.detect(image)
      if (barcode) setData(barcode.rawValue)
    } catch (reason) {
      console.warn(reason)
    }
  }, [canvas, detector, media, video])
  useAnimationFrame(detect)

  useEffect(() => {
    if (!data) return
    onData(data)
  }, [data])

  return (
    <>
      <canvas
        hidden
        width={CANVAS_DIMENSION}
        height={CANVAS_DIMENSION}
        ref={setCanvas}
      />
      <video playsInline autoPlay className="w-full h-full" ref={setVideo} />
    </>
  )
}
