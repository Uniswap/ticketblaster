import { useCallback, useEffect, useMemo, useRef } from 'react'
import BarcodeDetector from 'barcode-detector'
import assert from 'assert'
import useAnimationFrame from '@/hooks/useAnimationFrame'
import styles from './scan.module.scss'
import { RefreshCw } from 'react-feather'
import useSupportsEnvironmentCamera from './useSupportsEnvironmentCamera'

const SCAN_LINE_SIZE = 512

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
    const srcObject = video.current.srcObject as MediaStream | null
    if (!srcObject) return

    const dimensions = srcObject?.getVideoTracks()[0].getSettings()

    if (!dimensions) return
    const { width, height } = dimensions
    assert(width && height, 'video has no dimensions')
    context.clearRect(0, 0, SCAN_LINE_SIZE, SCAN_LINE_SIZE)
    context.drawImage(
      video.current,
      0,
      0,
      width,
      height,
      0,
      0,
      SCAN_LINE_SIZE,
      SCAN_LINE_SIZE,
    )
    const image = context.getImageData(0, 0, SCAN_LINE_SIZE, SCAN_LINE_SIZE)
    try {
      const [barcode] = await detector.detect(image)
      if (barcode) onData(barcode.rawValue)
    } catch (error) {
      onError(error)
    }
  }, [detector, onData, onError])

  const supportsEnvironment = useSupportsEnvironmentCamera()

  const toggleUserFacingOrEnvironmentCamera = useCallback(() => {
    assert(video.current, 'video ref is null')
    const stream = video.current.srcObject as MediaStream | null
    if (!stream || !supportsEnvironment) return
    const track = stream.getVideoTracks()[0]
    const facingMode = track.getSettings().facingMode
    track.applyConstraints({
      facingMode: facingMode === 'user' ? 'environment' : 'user',
    })
  }, [])

  useEffect(requestMedia, [requestMedia])
  useAnimationFrame(detect)

  return (
    <>
      <canvas
        hidden
        ref={canvas}
        width={SCAN_LINE_SIZE}
        height={SCAN_LINE_SIZE}
      />
      <video playsInline autoPlay ref={video} className={styles.video} />
      {supportsEnvironment && (
        <RefreshCw
          className={styles.switchView}
          onClick={toggleUserFacingOrEnvironmentCamera}
        />
      )}
    </>
  )
}
