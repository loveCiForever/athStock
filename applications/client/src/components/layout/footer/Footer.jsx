import { useEffect, useState } from "react";
import logo from "../../../assets/logos/black-athStockLogo.png";

const Footer = () => {
  return (
    <footer className="w-full bg-white shadow-sm text-sm md:text-base lg:text-lg text-black px-6 sm:px-10 md:px-14 xl:px-40 py-10 lg:py-10 border-t-[1px] border-gray-200">
      <div className="w-full md:py-8">
        <div className="items-center w-full">
          <div className="flex flex-col items-start w-full mb-8 xl:mb-0">
            <h1 className={`flex text-3xl lg:text-4xl font-extrabold`}>
              athStock.
            </h1>

            <ul className="flex flex-col gap-1 pl-3 mt-4 text-sm font-normal tracking-wider list-disc list-inside md:text-base">
              <li>
                This is website is used to demonstrate our machine learning
                model predicts stock prices.
              </li>

              <li>
                Also create a community for who have interest in stocks,
                security by provide blogging feature.
              </li>
              <li>
                Developed with{" "}
                <a
                  href="https://www.mongodb.com/resources/languages/mern-stack"
                  className="font-bold hover:text-blue-500"
                >
                  MERN
                </a>{" "}
                (MongoDB, ExpressJS, ReactJS, NodeJS) stack.
              </li>
              <li>
                The open source can be found at{" "}
                <a
                  href="https://github.com/loveCiForever/athStock"
                  className="font-bold hover:underline"
                >
                  athStock
                </a>
                .
              </li>
            </ul>
          </div>

          <ul
            className={`flex flex-wrap items-center font-medium justify-between sm:gap-10 p-4 xl:px-10 bg-gray-100 rounded-lg mt-10`}
          >
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Licensing
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
