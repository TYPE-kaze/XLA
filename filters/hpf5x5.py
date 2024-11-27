import sys
import cv2
import numpy as np

# Paths
inPath = sys.argv[1]
outPath = sys.argv[2]

# Load the input image
image = cv2.imread(inPath)
# The 3x3 kernel
kernel = np.array([[-1, -1, -1, -1, -1],
                   [-1,  1,  2,  1, -1],
                   [-1,  2,  4,  2, -1],
                   [-1,  1,  2,  1, -1],
                   [-1, -1, -1, -1, -1]])

out = cv2.filter2D(image, -1, kernel)
#Blue

# finish procesing, write to file
cv2.imwrite(outPath, out)