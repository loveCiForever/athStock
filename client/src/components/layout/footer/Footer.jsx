import { useNavigate } from "react-router-dom";
import LogoButton from "../../ui/button/LogoButton";

const Footer = ({ theme }) => {
  const navigate = useNavigate();

  return (
    <footer className="flex py-20 mt-10 w-full px-40 bg-black/90 text-white ">
      <div className="flex flex-col items-start justify-center">
        <LogoButton theme={!theme} navigateTo={"/"} size={"100px"} />
        <div className="mt-4 text-md text-white">
          <h1 className="tracking-wider">
            This is a student scientific research project <br />
            carried out by a group of 2nd year students <br />
            with the guidance of Dr. Trinh Hung Cuong <br />
            and sponsored by Ton Duc Thang University.
          </h1>
        </div>
      </div>

      <div className="flex gap-40  ml-32">
        <div className="flex flex-col">
          <h1 className="tracking-wide text-2xl font-bold">Company</h1>
          <div className="flex flex-col mt-2 gap-1 items-start">
            <button className="hover:text-orange-500">About us</button>
            <button className="hover:text-orange-500">Contact</button>
            <button className="hover:text-orange-500">Jobs</button>
            <button className="hover:text-orange-500">Press kit</button>
          </div>
        </div>
        <div className="flex flex-col ">
          <h1 className="tracking-wide text-2xl font-bold">Services</h1>
          <div className="flex flex-col mt-2 gap-1 items-start">
            <button className="hover:text-orange-500">Branding</button>
            <button className="hover:text-orange-500">Design</button>
            <button className="hover:text-orange-500">Marketing</button>
            <button className="hover:text-orange-500">Advertisement</button>
          </div>
        </div>
        <div className="flex flex-col ">
          <h1 className="tracking-wide text-2xl font-bold ">Legal</h1>
          <div className="flex flex-col mt-2 gap-1 items-start">
            <button className="hover:text-orange-500">Terms of use</button>
            <button className="hover:text-orange-500">Privacy policy</button>
            <button className="hover:text-orange-500">Cookie policy</button>
          </div>
        </div>
        <div>
          <h1 className="tracking-wide text-2xl font-bold">More information</h1>
        </div>
      </div>

      {/* <div>
        <input
          type="text"
          className="bg-transparent border-[1px] rounded-md border-gray-300"
          placeholder="Send message"
        />
      </div> */}
    </footer>
  );
};

export default Footer;
