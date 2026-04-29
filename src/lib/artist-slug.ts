export function toArtistSlug(artistName: string): string {
  return artistName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
