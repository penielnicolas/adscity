import { categories } from "../config";

export default function CategoryGrid() {
    return (
        <section>
            <div>
                <h2>
                    Parcourir par catégorie
                </h2>

                <div>
                    {categories.map((category) => {
                        // const IconComponent = category.icon;

                        return (
                            <div key={category.title} className="category-card">
                                <div className={`category-icon ${category.bgColor} mb-4`}>
                                    <div className={`w-8 h-8 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center`}>
                                        {/* <IconComponent className="w-5 h-5 text-white" /> */}
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {category.title}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {category.description}
                                </p>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                                    {category.articles} articles
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};
