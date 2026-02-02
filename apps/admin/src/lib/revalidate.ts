/**
 * Revalidates a specific tag by calling the internal revalidation API route.
 * This is useful for triggering on-demand revalidation from the client side.
 *
 * @param tag The cache tag to revalidate
 */
export async function revalidateTag(tag: string) {
  try {
    const response = await fetch("/api/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tag }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Failed to revalidate tag:", tag, errorData);
      return { success: false, error: errorData };
    }

    return { success: true };
  } catch (error) {
    console.error("Error calling revalidate API:", error);
    return { success: false, error };
  }
}
