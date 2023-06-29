import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import BarcodeDetector from 'barcode-detector'

const VIDEO_DIMENSION = 480
const SCAN_DIMENSION = 440
const SCAN_RATE = 200

interface QrCodeProps {
  onData: (data: string) => void
  onError: (error: unknown) => void
}

export default function QrCodeReader({ onData, onError }: QrCodeProps) {
  const video = useRef<HTMLVideoElement | null>(null)
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const detector = useMemo(
    () => new BarcodeDetector({ formats: ['qr_code'] }),
    [],
  )

  const scan = useCallback(async () => {
    if (
      !video.current ||
      !canvas.current ||
      !navigator.mediaDevices ||
      !detector
    )
      return

    const context = canvas.current.getContext('2d')
    if (!context) return

    context.drawImage(
      video.current,
      (VIDEO_DIMENSION - SCAN_DIMENSION) / 2,
      (VIDEO_DIMENSION - SCAN_DIMENSION) / 2,
      SCAN_DIMENSION,
      SCAN_DIMENSION,
      0,
      0,
      SCAN_DIMENSION,
      SCAN_DIMENSION,
    )

    try {
      const imageData = context.getImageData(
        0,
        0,
        SCAN_DIMENSION,
        SCAN_DIMENSION,
      )
      const [barcode] = await detector.detect(imageData)
      if (barcode) onData(barcode.rawValue)
    } catch (error) {
      onError(error)
    }
  }, [onData, onError, detector])

  useEffect(() => {
    if (!navigator.mediaDevices || !video.current) return

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: VIDEO_DIMENSION, height: VIDEO_DIMENSION },
        })
        if (video.current) video.current.srcObject = stream
      } catch (error) {
        onError(error)
      }
    }

    startVideo()

    return () => {
      if (video.current && video.current.srcObject) {
        const tracks = (video.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [onError])

  useEffect(() => {
    const intervalId = setInterval(scan, SCAN_RATE)
    return () => clearInterval(intervalId)
  }, [scan])

  return (
    <>
      <canvas
        hidden
        ref={canvas}
        width={SCAN_DIMENSION}
        height={SCAN_DIMENSION}
      />
      <video
        playsInline
        autoPlay
        ref={video}
        width={VIDEO_DIMENSION}
        height={VIDEO_DIMENSION}
      />
    </>
  )
}
