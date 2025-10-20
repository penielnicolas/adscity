import Header from '../common/header/Header';
import ArticleDetail from '../components/ArticleDetail';
import { useState } from 'react';
import FAQSection from '../components/FAQSection';
import CategoryGrid from '../components/CategoryGrid';
import SearchSection from '../components/SearchSection';

export const AppNavigation = () => {
    const [selectedArticle, setSelectedArticle] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')

    const handleViewArticle = (article) => {
        setSelectedArticle(article)
    }

    const handleBackToHome = () => {
        setSelectedArticle(null)
    }

    if (selectedArticle) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header onBackToHome={handleBackToHome} showBackButton={true} />
                <ArticleDetail article={selectedArticle} onBack={handleBackToHome} />
                {/* <Footer /> */}
            </div>
        )
    }
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <SearchSection searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            <CategoryGrid />
            <FAQSection searchQuery={searchQuery} />
            {/* <RecentArticles onViewArticle={handleViewArticle} searchQuery={searchQuery} /> */}
            {/* <Footer /> */}
        </div>
    );
};