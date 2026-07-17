import cv2
import matplotlib.pyplot as plt

# Load image in grayscale
image = cv2.imread("sample.jpg", cv2.IMREAD_GRAYSCALE)

# Check if image is loaded
if image is None:
    print("Error: sample.jpg not found!")
    exit()

# Sobel Edge Detection
sobel_x = cv2.Sobel(image, cv2.CV_64F, 1, 0, ksize=3)
sobel_y = cv2.Sobel(image, cv2.CV_64F, 0, 1, ksize=3)

# Combine X and Y edges
sobel_combined = cv2.magnitude(sobel_x, sobel_y)

# Display images
plt.figure(figsize=(10, 6))

# Original Image
plt.subplot(2, 2, 1)
plt.imshow(image, cmap='gray')
plt.title('Original Image')
plt.axis('off')

# Sobel X
plt.subplot(2, 2, 2)
plt.imshow(sobel_x, cmap='gray')
plt.title('Sobel X')
plt.axis('off')

# Sobel Y
plt.subplot(2, 2, 3)
plt.imshow(sobel_y, cmap='gray')
plt.title('Sobel Y')
plt.axis('off')

# Combined Edge
plt.subplot(2, 2, 4)
plt.imshow(sobel_combined, cmap='gray')
plt.title('Combined Edge')
plt.axis('off')

plt.tight_layout()
plt.show()
