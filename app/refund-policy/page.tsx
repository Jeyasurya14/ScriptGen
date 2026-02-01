export default function RefundPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Refund Policy</h1>

            <div className="prose dark:prose-invert">
                <p className="mb-4 text-gray-600 dark:text-gray-300">Last updated: {new Date().toLocaleDateString()}</p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">No Refunds</h2>
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <p className="font-medium text-yellow-800 dark:text-yellow-200">
                            Strict No-Refund Policy
                        </p>
                        <p className="mt-2 text-yellow-700 dark:text-yellow-300">
                            All sales are final. Because Thunglish Script Generator offers immediate access to digital goods and AI generation services, we do not offer refunds or credits for any purchases under any circumstances.
                        </p>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">1. Digital Services</h2>
                    <p>
                        Our service provides instant access to AI-generated content. Once a generation is initiated or credits are purchased, the computing resources are consumed immediately. Therefore, we cannot retrieve or "un-use" the service, making refunds impossible.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">2. Non-Tangible Irrevocable Goods</h2>
                    <p>
                        You agree that by purchasing credits or services from us, you are purchasing non-tangible, irrevocable digital goods. You acknowledge that no refund will be issued for any transaction once it is completed.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">3. Accidental Purchases</h2>
                    <p>
                        We are not responsible for accidental purchases or "change of mind." Please double-check your order before confirming your payment.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">4. Contact Us</h2>
                    <p>
                        If you experience technical issues where you did not receive the credits you purchased, please contact our support team immediately, and we will verify the transaction and manually credit your account if the payment was successful. This is not a refund, but a fulfillment of your purchase.
                    </p>
                </section>
            </div>
        </div>
    );
}
