import { useEffect, useState } from 'react'

function useSupportsEnvironmentCamera() {
  const [supportsEnvironmentCamera, setSupportsEnvironmentCamera] =
    useState(false)

  useEffect(() => {
    const checkCameraSupport = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
          },
        })

        if (stream) {
          // Check if there is an active track that's using the environment-facing camera.
          const usingEnvironmentCamera = stream
            .getVideoTracks()
            .some((track) => track.getSettings().facingMode === 'environment')

          // Stop all tracks to release the camera after we're done.
          stream.getTracks().forEach((track) => track.stop())

          setSupportsEnvironmentCamera(usingEnvironmentCamera)
        }
      } catch (err) {
        console.error(err)
      }
    }

    checkCameraSupport()
  }, [])

  return supportsEnvironmentCamera
}

export default useSupportsEnvironmentCamera
