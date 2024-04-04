import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const isDetailPage = location.pathname.includes("/detail");
  const col12Classes = isDetailPage ? "lg:!px-[18em]" : "";
  return (
    <footer className={col12Classes}>
      <div className="flex flex-col items-center p-4 sm:p-12 md:flex-row">
        <div className="flex flex-col items-center justify-between w-full gap-8 md:gap-6 md:flex-row">
          <a href="#" className="flex font-semibold items-center text-gray-800">
            <img
              className="w-auto h-8 md:h-10"
              src="../../public/logoSVG.svg"
              alt=""
            />
          </a>
          <p className="m-0 p-2 text-md leading-5 text-black">
            ©️ 2024 Tools House.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
