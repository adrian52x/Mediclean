import React from 'react';

export default function Maps() {
  return (
    <div className="mb-4" id="location">
      <iframe
        //src="http://maps.google.com/maps?q=47.027449,28.831051&z=13&output=embed"
        src="https://www.google.com/maps?q=Str.+Mihail+Kogălniceanu+1,+Chișinău,+Moldova&z=13&output=embed"
        width="350"
        height="225"
        style={{ border: 0 }}
        allowFullScreen
        className="md:h-[300px] md:w-full"
      ></iframe>
    </div>
  );
}
