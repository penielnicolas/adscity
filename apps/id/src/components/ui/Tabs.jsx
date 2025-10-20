import '../../styles/components/ui/Tabs.scss';

export default function Tabs({ tabs = [], activeTab, setActiveTab }) {
    return (
        <div className="tabs">
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    className={`tab ${activeTab === tab.value ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.value)}
                >
                    {tab.icon && <span className="icon">{tab.icon}</span>}
                    <span className="label">{tab.label}</span>
                </button>
            ))}
        </div>
    );
};
