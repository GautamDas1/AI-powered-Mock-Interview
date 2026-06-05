import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../lib/firebase';

/**
 * Tracks page views on every route change for GA4.
 * SPAs don't fire page_view automatically — this component
 * listens to React Router location changes and logs them.
 */
export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    logEvent(analytics, 'page_view', {
      page_path: location.pathname,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [location]);

  return null; // renders nothing — purely a side-effect component
}
