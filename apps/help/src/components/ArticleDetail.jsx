import { ArrowLeftIcon, ClockIcon } from "lucide-react";

export default function ArticleDetail({ article, onBack }) {
    return (
        <main>
            <div>
                <button
                    onClick={onBack}
                    className=""
                >
                    <ArrowLeftIcon className="" />
                    Retour aux articles
                </button>

                <article>
                    <div>
                        <div>
                            <span>
                                {article.category}
                            </span>
                            <div className="">
                                <ClockIcon className="" />
                                {article.readTime}
                            </div>
                            <span className="">
                                {new Date(article.date).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>

                        <h1>
                            {article.title}
                        </h1>
                    </div>

                    <div>
                        {article.content.split('\n').map((paragraph, index) => {
                            const trimmedParagraph = paragraph.trim()

                            if (trimmedParagraph.startsWith('# ')) {
                                return (
                                    <h1 key={index} className="">
                                        {trimmedParagraph.substring(2)}
                                    </h1>
                                )
                            } else if (trimmedParagraph.startsWith('## ')) {
                                return (
                                    <h2 key={index} className="">
                                        {trimmedParagraph.substring(3)}
                                    </h2>
                                )
                            } else if (trimmedParagraph.startsWith('- ')) {
                                return (
                                    <li key={index} className="">
                                        {trimmedParagraph.substring(2)}
                                    </li>
                                )
                            } else if (trimmedParagraph.startsWith('```')) {
                                const isClosing = trimmedParagraph === '```'
                                return (
                                    <div key={index} className={`${isClosing ? '' : ''}`}>
                                        {!isClosing && (
                                            <pre className="">
                                                <code className="">
                                                    {/* Le code sera affiché dans les paragraphes suivants */}
                                                </code>
                                            </pre>
                                        )}
                                    </div>
                                )
                            } else if (trimmedParagraph && !trimmedParagraph.startsWith('#')) {
                                return (
                                    <p key={index} className="text-gray-700 leading-relaxed mb-4">
                                        {trimmedParagraph}
                                    </p>
                                )
                            }
                            return null
                        })}
                    </div>
                </article>

                <div>
                    <h3>
                        Cet article vous a-t-il été utile ?
                    </h3>
                    <p>
                        Faites-nous savoir si vous avez trouvé les informations que vous cherchiez.
                    </p>
                    <div>
                        <button className="btn-primary">
                            👍 Oui, très utile
                        </button>
                        <button className="btn-secondary">
                            👎 Non, pas vraiment
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};
