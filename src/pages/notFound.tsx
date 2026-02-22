import type { FC } from 'react';

const NotFoundPage: FC = () => {
  return (
    <div
      className=" w-full
        bg-gradient-to-bl from-yellow-300 to-yellow-200  
        // min-h-screen 
        flex items-center justify-center
        p-0
      "
    >
      <div className="flex flex-col items-center text-black font-bold font-sans rtl">
        <img
          src="https://cdn.rawgit.com/ahmedhosna95/upload/1731955f/sad404.svg"
          alt="404 illustration"
          className="mb-5 mt-20 h-[50vh]  w-auto object-contain"
        />

        <span className="text-[2.8rem] sm:text-[3.3rem] font-extrabold mb-10 tracking-tight">
          404 PAGE
        </span>

        <p className="text-lg mb-3 text-center">
          صفحه‌ای که دنبالش بودید پیدا نشد
        </p>

        <p className="text-sm mb-8 opacity-80">
          ... بازگشت به صفحه قبلی
        </p>

        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.history.back();
          }}
          className="
            bg-white text-black 
            text-xl sm:text-2xl 
            font-extrabold 
            py-3 px-8 sm:py-2 sm:px-6 
            rounded-full 
            shadow-[0px_20px_70px_4px_rgba(0,0,0,0.1),_inset_7px_33px_0px_#fff300]
            transition-all duration-300
            hover:translate-y-[-13px]
            hover:shadow-[0_35px_90px_4px_rgba(0,0,0,0.3),_inset_0px_0_0_3px_black]
            active:scale-95
          "
        >
          بازگشت به صفحه قبلی
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;