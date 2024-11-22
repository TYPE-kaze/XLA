import sys
import cv2

# Paths
inPath = sys.argv[1]
outPath = sys.argv[2]

# sizw of the kernel
s = int(sys.argv[3])

# Load the input image
image = cv2.imread(inPath)
#Blue
out = cv2.medianBlur(image, s)

# finish procesing, write to file
cv2.imwrite(outPath, out)