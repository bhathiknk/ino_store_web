import React from 'react';


export default function Banner() {
  return (
    <div className="relative bg-gradient-to-r from-sky-500 to-indigo-500 mb-8">
      <div className="mx-auto px-8 py-12 flex flex-col gap-2 md:flex-row items-center justify-evenly">
        <div className="mb-8 md:mb-0 text-center" >
           <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Year End Season Offer !</h1> 
           <p className="text-lg md:text-xl text-white mb-2">Enjoy discounts on selected Items</p>
           <p className="text-2xl md:text-5xl text-yellow-400 font-bold">UP TO 50% OFF AND MORE BENIFITS</p>
        </div>
        <div className="w-1/3 relative aspect-video">
          <img src="/Assets/bannerimg.png" alt="banner_image" className="object-contain"/>
        </div>
      </div>
    </div>
  )
}
