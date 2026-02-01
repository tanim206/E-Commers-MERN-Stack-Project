const publicIdWithoutExtensionFromURL = async (imageUrl) => {
  const pathSegments = imageUrl.split("/");
  // Get the last segment which contains the public ID and extension
  const lastSegment = pathSegments[pathSegments.length - 1];
  const valueWithoutExtension = lastSegment.replace(".jpg", "");
  return valueWithoutExtension;
};

module.exports = { publicIdWithoutExtensionFromURL };
