import { useState } from "react";
import { faqs } from "../config";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

export default function FAQSection({ searchQuery }) {
    const [openItems, setOpenItems] = useState([]);

    const filteredFAQs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleItem = (id) => {
        setOpenItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        )
    }

    return (
        <section>
            <div>
                <div>
                    <h2>
                        Questions Fréquentes
                    </h2>
                    <p>
                        Trouvez rapidement les réponses aux questions les plus courantes
                    </p>
                </div>

                <div>
                    <div>
                        {filteredFAQs.map((faq) => (
                            <div key={faq.id} className="card">
                                <button
                                    onClick={() => toggleItem(faq.id)}
                                    className=""
                                >
                                    <h3 className="">
                                        {faq.question}
                                    </h3>
                                    {openItems.includes(faq.id) ? (
                                        <ChevronUpIcon className="" />
                                    ) : (
                                        <ChevronDownIcon className="" />
                                    )}
                                </button>

                                {openItems.includes(faq.id) && (
                                    <div className="">
                                        <p className="">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {filteredFAQs.length === 0 && searchQuery && (
                        <div>
                            <p>
                                Aucune question trouvée pour "{searchQuery}"
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
