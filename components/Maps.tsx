import React from 'react';

export default function Maps() {
  return (
    <div className="mb-4">
      <iframe
        src="https://maps.google.com/maps?q=46.994293,28.850970&z=13&output=embed"
        //src="https://www.google.com/maps?q=Nicolae+Zelinski+36,+Chișinău,+Moldova&z=13&output=embed"
        width="350"
        height="225"
        style={{ border: 0 }}
        allowFullScreen
        className="md:h-[300px] md:w-full"
      ></iframe>
    </div>
  );
}
