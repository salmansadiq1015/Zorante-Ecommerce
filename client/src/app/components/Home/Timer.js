"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const targetTime = new Date().getTime() + 2 * 24 * 60 * 60 * 1000;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
    };

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = calculateTimeLeft();

        if (newTime.seconds !== prevTime.seconds) setLastUpdated("seconds");
        else if (newTime.minutes !== prevTime.minutes)
          setLastUpdated("minutes");
        else if (newTime.hours !== prevTime.hours) setLastUpdated("hours");
        else if (newTime.days !== prevTime.days) setLastUpdated("days");

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center items-center space-x-2 sm:space-x-10 bg-transparent  rounded-lg">
      {["days", "hours", "minutes", "seconds"].map((unit, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="flex space-x-[-.5rem] sm:space-x-1">
            {timeLeft[unit]
              .toString()
              .padStart(2, "0")
              .split("")
              .map((digit, i) => (
                <div
                  key={i}
                  className={`relative w-[40px] h-[70px] sm:w-[50px] sm:h-[80px] scale-[.7] sm:scale-[1] ${
                    lastUpdated === unit ? "animate-pulse" : ""
                  }`}
                >
                  {/* Add a glow effect to the digits */}
                  {lastUpdated === unit && (
                    <div
                      className="absolute top-4 left-1 inset-0 bg-gradient-to-r from-red-600 via-red-500 to-black blur-lg"
                      style={{
                        mixBlendMode: "multiply",
                        width: "100%",
                        height: "100%",
                      }}
                    ></div>
                  )}
                  <Image
                    src="/clock.png"
                    alt={digit}
                    width={50}
                    height={80}
                    className="drop-shadow-lg"
                  />
                  <span className="absolute inset-0 flex justify-center top-[1.7rem] sm:top-[2.4rem] items-center text-orange-600 text-4xl font-bold">
                    {digit}
                  </span>
                </div>
              ))}
          </div>
          <span className="text-black text-sm mt-[1rem] text-[14px] sm:text-[16px] sm:mt-[3rem] uppercase text-center">
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}
