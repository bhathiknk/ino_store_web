import React from "react";
import Container from "../Nav/Container";
import ClientNavBar from "../Nav/ClientNabBar";
import ClientFooter from "../Footer/ClientFooter";

export default function TermsAndConditions() {
  return (
    <div className="bg-gray-100">
      <div className="flex flex-col min-h-screen">
        <ClientNavBar />
        <main className="flex-grow py-8">
          <Container>
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-300">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Terms and Conditions
              </h1>
              <p className="text-gray-700 mb-4">
                Welcome to E-Com-Innovation-Web! These Terms and Conditions
                outline the rules and regulations for the use of our website.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 mb-4">
                By accessing and using our website, you agree to comply with and
                be bound by these Terms and Conditions. If you do not agree to
                these terms, please do not use our website.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
                2. Use of the Website
              </h2>
              <p className="text-gray-700 mb-4">
                You may use our website only for lawful purposes and in
                accordance with these Terms and Conditions. You agree not to use
                the website:
              </p>
              <ul className="list-disc list-inside mb-4 pl-5">
                <li>
                  In any way that violates any applicable local, national, or
                  international law or regulation.
                </li>
                <li>
                  For the purpose of exploiting, harming, or attempting to
                  exploit or harm others.
                </li>
                <li>
                  To transmit or procure the sending of any unsolicited or
                  unauthorized advertising or promotional material.
                </li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
                3. Intellectual Property Rights
              </h2>
              <p className="text-gray-700 mb-4">
                All content on the website, including but not limited to text,
                graphics, logos, images, and software, is the property of
                E-Com-Innovation-Web or its licensors and is protected by
                copyright, trademark, and other intellectual property laws.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
                4. Limitation of Liability
              </h2>
              <p className="text-gray-700 mb-4">
                To the fullest extent permitted by law, E-Com-Innovation-Web
                shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages, or any loss of profits or
                revenues, whether incurred directly or indirectly, or any loss
                of data or use, arising out of or in connection with your use of
                the website.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
                5. Changes to These Terms
              </h2>
              <p className="text-gray-700 mb-4">
                We may update these Terms and Conditions from time to time. The
                updated version will be posted on this page, and your continued
                use of the website after any such changes constitutes your
                acceptance of the new terms.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
                6. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions or concerns about these Terms and
                Conditions, please contact us at :
                <a href=" mailto:support@enoweb.com" className="text-blue-600 hover:underline ml-2">
                support@enoweb.com
                </a>.
              </p>
            </div>
          </Container>
        </main>

        <ClientFooter />
      </div>
    </div>
  );
}
