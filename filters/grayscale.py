import sys
import cv2

# Paths
inPath = sys.argv[1]
outPath = sys.argv[2]

# Params (optional)

# Load the input image
image = cv2.imread(inPath)

# Process the image
gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# finish procesing, write to file
cv2.imwrite(outPath, gray_image)