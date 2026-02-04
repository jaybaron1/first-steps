/**
 * Media Tracking Utilities
 * Track video plays, downloads, and other media interactions
 */

import visitorTracking from './visitorTracking';

interface VideoTrackingData {
  videoId?: string;
  videoTitle?: string;
  videoUrl?: string;
  duration?: number;
  currentTime?: number;
  percentPlayed?: number;
}

interface DownloadTrackingData {
  fileName: string;
  fileType: string;
  fileUrl: string;
  fileSize?: number;
}

/**
 * Track video play event
 */
export function trackVideoPlay(data: VideoTrackingData) {
  visitorTracking.trackEvent('video_play', {
    video_id: data.videoId,
    video_title: data.videoTitle,
    video_url: data.videoUrl,
    duration: data.duration,
  });
}

/**
 * Track video progress milestones (25%, 50%, 75%, 100%)
 */
export function trackVideoProgress(data: VideoTrackingData) {
  const percent = data.percentPlayed || 0;
  const milestone = percent >= 100 ? 100 : percent >= 75 ? 75 : percent >= 50 ? 50 : percent >= 25 ? 25 : 0;
  
  if (milestone > 0) {
    visitorTracking.trackEvent('video_progress', {
      video_id: data.videoId,
      video_title: data.videoTitle,
      milestone: milestone,
      current_time: data.currentTime,
      duration: data.duration,
    });
  }
}

/**
 * Track video complete
 */
export function trackVideoComplete(data: VideoTrackingData) {
  visitorTracking.trackEvent('video_complete', {
    video_id: data.videoId,
    video_title: data.videoTitle,
    video_url: data.videoUrl,
    duration: data.duration,
  });
}

/**
 * Track video pause
 */
export function trackVideoPause(data: VideoTrackingData) {
  visitorTracking.trackEvent('video_pause', {
    video_id: data.videoId,
    video_title: data.videoTitle,
    current_time: data.currentTime,
    percent_played: data.percentPlayed,
  });
}

/**
 * Track file download
 */
export function trackDownload(data: DownloadTrackingData) {
  visitorTracking.trackEvent('file_download', {
    file_name: data.fileName,
    file_type: data.fileType,
    file_url: data.fileUrl,
    file_size: data.fileSize,
  });
}

/**
 * Track download link clicks
 * Automatically detects common download file types
 */
export function setupDownloadTracking() {
  const downloadExtensions = [
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
    '.zip', '.rar', '.7z', '.tar', '.gz',
    '.mp3', '.wav', '.mp4', '.mov', '.avi',
    '.jpg', '.jpeg', '.png', '.gif', '.svg',
    '.csv', '.json', '.xml',
  ];

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    
    if (!anchor) return;
    
    const href = anchor.href || '';
    const isDownload = anchor.hasAttribute('download') || 
      downloadExtensions.some(ext => href.toLowerCase().endsWith(ext));
    
    if (isDownload) {
      const fileName = anchor.download || href.split('/').pop() || 'unknown';
      const fileExt = fileName.includes('.') ? fileName.split('.').pop() || '' : '';
      
      trackDownload({
        fileName,
        fileType: fileExt,
        fileUrl: href,
      });
    }
  });
}

/**
 * Hook to track HTML5 video elements
 */
export function setupVideoTracking() {
  const trackedMilestones = new Map<HTMLVideoElement, Set<number>>();

  const handleVideoEvent = (e: Event) => {
    const video = e.target as HTMLVideoElement;
    const videoId = video.id || video.src;
    const videoTitle = video.title || video.getAttribute('data-title') || '';
    
    const data: VideoTrackingData = {
      videoId,
      videoTitle,
      videoUrl: video.src,
      duration: video.duration,
      currentTime: video.currentTime,
      percentPlayed: video.duration ? (video.currentTime / video.duration) * 100 : 0,
    };

    switch (e.type) {
      case 'play':
        trackVideoPlay(data);
        break;
      case 'pause':
        trackVideoPause(data);
        break;
      case 'ended':
        trackVideoComplete(data);
        break;
      case 'timeupdate': {
        const percent = data.percentPlayed || 0;
        const milestones = [25, 50, 75];
        
        if (!trackedMilestones.has(video)) {
          trackedMilestones.set(video, new Set());
        }
        
        const tracked = trackedMilestones.get(video)!;
        for (const milestone of milestones) {
          if (percent >= milestone && !tracked.has(milestone)) {
            tracked.add(milestone);
            trackVideoProgress({ ...data, percentPlayed: milestone });
          }
        }
        break;
      }
    }
  };

  // Observe for dynamically added videos
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLVideoElement) {
          attachVideoListeners(node);
        } else if (node instanceof HTMLElement) {
          node.querySelectorAll('video').forEach(attachVideoListeners);
        }
      });
    });
  });

  const attachVideoListeners = (video: HTMLVideoElement) => {
    video.addEventListener('play', handleVideoEvent);
    video.addEventListener('pause', handleVideoEvent);
    video.addEventListener('ended', handleVideoEvent);
    video.addEventListener('timeupdate', handleVideoEvent);
  };

  // Attach to existing videos
  document.querySelectorAll('video').forEach(attachVideoListeners);
  
  // Watch for new videos
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => observer.disconnect();
}

/**
 * Initialize all media tracking
 */
export function initMediaTracking() {
  if (typeof window === 'undefined') return;
  
  // Skip on admin routes
  if (window.location.pathname.startsWith('/admin')) return;
  
  setupDownloadTracking();
  setupVideoTracking();
}

// Auto-initialize
if (typeof window !== 'undefined') {
  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMediaTracking);
  } else {
    initMediaTracking();
  }
}
