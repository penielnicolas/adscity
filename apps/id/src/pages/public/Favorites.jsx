import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import Tabs from '../../components/ui/Tabs';
import { tabs } from '../../config';
import '../../styles/public/Favorites.scss';

export default function Favorites() {
    const [activeTab, setActiveTab] = useState('posts'); // < posts | searches | profiles >

    const handleBack = () => {
        window.history.back();
    }

    return (
        <div className="favorites">
            <PageHeader
                onClick={handleBack}
                location={'Favoris'}
                title={'Vos Favoris'}
                description={"Consultez et organisez vos annonces enregistrées, vos recherches effectuées et les profils de vendeurs consultés"}
            />

            <Tabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
        </div>
    );
};