
export default function Navbar(){


    return(
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex item-center justify-between">
                <h1 className="text-2xl font-bold text-blue-700">SmartWayAcademy</h1>

                <ul className="hidden md:flex gap-8 font-medium" >
                    <li className="hover:text-blue-600 cursor-pointer">Home</li>
                    <li className="hover:text-blue-600 cursor-pointer">Courses</li>
                    <li className="hover:text-blue-600 cursor-pointer">Results</li>
                    <li className="hover:text-blue-600 cursor-pointer">About</li>
                    <li className="hover:text-blue-600 cursor-pointer" >Contact</li>
                </ul>

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl" >Enquire Now</button>

            </div>


        </nav>

    );
}