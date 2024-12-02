import sys
import numpy as np
import cv2

# Load the input image path and output path from command line arguments
inPath = sys.argv[1]
outPath = sys.argv[2]
low_cutoff = int(sys.argv[3])  # Inner radius of the band (low-pass cutoff)
high_cutoff = int(sys.argv[4])  # Outer radius of the band (high-pass cutoff)
intensity = float(sys.argv[5])

if not (0 <= intensity <= 1):
    raise ValueError("Intensity should be a value between 0 and 1.")
if not (low_cutoff < high_cutoff):
    raise ValueError("low_cutoff should be less than high_cutoff.")

# Load the color image
Image = cv2.imread(inPath)  # Read in BGR format

# Split the BGR channels
b, g, r = cv2.split(Image)

# Function to apply band-pass filtering via Fourier Transform
def band_pass_filter(channel, low_cutoff, high_cutoff, intensity=1):
    # Apply FFT to the channel
    dft = np.fft.fft2(channel)
    dft_shifted = np.fft.fftshift(dft)  # Shift the zero-frequency component to the center

    # Create a band-pass filter mask
    rows, cols = channel.shape
    crow, ccol = rows // 2, cols // 2  # Center of the frequency domain
    mask = np.zeros((rows, cols), dtype=np.float32)
    for x in range(rows):
        for y in range(cols):
            distance = np.sqrt((x - crow) ** 2 + (y - ccol) ** 2)
            if low_cutoff <= distance <= high_cutoff:
                mask[x, y] = intensity

    # Apply the mask to the shifted frequency domain
    filtered_dft = dft_shifted * mask

    # Apply Inverse FFT to get back to the spatial domain
    dft_ishift = np.fft.ifftshift(filtered_dft)
    channel_filtered = np.fft.ifft2(dft_ishift)
    channel_filtered = np.abs(channel_filtered)  # Convert complex values to magnitude

    # Normalize the filtered channel to 0-255
    channel_filtered = cv2.normalize(channel_filtered, None, 0, 255, cv2.NORM_MINMAX)
    return np.uint8(channel_filtered)

# Apply the band-pass filter to each channel
b_filtered = band_pass_filter(b, low_cutoff, high_cutoff, intensity)
g_filtered = band_pass_filter(g, low_cutoff, high_cutoff, intensity)
r_filtered = band_pass_filter(r, low_cutoff, high_cutoff, intensity)

# Merge the filtered channels back into a color image
filtered_image = cv2.merge((b_filtered, g_filtered, r_filtered))

# Save the filtered image
cv2.imwrite(outPath, filtered_image)
