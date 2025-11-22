import React from 'react';
import Image from "next/image"

interface NavbarProps {
    className?: string;
}

const Navbar: React.FC<NavbarProps> = () => {
    return (
        <nav className="w-full flex items-center justify-between px-26 py-4 bg-white text-black">
            {/* Left: Menu button */}
            <button className="bg-black text-white rounded-full flex items-center justify-between h-[43px] min-w-[187px] px-2">
                {/* Circle with icon */}
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-none">
                    <Image src="/images/arrow.svg" alt="Arrow" width={20} height={20} className="rotate-[45deg]" />
                </div>

                {/* Button text */}
                <span className="font-ray font-medium text-[16px] text-white whitespace-nowrap mr-2">
                    تست هوش مصنوعی
                </span>
            </button>

            {/* Navigation + Logo */}
            <div className="flex items-center gap-8 font-ray font-medium text-[16px] text-black">
                {/* Navigation links */}
                <ul className="hidden md:flex gap-6 font-medium">
                    <li>
                        <a
                            href="#contact"
                            className="!text-black no-underline hover:text-gray-900 visited:text-black focus:text-black active:text-black"
                        >
                            تست هوش مصنوعی
                        </a>
                    </li>
                    <li>
                        <a
                            href="#blog"
                            className="!text-black no-underline hover:text-gray-900 visited:text-black focus:text-black active:text-black"
                        >
                            وبلاگ
                        </a>
                    </li>
                    <li>
                        <a
                            href="#features"
                            className="!text-black no-underline hover:text-gray-900 visited:text-black focus:text-black active:text-black"
                        >
                            محصولات
                        </a>
                    </li>
                    <li>
                        <a
                            href="#home"
                            className="!text-black no-underline hover:text-gray-900 visited:text-black focus:text-black active:text-black"
                        >
                            خانه
                        </a>
                    </li>
                </ul>

                {/* Logo */}
                <div className="flex-shrink-0">
                    <Image
                        src="/images/logo.svg"
                        alt="Logo"
                        width={190}
                        height={20}
                    />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;