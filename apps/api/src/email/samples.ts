import * as t from './templates.js'

export function sampleEmails(siteUrl: string) {
  const ctx = { siteUrl }
  return {
    'application-received': t.applicationReceived(ctx, {
      applicantName: 'Nusrat Jahan',
      jobTitle: 'Senior Merchandiser',
      department: 'Merchandising',
      location: 'Dhaka (Tejgaon)',
      jobType: 'Full-time',
      referenceId: 'DIG-2026-00142',
      submittedAt: '3 Oct 2026, 10:42 PM',
    }),
    'talent-pool': t.talentPoolAcknowledgement(ctx, {
      applicantName: 'Rafiul Islam',
      interests: 'Technology, Supply Chain · Dhaka, Gazipur',
      referenceId: 'DIG-TP-00087',
    }),
    'hr-invite': t.hrInvite(ctx, {
      name: 'Farhana Akter',
      email: 'farhana@dekkoisho.com',
      role: 'Recruiter',
      invitedBy: 'Ekram',
      setPasswordUrl: `${siteUrl}/hr/admin/set-password?code=sample`,
    }),
    'password-reset': t.passwordReset(ctx, {
      name: 'Farhana Akter',
      resetUrl: `${siteUrl}/hr/admin/reset-password?code=sample`,
    }),
    'daily-digest': t.newApplicationsDigest(ctx, {
      recipientName: 'Farhana Akter',
      dateLabel: '3 Oct 2026',
      totalNew: 23,
      openCirculars: 7,
      closingSoon: 2,
      byCircular: [
        { jobTitle: 'Senior Merchandiser', department: 'Merchandising', newCount: 11, url: `${siteUrl}/hr/admin/circulars/1` },
        { jobTitle: 'Industrial Engineer', department: 'Manufacturing', newCount: 7, url: `${siteUrl}/hr/admin/circulars/2` },
        { jobTitle: 'Talent pool', department: 'All', newCount: 5, url: `${siteUrl}/hr/admin/circulars/3` },
      ],
    }),
    'circular-closing': t.circularClosing(ctx, {
      ownerName: 'Farhana Akter',
      jobTitle: 'Senior Merchandiser',
      deadline: '6 Oct 2026',
      applications: 84,
      shortlisted: 9,
      state: 'closing_soon',
      manageUrl: `${siteUrl}/hr/admin/circulars/1`,
    }),
  }
}
