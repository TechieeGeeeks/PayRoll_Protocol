import React from "react";
import Marquee from "react-fast-marquee";
import { GiPokerHand } from "react-icons/gi";
import { FaCircleDollarToSlot } from "react-icons/fa6";
import { GiCoinflip } from "react-icons/gi";
import { FaHandRock, FaDice } from "react-icons/fa";

const CustomMarquee = ({direction}) => {
  return (
    <div>
      <Marquee
        className="border-t-4 border-black bg-white py-5 m500:py-4 font-base"
        direction={direction}>
        {Array(3)
          .fill("xd")
          .map((x, id) => {
            return (
              <div className="flex gap-20" key={id}>
                <div className="ml-20 flex gap-5 items-center">
                  <GiPokerHand className="text-6xl m800:text-4xl m500:text-2xl" />
                  <span className=" text-4xl m800:text-2xl m500:text-xl">
                    Poker
                  </span>
                </div>
                <div className="flex gap-5 items-center">
                  <FaCircleDollarToSlot className="text-6xl m800:text-4xl m500:text-2xl" />
                  <span className=" text-4xl m800:text-2xl m500:text-xl">
                    Slot Machine
                  </span>
                </div>
                <div className="flex gap-5 items-center">
                  <GiCoinflip className="text-6xl m800:text-4xl m500:text-2xl" />
                  <span className=" text-4xl m800:text-2xl m500:text-xl">
                    Coin Flip
                  </span>
                </div>
                <div className="flex gap-5 items-center">
                  <FaHandRock className="text-6xl m800:text-4xl m500:text-2xl" />
                  <span className=" text-4xl m800:text-2xl m500:text-xl">
                    Rock Papper Scissor
                  </span>
                </div>
                <div className="flex gap-5 items-center">
                  <FaDice className="text-6xl m800:text-4xl m500:text-2xl" />
                  <span className=" text-4xl m800:text-2xl m500:text-xl">
                    Dice
                  </span>
                </div>
              </div>
            );
          })}
      </Marquee>
    </div>
  );
};

export default CustomMarquee;
