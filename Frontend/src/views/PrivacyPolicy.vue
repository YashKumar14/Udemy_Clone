<template>
  <div class="privacy-wrapper">
    <main class="container" role="main">
      <article class="card" aria-labelledby="policy-title">
        <h1 id="policy-title">Privacy Policy</h1>
        <div class="meta small">Last updated: November 17, 2025</div>

        <p>
          Welcome to <strong>UdemyClone.online</strong> (“we”, “our”, or “us”).
          Your privacy matters — this policy explains how we collect and use
          information when you use our site and services.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          When you sign up or sign in using Google Sign-In (OAuth), we collect
          the following information from your Google profile:
        </p>
        <ul>
          <li>Full name</li>
          <li>Email address</li>
          <li>Profile picture URL</li>
        </ul>

        <p>
          We only collect the information returned by Google through the
          standard OAuth scopes you authorize during sign-in.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect for the following purposes:</p>
        <ul>
          <li>Create and manage your account on UdemyClone.online</li>
          <li>Authenticate and authorize access to your account</li>
          <li>Personalize your experience on the platform</li>
        </ul>

        <div class="callout">
          <strong>Note:</strong> We do not use Google data for advertising or
          sell your data to third parties.
        </div>

        <h2>3. Sharing & Disclosure</h2>
        <p>
          We do not share, sell, or rent your personal data to third parties. We
          may disclose information if required by law or to protect our rights
          and the safety of users.
        </p>

        <h2>4. Data Retention</h2>
        <p>
          We retain your account data while your account is active. If you
          request deletion, we will remove your data from our systems within 7
          business days unless otherwise required to retain by law.
        </p>

        <h2>5. How to Delete Your Data</h2>
        <p>
          If you would like your account and data removed, please contact us at
          <a href="mailto:support@udemyclone.online"
            >support@udemyclone.online</a
          >. Include the email address associated with your account so we can
          locate and remove your data promptly.
        </p>

        <h2>6. Security</h2>
        <p>
          We implement reasonable administrative and technical safeguards to
          protect your data. However, no system is 100% secure — please be
          mindful when sharing sensitive information online.
        </p>

        <h2>7. Changes to This Policy</h2>
        <p>
          We may update this privacy policy occasionally. When we do, we will
          post the updated policy on this page and update the “Last updated”
          date above.
        </p>

        <h2>8. Contact</h2>
        <p>
          If you have questions or privacy requests, contact us at:
          <a href="mailto:support@udemyclone.online"
            >support@udemyclone.online</a
          >.
        </p>

        <p class="small">
          Thank you for using <strong>UdemyClone.online</strong>.
        </p>
      </article>
    </main>
  </div>
</template>

<script setup></script>

<style>
:root .privacy-wrapper {
  --brand: #7b3fe4;
  --text: #1f2d3d;
  --muted: #6b7280;
  --bg: #f7f8fb;
  --card: #ffffff;
  --radius: 12px;
  --max-width: 900px;
}

/* PAGE BACKGROUND */
.privacy-wrapper {
  background: linear-gradient(180deg, var(--bg) 0%, #ffffff 0%);
  min-height: 100vh;
  color: var(--text);
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto,
    "Helvetica Neue", Arial;
  line-height: 1.6;
}

/* HEADER */
.privacy-wrapper .site-header {
  background: white;
  border-bottom: 1px solid #eef2f6;
  box-shadow: 0 2px 6px rgba(34, 41, 47, 0.03);
  position: sticky;
  top: 0;
  z-index: 50;
}

.privacy-wrapper .logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--brand);
}

.privacy-wrapper .logo .mark {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--brand), #5f2bdc);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 6px 18px rgba(123, 63, 228, 0.12);
}

.privacy-wrapper .logo .title {
  font-weight: 700;
  font-size: 16px;
  color: var(--text);
}

/* CONTENT */
.privacy-wrapper .container {
  max-width: var(--max-width);
  margin: 36px auto;
  padding: 0 20px;
}

.privacy-wrapper .card {
  background: var(--card);
  border-radius: var(--radius);
  padding: 34px;
  box-shadow: 0 6px 30px rgba(36, 50, 75, 0.06);
  border: 1px solid rgba(18, 20, 25, 0.03);
}

.privacy-wrapper h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  color: var(--text);
}

.privacy-wrapper .meta {
  color: var(--muted);
  margin-bottom: 22px;
  font-size: 14px;
}

.privacy-wrapper h2 {
  color: var(--brand);
  font-size: 18px;
  margin-top: 22px;
}

.privacy-wrapper p,
.privacy-wrapper li {
  color: var(--text);
  font-size: 15px;
  margin: 12px 0;
}

.privacy-wrapper ul {
  padding-left: 20px;
  margin: 8px 0 16px 0;
}

.privacy-wrapper .callout {
  background: linear-gradient(
    90deg,
    rgba(123, 63, 228, 0.06),
    rgba(123, 63, 228, 0.02)
  );
  border-left: 3px solid var(--brand);
  padding: 12px 14px;
  border-radius: 8px;
  margin: 18px 0;
  color: var(--text);
}

.privacy-wrapper .small {
  font-size: 13px;
  color: var(--muted);
}

.privacy-wrapper a {
  color: var(--brand);
  text-decoration: none;
  font-weight: 600;
}

.privacy-wrapper a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 720px) {
  .privacy-wrapper .card {
    padding: 20px;
  }

  .privacy-wrapper h1 {
    font-size: 22px;
  }
}
</style>
