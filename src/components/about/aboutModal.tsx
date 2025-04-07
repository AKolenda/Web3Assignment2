import { useEffect } from "react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[1000] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            About & Credits
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Open Source Credits
              </h3>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800">Login Component</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm mt-2">
                    <li>
                      Credit:{" "}
                      <a
                        href="https://flowbite.com/blocks/marketing/login/"
                        className="text-blue-600 hover:underline"
                      >
                        Flowbite Login Blocks
                      </a>
                    </li>
                    <li>
                      Attribution:{" "}
                      <a
                        href="https://tailwindflex.com/@vishvajeet/best-responsive-navbar-design-easy-modern-navigation"
                        className="text-blue-600 hover:underline"
                      >
                        Best Responsive Navbar Design
                      </a>{" "}
                      by Vishvajeet
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800">
                    Gallery Paintings Component
                  </h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm mt-2">
                    <li>
                      Credit:{" "}
                      <a
                        href="https://tailwindflex.com/@alok/tailwind-image-gallery"
                        className="text-blue-600 hover:underline"
                      >
                        Tailwind Image Gallery
                      </a>{" "}
                      by Alok
                    </li>
                    <li>
                      Credit:{" "}
                      <a
                        href="https://tailwindflex.com/@Aman300/gallery-2"
                        className="text-blue-600 hover:underline"
                      >
                        Gallery 2
                      </a>{" "}
                      by Aman Kumar
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800">
                    React Router Implementation
                  </h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm mt-2">
                    <li>
                      Credit:{" "}
                      <a
                        href="https://www.youtube.com/watch?v=oTIJunBa6MA"
                        className="text-blue-600 hover:underline"
                      >
                        YouTube Tutorial
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800">
                    Other Components
                  </h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm mt-2">
                    <li>
                      Leaflet for Maps:{" "}
                      <a
                        href="https://leafletjs.com/"
                        className="text-blue-600 hover:underline"
                      >
                        Leaflet
                      </a>
                    </li>
                    <li>
                      Loading Animation:{" "}
                      <a
                        href="https://gifer.com/"
                        className="text-blue-600 hover:underline"
                      >
                        Gifer
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
