import { useAboutModal } from "../../context/AboutModalContext";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Art Gallery" }) => {
  const { openAboutModal } = useAboutModal();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>

        <div className="flex items-center space-x-4">
          <button
            onClick={openAboutModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            About & Credits
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
