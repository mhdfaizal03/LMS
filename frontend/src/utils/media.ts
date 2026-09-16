import { getApiBaseUrl } from '../api/client';

/**
 * Resolves media URLs (images, videos, audio, documents).
 * Handles relative `/uploads/...` paths by prepending the active backend origin,
 * handles Cloudinary URLs, external HTTPS/HTTP links, and blob/data URIs.
 */
export function resolveMediaUrl(url?: string | null): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Return external or blob/data URLs as-is
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:')
  ) {
    return trimmed;
  }

  // Prepend backend host if relative /uploads path
  const apiBase = getApiBaseUrl(); // e.g. https://lms-backend-w9za.onrender.com/api/v1 or /api/v1
  let backendOrigin = '';

  try {
    if (apiBase.startsWith('http')) {
      const parsed = new URL(apiBase);
      backendOrigin = parsed.origin;
    }
  } catch (e) {
    backendOrigin = '';
  }

  if (trimmed.startsWith('/')) {
    return backendOrigin ? `${backendOrigin}${trimmed}` : trimmed;
  }

  return backendOrigin ? `${backendOrigin}/${trimmed}` : `/${trimmed}`;
}

/**
 * Extracts YouTube video ID and returns an embed URL
 */
export function getYouTubeEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  const str = url.trim();

  // youtube.com/watch?v=ID
  const watchMatch = str.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}?autoplay=0&rel=0&modestbranding=1`;
  }

  // youtube.com/shorts/ID
  const shortsMatch = str.match(/youtube\.com\/shorts\/([^"&?\/\s]{11})/i);
  if (shortsMatch && shortsMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${shortsMatch[1]}?autoplay=0&rel=0&modestbranding=1`;
  }

  return null;
}

/**
 * Extracts Vimeo video ID and returns an embed URL
 */
export function getVimeoEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  const str = url.trim();

  const vimeoMatch = str.match(/(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+))/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=0&title=0&byline=0&portrait=0`;
  }

  return null;
}

/**
 * Detects the type of media from URL string or extension
 */
export type MediaType = 'youtube' | 'vimeo' | 'video' | 'audio' | 'image' | 'document' | 'other';

export function detectMediaType(url?: string | null): MediaType {
  if (!url) return 'other';
  const str = url.toLowerCase().trim();

  if (getYouTubeEmbedUrl(str)) return 'youtube';
  if (getVimeoEmbedUrl(str)) return 'vimeo';

  if (
    str.endsWith('.mp4') ||
    str.endsWith('.webm') ||
    str.endsWith('.mov') ||
    str.endsWith('.mkv') ||
    str.endsWith('.avi') ||
    str.endsWith('.m4v') ||
    str.includes('/video/upload/')
  ) {
    return 'video';
  }

  if (
    str.endsWith('.mp3') ||
    str.endsWith('.wav') ||
    str.endsWith('.ogg') ||
    str.endsWith('.aac') ||
    str.endsWith('.m4a') ||
    str.endsWith('.flac') ||
    str.includes('/audio/upload/')
  ) {
    return 'audio';
  }

  if (
    str.endsWith('.jpg') ||
    str.endsWith('.jpeg') ||
    str.endsWith('.png') ||
    str.endsWith('.webp') ||
    str.endsWith('.svg') ||
    str.endsWith('.gif') ||
    str.includes('/image/upload/')
  ) {
    return 'image';
  }

  if (
    str.endsWith('.pdf') ||
    str.endsWith('.doc') ||
    str.endsWith('.docx') ||
    str.endsWith('.ppt') ||
    str.endsWith('.pptx') ||
    str.endsWith('.xls') ||
    str.endsWith('.xlsx') ||
    str.endsWith('.txt') ||
    str.endsWith('.zip')
  ) {
    return 'document';
  }

  return 'video';
}
