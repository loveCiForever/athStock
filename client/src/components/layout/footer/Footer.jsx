import { useNavigate } from "react-router-dom";
import LogoButton from "../../ui/buttons/LogoButton";

const Footer = ({ theme }) => {
  const navigate = useNavigate();

  return (
    <footer className="flex flex-col xl:flex-row py-20 mt-10 w-full bg-black/90 text-white px-6 sm:px-10 md:px-14 xl:px-40">
      <div className="flex flex-col w-full xl:w-[30%] items-start justify-center bg-red-100/20//">
        <LogoButton
          theme={!theme}
          navigateTo={"/"}
          size={`${window.innerWidth > 1200 ? "200px" : "110px"}`}
        />
        <div className="mt-4 text-sm md:text-md xl:text-md text-white">
          <h1 className="tracking-wider">
            This is a student scientific research project carried out by a group
            of 2nd year students with the guidance of Dr. Trinh Hung Cuong and
            sponsored by Ton Duc Thang University.
          </h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full xl:w-[70%] xl:ml-12 mt-10 xl:mt-0 items-start justify-center">
        <div className="flex w-full xl:w-[70%] items-center gap-16 lg:gap-6 xl:gap-0 bg-red-100// lg:justify-start xl:justify-between">
          <div className="flex flex-col w-[50%]">
            <h1 className="tracking-wide text-md lg:text-xl font-bold">
              Introduction
            </h1>
            <div className="flex flex-col mt-2 gap-1 items-start text-sm lg:text-md">
              <button className="hover:text-orange-500">About us</button>
              <button className="hover:text-orange-500">Contact</button>
              <button className="hover:text-orange-500">Privacy policy</button>
            </div>
          </div>
          <div className="flex flex-col w-[50%]">
            <h1 className="tracking-wide text-md lg:text-xl font-bold ">
              Support
            </h1>
            <div className="flex flex-col mt-2 gap-1 items-start text-sm lg:text-md">
              <button className="hover:text-orange-500">FAQ</button>
              <button className="hover:text-orange-500">Help</button>
              <button className="hover:text-orange-500">Terms of use</button>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full xl:w-[40%] mt-10 lg:mt-0 bg-red-200// ">
          <h1 className="tracking-wide text-md lg:text-xl font-bold">
            Send us a message
          </h1>
          <textarea
            type="text"
            id="message"
            className="bg-transparent border-[1px] h-20 mt-4 pl-4 py-2 rounded-md text-sm lg:text-md border-gray-400 outline-none"
            placeholder="Send message"
          />
          <button className="w-full bg-orange-500 hover:bg-orange-300 p-1 mt-2 rounded-md text-white font-bold text-md xl:text-lg">
            Send
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
