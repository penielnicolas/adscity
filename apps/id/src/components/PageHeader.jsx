import { ChevronRight } from 'lucide-react';
import '../styles/components/PageHeader.scss';
import Label from './ui/Label';

export default function PageHeader({ title, description, location, onClick, rightContent }) {
    return (
        <div className="page-header">
            <div className="page-header__breadcrumb">
                <div onClick={onClick}>Compte</div>
                <ChevronRight size={16} />
                <div className='location'> {location ? `${location}` : ''}</div>
            </div>
            <div className="page-header__content">
                <div className="header__title">
                    <Label size='h4' weight='regular' text={title} />
                    {rightContent && <div>
                        {rightContent}
                    </div>
                    }

                </div>
                {description && (
                    <Label size='p' weight='normal' text={description} />
                )}
            </div>
        </div>
    );
};
