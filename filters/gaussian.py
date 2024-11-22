import sys
import cv2

# Paths
inPath = sys.argv[1]
outPath = sys.argv[2]

# sizw of the kernel
w = int(sys.argv[3])
h = int(sys.argv[4])
d = int(sys.argv[5])
# Load the input image
image = cv2.imread(inPath)

# Process
out = cv2.GaussianBlur(image,(w,h),d)

# finish procesing, write to file
cv2.imwrite(outPath, out)