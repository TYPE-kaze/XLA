import sys
import numpy as np
import cv2
import math

# Load the input image path and output path from command line arguments
inPath = sys.argv[1]
outPath = sys.argv[2]
sigma = int(sys.argv[3])

# # Load the color image
Image = cv2.imread(inPath) # Read in BGR format

# Split the BGR channels
b, g, r = cv2.split(Image)

# Function to apply low-pass filtering via Fourier Transform
def gaussian_pass_filter(channel,sigma=50):
    # Apply FFT to the channel
    dft = np.fft.fft2(channel)
    dft_shifted = np.fft.fftshift(dft)  # Shift the zero-frequency component to the center
    # Create a low-pass filter mask
    rows, cols = dft.shape
    crow, ccol = rows // 2, cols // 2  # Center of the frequency domain
    y, x = np.ogrid[:rows, :cols]
    mask = np.exp(-((y - crow) ** 2 + (x - ccol) ** 2) / (2 * sigma ** 2))

    # Apply the mask to the shifted frequency domain
    filtered_dft = dft_shifted * mask

    # Apply Inverse FFT to get back to the spatial domain
    dft_ishift = np.fft.ifftshift(filtered_dft)
    channel_filtered = np.fft.ifft2(dft_ishift)
    channel_filtered = np.abs(channel_filtered)  # Convert complex values to magnitude

    # Normalize the filtered channel to 0-255
    channel_filtered = cv2.normalize(channel_filtered, None, 0, 255, cv2.NORM_MINMAX)
    return np.uint8(channel_filtered)

# Apply the low-pass filter to each channel
b_filtered = gaussian_pass_filter(b,sigma)
g_filtered = gaussian_pass_filter(g,sigma)
r_filtered = gaussian_pass_filter(r,sigma)

# Merge the filtered channels back into a color image
filtered_image = cv2.merge((b_filtered, g_filtered, r_filtered))

# Save the filtered image
cv2.imwrite(outPath, filtered_image)
