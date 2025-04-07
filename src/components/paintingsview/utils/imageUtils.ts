/**
 * Utility functions for working with image loading
 */

/**
 * Creates a data URL for a placeholder SVG image
 * @param width - Width of the placeholder
 * @param height - Height of the placeholder
 * @param text - Optional text to display on the placeholder
 * @returns SVG data URL string
 */
const createPlaceholderSVG = (
  width: number,
  height: number,
  text: string = "No Image Available"
): string => {
  // Create an SVG with text centered in it
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f8f8f8"/>
      <rect width="100%" height="100%" fill="#e0e0e0" opacity="0.5"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" dominant-baseline="middle" fill="#666666">${text}</text>
      <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" dominant-baseline="middle" fill="#888888">🖼️</text>
    </svg>
  `;

  // Convert SVG to a data URL
  const encodedSVG = encodeURIComponent(svg);
  return `data:image/svg+xml;charset=UTF-8,${encodedSVG}`;
};

/**
 * Gets a Cloudinary URL for a painting image
 * @param imageFileName - The image file name
 * @param width - Desired width in pixels
 * @param useSquare - Whether to use square version
 * @returns URL string for the Cloudinary image
 */
export const getImageUrl = (
  imageFileName: string | number | undefined,
  width: number,
  useSquare: boolean = false
): string => {
  if (!imageFileName) {
    // Use local SVG placeholder instead of external service
    return createPlaceholderSVG(width, Math.floor(width * 0.7));
  }

  let fileName =
    typeof imageFileName === "number"
      ? imageFileName.toString()
      : imageFileName;
  
    const formattedFileName = String(fileName).padStart(6, "0");

  const pathSegment = useSquare ? "square/" : "full/";

  return `/art-images/paintings/${pathSegment}${formattedFileName}.jpg`;
};

/**
 * Creates an image loading handler that tries multiple sources before using a placeholder
 * @param width - Width for the placeholder
 * @returns An onError handler function for img elements
 */
export const createImageErrorHandler = (width: number) => {
  return (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    if (!target) return;

    const imageFileName = target.src.split("/").pop();

    // Try regular version if square version fails
    if (target.src.includes("/square/")) {
      const nonSquareUrl = getImageUrl(imageFileName, width, false);

      // Test if non-square version will load
      const testImg = new Image();
      testImg.onerror = () => {
        // Both versions failed, use SVG placeholder
        if (target) {
          target.src = createPlaceholderSVG(width, Math.floor(width * 0.7));
          target.onerror = null; // Prevent further error handling
        }
      };
      testImg.onload = () => {
        // Non-square version works
        if (target) {
          target.src = nonSquareUrl;
        }
      };
      testImg.src = nonSquareUrl;
    } else {
      // Already tried regular version, use SVG placeholder
      target.src = createPlaceholderSVG(width, Math.floor(width * 0.7));
      target.onerror = null; // Prevent further error handling
    }
  };
};
