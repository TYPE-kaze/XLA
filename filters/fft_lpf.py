import sys
import numpy as np
import cv2

# Load the input image path and output path from command line arguments
inPath = sys.argv[1]
outPath = sys.argv[2]
filter_size = float(sys.argv[3])
intensity = float(sys.argv[4])

if not (0 <= filter_size <= 1):
    raise ValueError("Filter Size should be a value between 0 and 1.")

if not (0 <= intensity <= 1):
    raise ValueError("Intensity should be a value between 0 and 1.")
# Load the color image
Image = cv2.imread(inPath)  # Read in BGR format

# Split the BGR channels
b, g, r = cv2.split(Image)

# Function to apply low-pass filtering via Fourier Transform
def low_pass_filter(channel, filter_size, intensity = 1):
    # Apply FFT to the channel
    dft = np.fft.fft2(channel)
    dft_shifted = np.fft.fftshift(dft)  # Shift the zero-frequency component to the center

    # Create a low-pass filter mask
    rows, cols = channel.shape
    crow, ccol = rows // 2, cols // 2  # Center of the frequency domain
    mask = np.full((rows, cols), 1 - intensity, dtype= np.float32)
    mask[crow-(int((1-filter_size)*rows/2)):crow+int((1-filter_size)*rows/2), ccol-int((1-filter_size)*cols/2):ccol+int((1-filter_size)*cols/2)] = 1

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
b_filtered = low_pass_filter(b, filter_size, intensity)
g_filtered = low_pass_filter(g, filter_size, intensity)
r_filtered = low_pass_filter(r, filter_size, intensity)

# Merge the filtered channels back into a color image
filtered_image = cv2.merge((b_filtered, g_filtered, r_filtered))

# Save the filtered image
cv2.imwrite(outPath, filtered_image)
