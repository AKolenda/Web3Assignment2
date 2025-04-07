// learned about react routers
// https://www.youtube.com/watch?v=oTIJunBa6MA

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { FavoritesProvider } from "./context/FavoritesContext";

// toto - resolve via absolute pathing
// @ tags

import Login from "./components/login/Login.tsx";
import GalleryView from "./galleryview/GalleryView.tsx";
import ErrorPage from "./components/errorpage/ErrorPage.tsx";
import PaintingView from "./components/paintingsview/PaintingView.tsx";
import ArtistsView from "./components/artistspage/ArtistsView.tsx";
import GenresView from "./components/genresPage/GenresView.tsx";

// css
import "./index.css";

// creating core routes here
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/galleryview",
    element: <GalleryView />,
    errorElement: <div>404</div>,
  },
  {
    path: "/paintings",
    element: <PaintingView />,
    errorElement: <div>404</div>,
  },
  {
    path: "/artists",
    element: <ArtistsView />,
    errorElement: <div>404</div>,
  },
  {
    path: "/genres",
    element: <GenresView />,
    errorElement: <div>404</div>,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FavoritesProvider>
      <RouterProvider router={router} />
    </FavoritesProvider>
  </StrictMode>
);
