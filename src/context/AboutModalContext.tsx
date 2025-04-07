import { createContext, useState, useContext, ReactNode } from "react";
import AboutModal from "../components/about/aboutModal";

interface AboutModalContextType {
  openAboutModal: () => void;
  closeAboutModal: () => void;
}

const AboutModalContext = createContext<AboutModalContextType | undefined>(
  undefined
);

export const useAboutModal = () => {
  const context = useContext(AboutModalContext);
  if (!context) {
    throw new Error("AboutModal must be used within an AboutModalProvider");
  }
  return context;
};

interface AboutModalProviderProps {
  children: ReactNode;
}

export const AboutModalProvider = ({ children }: AboutModalProviderProps) => {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const openAboutModal = () => setIsAboutModalOpen(true);
  const closeAboutModal = () => setIsAboutModalOpen(false);

  return (
    <AboutModalContext.Provider value={{ openAboutModal, closeAboutModal }}>
      {children}
      <AboutModal isOpen={isAboutModalOpen} onClose={closeAboutModal} />
    </AboutModalContext.Provider>
  );
};
