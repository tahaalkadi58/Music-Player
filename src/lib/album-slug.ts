export function toAlbumSlug(albumName: string): string {
  return albumName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
