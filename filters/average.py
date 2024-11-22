import sys
import cv2

# Paths
inPath = sys.argv[1]
outPath = sys.argv[2]

# size of the kernel
w = int(sys.argv[3])
h = int(sys.argv[4])

# Load the input image
image = cv2.imread(inPath)
#Blue
blur = cv2.blur(image,(w,h))

# finish procesing, write to file
cv2.imwrite(outPath, blur)