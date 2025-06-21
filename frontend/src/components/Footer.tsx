import { Instagram, Facebook, Youtube, Music, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-mint-light shadow-footer">
      <div className="max-w-7xl mx-auto px-4 py-12 mt-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          {/* LEFT: Logo + Social */}
          <div className="flex flex-col items-center md:items-start gap-6">
            <h1 className="font-quicksand text-3xl font-bold">
              <span className="text-dark-gray">NCX</span>
              <span className="text-accent-red">.</span>
            </h1>
            <div className="flex gap-3">
              {[Instagram, Facebook, Youtube, Music].map((Icon, i) => (
                <button
                  key={i}
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition"
                >
                  <Icon className="w-4 h-4 text-brown" />
                </button>
              ))}
            </div>
          </div>

          {/* CENTER: Newsletter + Contact Info */}
          <div className="flex flex-col items-center gap-6">
            <h3 className="font-reem-kufi text-lg font-bold text-dark-gray">
              Subscribe to Our Newsletter
            </h3>
            <div className="flex w-full max-w-sm">
              <input
                type="email"
                placeholder="johndoe@email.com"
                className="flex-1 px-3 py-2 text-sm border border-brown rounded-l-full bg-white text-brown placeholder:text-brown/70 focus:outline-none"
              />
              <button className="px-4 py-2 bg-brown text-white text-xs font-bold rounded-r-full hover:bg-brown/90 transition">
                Subscribe
              </button>
            </div>

            {/* Contact Info - now in one row */}
            <div className="flex flex-wrap justify-center items-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brown" />
                <span className="font-ntr text-sm text-dark-gray">
                  ncxshop@gmail.com
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brown" />
                <span className="font-ntr text-sm text-dark-gray">
                  +880 1234 567891
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: About + Policy */}
          <div className="flex justify-center md:justify-end gap-12">
            <div>
              <h3 className="font-reem-kufi text-lg font-bold text-dark-gray mb-3">
                About Us
              </h3>
              <ul className="space-y-1 text-sm font-ntr text-dark-gray">
                {["About Us", "Contact Us", "Blog", "FAQs"].map((text) => (
                  <li key={text}>
                    <a href="#" className="hover:text-accent-red transition">
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-reem-kufi text-lg font-bold text-dark-gray mb-3">
                Policy
              </h3>
              <ul className="space-y-1 text-sm font-ntr text-dark-gray">
                {[
                  "Privacy Policy",
                  "Payment Policy",
                  "Warranty Policy",
                  "Exchange Policy",
                ].map((text) => (
                  <li key={text}>
                    <a href="#" className="hover:text-accent-red transition">
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-12 border-t border-brown pt-4 text-center">
          <p className="text-sm font-ntr text-brown">
            © 2025 NCX | All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
