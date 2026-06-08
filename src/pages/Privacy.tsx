import { useNavigate } from 'react-router-dom';

export default function Privacy() {
  const navigate = useNavigate();
  return (
    <div className="min-h-svh px-5 py-10 max-w-2xl mx-auto">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-1.5 text-sm text-sand-600 dark:text-sand-400 hover:text-sand-800 dark:hover:text-sand-300 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
        Privacy Policy
      </h1>
      <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">Last updated: June 2026</p>

      <div className="mt-8 space-y-7 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        <section>
          <h2 className="font-bold text-gray-700 dark:text-gray-200 mb-2">1. Who we are</h2>
          <p>
            SkinRoutine is a personal skincare tracking app operated by Beth Ashcroft ("we", "us", "our").
            We are the data controller for the personal information you provide when using this app.
            You can contact us at <a href="mailto:bethashcroft1998@gmail.com" className="text-sand-600 dark:text-sand-400 underline underline-offset-2">bethashcroft1998@gmail.com</a>.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-700 dark:text-gray-200 mb-2">2. What data we collect</h2>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Account information:</strong> Your email address and name when you sign in via Google or email.</li>
            <li><strong>Skin profile:</strong> Your skin type and concerns that you enter during onboarding or in settings.</li>
            <li><strong>Product library:</strong> Skincare products you add, including names, brands, ingredients, and usage notes.</li>
            <li><strong>Routine logs:</strong> Records of your daily skincare routines and skin ratings that you create.</li>
            <li><strong>Technical data:</strong> Basic browser and session information required for authentication, handled by Supabase.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-gray-700 dark:text-gray-200 mb-2">3. How we use your data</h2>
          <ul className="list-disc pl-4 space-y-1">
            <li>To provide and sync your data across devices when you are signed in.</li>
            <li>To generate personalised product recommendations based on your skin profile.</li>
            <li>To detect ingredient conflicts in your routine.</li>
            <li>To send you product expiry notifications you have opted into.</li>
          </ul>
          <p className="mt-2">We do not sell your data, show you ads, or share your data with third parties for marketing.</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-700 dark:text-gray-200 mb-2">4. Legal basis (UK GDPR)</h2>
          <p>
            We process your data on the basis of <strong>contract</strong> — it is necessary to provide you with the service —
            and <strong>legitimate interests</strong> for improving the app. Where we send notifications, we rely on your
            <strong> consent</strong> which you can withdraw at any time via your browser or device settings.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-700 dark:text-gray-200 mb-2">5. Data storage and security</h2>
          <p>
            Your data is stored using <strong>Supabase</strong>, a cloud database platform. Data may be stored on servers
            within the EU. Supabase uses encryption at rest and in transit. Your data is protected by row-level security —
            only you can access your own records.
          </p>
          <p className="mt-2">
            We also store a copy of your data locally in your browser's IndexedDB for offline access. This data stays on
            your device and is never sent to third parties.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-700 dark:text-gray-200 mb-2">6. Your rights</h2>
          <p>Under UK GDPR, you have the right to:</p>
          <ul className="list-disc pl-4 space-y-1 mt-1">
            <li><strong>Access</strong> your data — use the Export function in Settings.</li>
            <li><strong>Erasure</strong> — delete your account and all associated data via Settings → Delete account.</li>
            <li><strong>Portability</strong> — export your data as JSON from Settings at any time.</li>
            <li><strong>Rectification</strong> — edit any data directly within the app.</li>
            <li><strong>Object</strong> — contact us to raise an objection to any processing.</li>
          </ul>
          <p className="mt-2">
            If you have concerns about how we handle your data, you also have the right to lodge a complaint with the
            <strong> Information Commissioner's Office (ICO)</strong> at{' '}
            <a href="https://ico.org.uk" className="text-sand-600 dark:text-sand-400 underline underline-offset-2" target="_blank" rel="noreferrer">ico.org.uk</a>.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-700 dark:text-gray-200 mb-2">7. Cookies and local storage</h2>
          <p>
            We use browser localStorage and IndexedDB to store your app data and session. We do not use tracking cookies
            or any third-party analytics. The only cookies set are authentication session cookies managed by Supabase,
            which are strictly necessary for the service to function.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-700 dark:text-gray-200 mb-2">8. Data retention</h2>
          <p>
            We retain your data for as long as you have an account. When you delete your account, all your data is
            permanently removed from our servers within 30 days. Local data on your device is cleared immediately upon
            sign out or account deletion.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-700 dark:text-gray-200 mb-2">9. Changes to this policy</h2>
          <p>
            We may update this policy from time to time. The date at the top of this page will reflect when it was
            last changed. Continued use of the app after changes means you accept the updated policy.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-700 dark:text-gray-200 mb-2">10. Contact</h2>
          <p>
            For any privacy-related questions, contact us at{' '}
            <a href="mailto:bethashcroft1998@gmail.com" className="text-sand-600 dark:text-sand-400 underline underline-offset-2">bethashcroft1998@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
