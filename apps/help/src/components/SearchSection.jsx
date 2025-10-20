import { FaMagnifyingGlass } from "react-icons/fa6";

export default function SearchSection({ searchQuery, onSearchChange }) {
    return (
        <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-16">
            <div className="container text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Comment pouvons-nous vous aider ?
                </h2>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Recherchez dans notre base de connaissances ou parcourez les catégories ci-dessous
                </p>

                <div className="max-w-2xl mx-auto relative">
                    <FaMagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher des articles d'aide..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    {['Publier une annonce', 'Gérer mon compte', 'Paiements', 'Sécurité'].map((tag) => (
                        <button
                            key={tag}
                            className="px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-colors text-sm"
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};
