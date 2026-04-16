import { Clock3, Headphones, Mail, MapPin, Phone } from "lucide-react";

const contactCards = [
  {
    title: "Phone",
    detail: "+1 (800) 123-4567",
    hint: "Mon to Sat, 9:00 AM to 8:00 PM",
    icon: Phone,
  },
  {
    title: "Email",
    detail: "support@freshcart.com",
    hint: "We reply within 24 hours",
    icon: Mail,
  },
  {
    title: "Office",
    detail: "FreshCart HQ, Cairo",
    hint: "Nasr City, Cairo, Egypt",
    icon: MapPin,
  },
  {
    title: "Business Hours",
    detail: "Daily: 9:00 AM to 8:00 PM",
    hint: "Friday support closes at 5:00 PM",
    icon: Clock3,
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f7faf8] py-8 sm:py-10">
      <div className="container mx-auto px-4 md:px-6">
        <section className="rounded-3xl bg-linear-to-r from-emerald-600 via-emerald-500 to-lime-500 p-6 text-white shadow-[0_18px_35px_rgba(16,185,129,0.25)] sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-emerald-100">
              FreshCart Support
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-3xl">
              Contact Us
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-emerald-50 sm:text-base">
              Need help with orders, delivery, or returns? Send us a message and
              our support team will get back to you quickly.
            </p>
          </div>
        </section>

        <section className="mt-7 grid gap-6 lg:grid-cols-[1fr_1.5fr]">
          <aside className="space-y-4">
            {contactCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <Icon className="size-5" />
                    </span>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold tracking-[0.12em] text-slate-400 uppercase">
                        {card.title}
                      </p>
                      <p className="mt-1 text-base font-semibold text-slate-900">
                        {card.detail}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">{card.hint}</p>
                    </div>
                  </div>
                </article>
              );
            })}

            <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-emerald-600">
                  <Headphones className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-emerald-700">
                    Priority Support
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-emerald-700/90">
                    For urgent order issues, mention your order ID in the form
                    so we can route your request faster.
                  </p>
                </div>
              </div>
            </article>
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <div className="w-full min-h-150 overflow-y-auto rounded-xl border border-gray-100 shadow-sm">
              <iframe
                id="JotFormIFrame-261055779999076"
                title="Contact Us Form"
                src="https://form.jotform.com/261055779999076"
                style={{
                  minWidth: "100%",
                  maxWidth: "100%",
                  height: "800px",
                  border: "none",
                }}
                scrolling="yes"
              />
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
