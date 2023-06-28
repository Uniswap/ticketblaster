declare module 'barcode-detector'

interface DetectedBarcodes {

}

interface BarcodeDetector {
    detect(image: ImageData): Promise<DetectedBarcodes>;
}

interface BarcodeDetectorOptions {
    formats?: ['qr_code'];
}

declare var BarcodeDetector: {
    prototype: BarcodeDetector;
    new(BarcodeDetectorOptions): BarcodeDetector;
};

