import numpy as np
import cv2
import sys

# Correcting the typo in sys.argv[2]
inPath = sys.argv[1]
outPath = sys.argv[2]

# Read the image in grayscale
img = cv2.imread(inPath, cv2.IMREAD_GRAYSCALE)

# Perform 2D Fourier Transform
dft = np.fft.fft2(img)
dft_shifted = np.fft.fftshift(dft)
dft_shifted_abs = abs(dft_shifted)

# Compute the log spectrum
spectra = np.log(1 + dft_shifted_abs)

# Normalize the spectrum to fit the range [0, 255] for saving
spectra_normalized = cv2.normalize(spectra, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)

# Save the spectrum as an image
cv2.imwrite(outPath, spectra_normalized)

