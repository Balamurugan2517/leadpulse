import { Business, WebsiteAudit, LeadScore } from "@leadpulse/contracts";

export interface MessageDraftResult {
  channel: "WHATSAPP" | "EMAIL";
  recipientTarget: string;
  subject?: string;
  bodyText: string;
  whatsappDeepLink?: string;
  previewUrl: string;
  evidenceSummary: string;
}

export function generateOutreachDrafts(
  business: Business,
  audit: WebsiteAudit | null,
  score: LeadScore,
  appBaseUrl = "https://yourdomain.com"
): MessageDraftResult[] {
  const drafts: MessageDraftResult[] = [];
  const locality = business.city || "Chennai";
  const category = business.category || "business";
  const name = business.name;

  // Generate clean slug for preview URL
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const cleanPhone = (business.whatsappNumber || business.phone || "").replace(/[^0-9]/g, "");
  const queryParams = new URLSearchParams({
    name,
    category,
    city: locality,
    phone: business.whatsappNumber || business.phone || "",
  }).toString();

  const previewUrl = `${appBaseUrl}/preview/${slug}?${queryParams}`;

  // Identify core defect
  let defectEvidence = "";
  if (!audit || (score.needFitScore >= 35 && score.scoreReasons.some((r) => r.includes("No official")))) {
    defectEvidence = "NO_WEBSITE";
  } else if (audit.sslValid === false) {
    defectEvidence = "EXPIRED_SSL";
  } else if (audit.isMobileResponsive === false || (audit.lighthousePerformance && audit.lighthousePerformance < 45)) {
    defectEvidence = "SLOW_MOBILE";
  } else {
    defectEvidence = "GENERAL_IMPROVEMENT";
  }

  // --- 1. WhatsApp Draft with Instant Live Prototype Link ---
  const whatsappRecipient = business.whatsappNumber || business.phone || "";
  let whatsappBody = "";

  switch (defectEvidence) {
    case "NO_WEBSITE":
      whatsappBody = `Hi ${name} team, I noticed you have great reviews in ${locality} but no official website. I drafted a free live preview website for you here: ${previewUrl} - it loads in 1 sec and includes 1-click WhatsApp booking for your clients. Take a look and let me know your thoughts!`;
      break;

    case "EXPIRED_SSL":
      whatsappBody = `Hello ${name} team, your current site is showing an expired security warning (SSL). I prepared a clean, secure prototype for your business here: ${previewUrl}. We can get this live on your official domain today. Let me know if you would like me to help!`;
      break;

    case "SLOW_MOBILE":
      whatsappBody = `Hi ${name} team, I checked your site and noticed it takes over 5s to load on phones. I created a mobile-optimized prototype for ${name} that opens instantly: ${previewUrl}. Would you like to review how this boosts incoming client calls?`;
      break;

    default:
      whatsappBody = `Hi ${name} team, I put together a modern digital prototype for ${name} in ${locality}: ${previewUrl}. It includes direct WhatsApp booking and mobile optimization. Would you be open to a quick 5-min chat this week?`;
      break;
  }

  const whatsappDeepLink = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappBody)}`
    : undefined;

  drafts.push({
    channel: "WHATSAPP",
    recipientTarget: whatsappRecipient,
    bodyText: whatsappBody,
    whatsappDeepLink,
    previewUrl,
    evidenceSummary: defectEvidence,
  });

  // --- 2. Email Draft with Prototype Link ---
  if (business.email) {
    let emailSubject = "";
    let emailBody = "";

    switch (defectEvidence) {
      case "NO_WEBSITE":
        emailSubject = `Live website prototype created for ${name} (${locality})`;
        emailBody = `Dear ${name} Team,\n\nI was researching prominent ${category} businesses in ${locality} and noticed you don't currently have an official website for direct bookings.\n\nI took a few minutes to create an interactive, mobile-friendly prototype for your business:\n👉 ${previewUrl}\n\nIt includes your phone number, review highlights, and a 1-click WhatsApp appointment button.\n\nWould you have 10 minutes this Thursday for a brief call to discuss putting this live under your own domain?\n\nBest regards,\n[Your Name]\nLeadPulse Digital Services`;
        break;

      case "EXPIRED_SSL":
        emailSubject = `Security alert + Live secure prototype for ${name}`;
        emailBody = `Dear ${name} Team,\n\nYour current website is displaying an expired SSL certificate warning to visitors.\n\nI have generated a clean, fully secure preview to show how your brand can look:\n👉 ${previewUrl}\n\nWe can easily remediate your certificate and hosting to restore client confidence.\n\nPlease let me know if you would like me to assist.\n\nBest regards,\n[Your Name]`;
        break;

      default:
        emailSubject = `Digital presence upgrade & live prototype for ${name}`;
        emailBody = `Dear ${name} Team,\n\nI analyzed your online presence in ${locality} and put together an interactive prototype demonstrating high-speed mobile performance:\n👉 ${previewUrl}\n\nWould you be open to a quick 5-minute introductory chat this week?\n\nBest regards,\n[Your Name]`;
        break;
    }

    drafts.push({
      channel: "EMAIL",
      recipientTarget: business.email,
      subject: emailSubject,
      bodyText: emailBody,
      previewUrl,
      evidenceSummary: defectEvidence,
    });
  }

  return drafts;
}
