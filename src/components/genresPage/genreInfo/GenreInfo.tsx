import { Genre } from "../types/genreProps";

interface GenreInfoProps {
  genre: Genre;
}

const GenreInfo: React.FC<GenreInfoProps> = ({ genre }) => {

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-950 rounded-t-lg p-4 text-white shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {genre.genreName}
            </h2>
            <p className="text-indigo-100 text-sm mt-1">
              {genre.Eras.eraName}, {genre.Eras.eraYears}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white rounded-lg p-5 shadow-md border border-gray-100">
          <dl className="space-y-3">
            <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100">
              <dt className="text-gray-500 font-medium">Description</dt>
              <dd className="col-span-2 text-gray-800 font-medium">
                {genre.description}
              </dd>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2">
              <dt className="text-gray-500 font-medium">Genre Link:</dt>
              <dd className="col-span-2">
                <a
                  href={genre.wikiLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition-colors"
                >
                  <span>Visit Website</span>
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default GenreInfo;
