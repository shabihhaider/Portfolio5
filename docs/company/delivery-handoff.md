# Delivery & Handoff Checklist — Shabih.

> Complete every item on this checklist before telling a client a project is ready for review or final delivery.

---

## Pre-Delivery QA

### General (All Projects)
- [ ] All features in the SOW are implemented and working
- [ ] Tested on mobile (iOS Safari, Android Chrome)
- [ ] Tested on desktop (Chrome, Firefox, Safari, Edge)
- [ ] No broken links
- [ ] All forms submit successfully and notifications work
- [ ] No console errors in browser developer tools
- [ ] Images are optimized (under 200KB where possible, WebP preferred)
- [ ] Page load speed checked (Lighthouse score above 80 on Performance)
- [ ] Accessibility basics: images have alt text, buttons have labels

### Landing Pages (Next.js)
- [ ] Deployed to Vercel (or agreed host)
- [ ] Custom domain connected (if in scope)
- [ ] SSL/HTTPS active
- [ ] Meta title and description set correctly
- [ ] OG image set for social sharing
- [ ] Contact form tested end-to-end (submit → email received)
- [ ] All animations work on mobile without performance issues

### WordPress
- [ ] Admin credentials documented and ready to hand over
- [ ] All plugins updated
- [ ] Test user account created (non-admin) to verify frontend experience
- [ ] Backup created before handoff
- [ ] Client shown how to edit content (brief video or Loom recording if helpful)

### AI Integrations
- [ ] API keys tested and working in production environment
- [ ] Rate limits and error handling implemented
- [ ] Client's own API keys set up (not using your personal keys in production)
- [ ] Token/cost implications documented for client
- [ ] Edge cases tested (empty input, long input, API timeout)

### Custom Development
- [ ] Environment variables documented in a secure handoff note
- [ ] Database seeded with any necessary initial data
- [ ] README written with setup instructions (for client's dev team if applicable)
- [ ] Deployment pipeline verified (CI/CD working)
- [ ] All third-party integrations tested in production mode (not sandbox)

---

## Credentials Handoff

Only hand these over **after final payment is confirmed**:

- [ ] Hosting/Vercel access (add client as member or transfer project)
- [ ] Domain registrar access (if managed by you)
- [ ] Database credentials (if client manages their own DB)
- [ ] API keys (documented securely — never sent in plaintext over chat)
- [ ] GitHub/repo access (add client as collaborator or transfer repo)
- [ ] CMS admin login (WordPress, etc.)

**How to send credentials:** Use a password manager share link (1Password, Bitwarden) or an encrypted message. Never paste passwords into Upwork messages, email body, or WhatsApp in plain text.

---

## Final Delivery Message Template

```
Hi [Name],

[Project Name] is ready for your review! 🎉

Here's what was delivered:
- [Deliverable 1]
- [Deliverable 2]
- [Deliverable 3]

👉 Live link: [URL]
👉 Staging/admin: [URL if applicable]

Notes:
- [Any important info the client needs to know]
- [How to log in, if applicable]
- [Any known limitations or things to be aware of]

Next steps:
1. Please review and share your feedback by [Date — 5 business days from today]
2. You have [X] revision round(s) remaining
3. Once approved, I'll send over all credentials and the final invoice

Please confirm receipt of this message when you get a chance!

Shabih
```

---

## Post-Delivery

- [ ] Follow up if no response within 3 business days: *"Just checking in — have you had a chance to review [Project Name]?"*
- [ ] After acceptance/approval, send final invoice
- [ ] Confirm final payment received
- [ ] Transfer all credentials
- [ ] Send testimonial request (see onboarding-checklist.md)
- [ ] Offer maintenance retainer
- [ ] Mark project complete in tracker
- [ ] Add to portfolio (if no confidentiality requested)

---

## 30-Day Warranty Period

After final delivery and acceptance, the Developer will fix any bugs in the delivered work free of charge for **30 days**.

After 30 days, bug fixes and maintenance are billed at the standard hourly rate ($50/hr) or covered under a maintenance retainer.

---

*Last updated: 2026*
