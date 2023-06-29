import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import BarcodeDetector from 'barcode-detector'
import assert from 'assert'
import useAnimationFrame from '@/hooks/useAnimationFrame'
import styles from './scan.module.scss'

const DIMENSION = 480

interface QrCodeProps {
  onData: (data: string) => void
  onError: (error: unknown) => void
}

export default function QrCodeReader({ onData, onError }: QrCodeProps) {
  const video = useRef<HTMLVideoElement | null>(null)
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const detector = useMemo<BarcodeDetector>(
    () => new BarcodeDetector({ formats: ['qr_code'] }),
    [],
  )

  /**
   * Requests a video stream from the user's camera.
   * On success, sets {@link video.current!.srcObject} to the video stream.
   */
  const requestMedia = useCallback(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        assert(video.current, 'video ref is null')
        video.current.srcObject = stream
      })
      .catch(onError)
  }, [onError])

  /**
   * Detects QR codes in the {@link video.current!.srcObject} stream.
   * On success, calls {@link onData} with the code's rawValue.
   */
  const detect = useCallback(async () => {
    assert(video.current, 'video ref is null')
    assert(canvas.current, 'canvas ref is null')
    const context = canvas.current.getContext('2d', {
      willReadFrequently: true,
    })
    assert(context, 'canvas context is null')
    context.clearRect(0, 0, DIMENSION, DIMENSION)
    context.drawImage(video.current, 0, 0, DIMENSION, DIMENSION)
    const image = context.getImageData(0, 0, DIMENSION, DIMENSION)
    try {
      const [barcode] = await detector.detect(image)
      if (barcode) onData(barcode.rawValue)
    } catch (error) {
      onError(error)
    }
  }, [onData, onError, detector])

  useEffect(requestMedia, [requestMedia])
  useAnimationFrame(detect)

  return (
    <>
      <canvas hidden ref={canvas} width={DIMENSION} height={DIMENSION} />
      <video
        playsInline
        autoPlay
        ref={video}
        width={DIMENSION}
        height={DIMENSION}
        className={styles.video}
      />
    </>
  )
}
