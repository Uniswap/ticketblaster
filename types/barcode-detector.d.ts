declare module 'barcode-detector'

interface DetectedBarcode {
  rawValue: string
}

interface BarcodeDetector {
  detect(image: ImageData): Promise<DetectedBarcode[]>
}

interface BarcodeDetectorOptions {
  formats?: ['qr_code']
}

declare var BarcodeDetector: {
  prototype: BarcodeDetector
  new (BarcodeDetectorOptions): BarcodeDetector
}
