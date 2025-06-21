"use client";

const OffersSection = () => {
  return (
    <section className="w-full px-4 md:px-6 my-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-4">
        {/* Left - Countdown Offer */}
        <div className="h-[121px] bg-beige rounded-md flex items-center justify-center px-6 text-center">
          <div>
            <h3 className="font-montserrat font-bold text-2xl md:text-[32px] text-dark-gray mb-1">
              LIMITED TIME OFFER
            </h3>
            <p className="font-montserrat font-bold text-base md:text-xl text-dark-gray tracking-wide">
              2 DAYS • 12 HRS • 14 MIN • 34 SEC
            </p>
          </div>
        </div>

        {/* Right - 50% OFF */}
        <div className="h-[121px] bg-beige rounded-md flex items-center justify-between px-6">
          <div className="flex-1 text-center">
            <h3 className="font-montserrat font-bold text-[40px] md:text-[55px] text-dark-gray leading-none">
              50% OFF
            </h3>
          </div>

          <div className="ml-4 md:ml-6 text-center">
            <p className="font-montserrat font-bold text-sm md:text-base text-dark-gray">
              OFFER VALID TILL
            </p>
            <p className="font-montserrat font-bold text-sm md:text-base text-dark-gray mb-3">
              2 MAY
            </p>
            <button className="btn-dark px-5 py-2 rounded-md text-sm">
              SEE OFFER
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
