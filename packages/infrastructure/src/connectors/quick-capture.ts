/**
 * Generates the minified JavaScript Bookmarklet that the founder can drag to their browser bookmarks bar.
 * When activated on any webpage (Google Maps, Instagram, LinkedIn, Sulekha, Justdial, etc.), it:
 * 1. Extracts page title and clean canonical URL
 * 2. Scans the visible page for 10-digit Indian phone numbers
 * 3. Captures any user-highlighted text as notes
 * 4. Opens the LeadPulse Quick-Capture drawer in a new tab with the data pre-populated!
 */
export function generateBrowserBookmarkletCode(appBaseUrl = "http://localhost:3000"): string {
  const rawJs = `
(function() {
  var title = document.title || '';
  var url = window.location.href || '';
  var selection = window.getSelection ? window.getSelection().toString() : '';
  
  // Extract phone numbers matching Indian formats (+91, 0, or 10 digits)
  var bodyText = document.body ? document.body.innerText : '';
  var phoneMatches = bodyText.match(/(?:\\+91[\\-\\s]?)?[6-9]\\d{9}/g);
  var phone = phoneMatches && phoneMatches.length > 0 ? phoneMatches[0] : '';
  
  // Clean up title for business name candidate
  var cleanName = title.split('-')[0].split('|')[0].split(':')[0].trim();

  var query = 'name=' + encodeURIComponent(cleanName) +
              '&url=' + encodeURIComponent(url) +
              '&phone=' + encodeURIComponent(phone) +
              '&notes=' + encodeURIComponent(selection);

  var targetUrl = '${appBaseUrl}/dashboard/discovery/quick-capture?' + query;
  window.open(targetUrl, '_blank', 'width=600,height=750,scrollbars=yes');
})();
`.trim();

  // Return as a standard javascript: URI
  return `javascript:${encodeURIComponent(rawJs)}`;
}
