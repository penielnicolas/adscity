import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/ui/Button';
import { AlertCircle, FileText, Inbox, LifeBuoy, MessageSquare, Plus, Search, Upload, X } from 'lucide-react';
import { Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { supportTicketsData } from '../../data/mockData';
import { formattedDate } from '../../utils';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import '../../styles/public/HelpCenter.scss';
import ActivityIndicator from '../../components/ui/ActivityIndicator';
import { createTicket } from '../../services/support';

export default function HelpCenter() {
    const [showNewTicketForm, setShowNewTicketForm] = useState(false);

    const [formData, setFormData] = useState({
        subject: '',
        category: '',
        description: '',
        attachments: []
    });

    const [errors, setErrors] = useState({});
    const [isDragging, setIsDragging] = useState(false);

    const [tickets, setTickets] = useState(supportTicketsData);
    const [filteredTickets, setFilteredTickets] = useState(supportTicketsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const [loading, setLoading] = useState(false);

    const categories = [
        { value: '', label: 'Sélectionnez une catégorie', disabled: true },
        { value: 'account', label: 'Problème de compte' },
        { value: 'billing', label: 'Facturation' },
        { value: 'technical', label: 'Problème technique' },
        { value: 'feature', label: 'Demande de fonctionnalité' },
        { value: 'other', label: 'Autre' }
    ];

    // ✅ Filters corrigés
    const filters = [
        { value: 'all', label: 'Tous' },
        { value: 'open', label: 'Ouvert' },
        { value: 'in_progress', label: 'En cours' },
        { value: 'closed', label: 'Fermé' },
    ];

    const formatTicketStatus = (status) => {
        switch (status) {
            case 'open':
                return "Ouvert"
            case 'in_progress':
                return "En cours";
            case 'closed':
                return "Fermé";
            default:
                return "Résolu";
        }
    }

    const handleBack = () => {
        window.history.back();
    }

    // Correction de la faute de frappe dans les données
    const correctedTickets = supportTicketsData.map(ticket => {
        if (ticket.status === 'in_progess') {
            return { ...ticket, status: 'in_progress' };
        }
        return ticket;
    });

    useEffect(() => {
        setTickets(correctedTickets);
        setFilteredTickets(correctedTickets);
    }, []); // pas besoin de mettre correctedTickets dans deps

    // Fonction pour gérer les changements de filtre
    const handleFilterChange = (selected) => {
        const value = selected?.value || "all";
        setStatusFilter(value);

        if (value === "all") {
            setFilteredTickets(
                tickets.filter(ticket =>
                    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    ticket.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } else {
            setFilteredTickets(
                tickets.filter(ticket =>
                    ticket.status === value &&
                    (
                        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        ticket.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                )
            );
        }
    };

    // Fonction pour gérer la recherche
    const handleSearchChange = (value) => {
        const term = value.toLowerCase();
        setSearchTerm(term);

        let results = tickets;

        if (statusFilter !== "all") {
            results = results.filter(ticket => ticket.status === statusFilter);
        }

        if (term) {
            results = results.filter(ticket =>
                ticket.subject.toLowerCase().includes(term) ||
                ticket.category.toLowerCase().includes(term) ||
                ticket.id.toLowerCase().includes(term)
            );
        }

        setFilteredTickets(results);
    };

    const handleInputChange = () => { }

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };


    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, ...files]
        }));
    };

    const removeFile = (index) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, ...files]
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.subject.trim()) {
            newErrors.subject = 'Le sujet est requis';
        }

        if (!formData.category) {
            newErrors.category = 'Veuillez sélectionner une catégorie';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Veuillez décrire votre problème';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        setErrors({});
        setLoading(true);

        try {
            if (validateForm()) {
                // Submit the form
                console.log('Form data:', formData);
                // Add your form submission logic here
                const resp = await createTicket(formData);

                if (resp.success) {
                    setLoading(false);
                    setShowNewTicketForm(false);
                }
            }
        } catch (error) {
            setLoading(false);
        }
    };


    return (
        <div className='help-center'>
            <PageHeader
                onClick={handleBack}
                location={'Aide & Assistance'}
                title={'Aide & Assistance'}
                description={"Obtenez de l'aide et de l'assistance pour les problèmes que vous rencontrez sur les services AdsCity"}
                rightContent={
                    <Button
                        size='sm'
                        icon={<Plus size={16} />}
                        onClick={() => setShowNewTicketForm(true)}
                    >
                        Nouveau Ticket
                    </Button>
                }
            />

            {/* Quick help cards */}
            <div className="quick-help-grid">
                <QuickHelpCard
                    title="FAQs & Guides"
                    icon={<FileText size={24} className="quick-help-icon" />}
                    description="Trouvez des réponses aux questions courantes et des guides utiles"
                />
                <QuickHelpCard
                    title="Support Client"
                    icon={<MessageSquare size={24} className="quick-help-icon" />}
                    description="Contactez notre équipe d'assistance"
                />
            </div>

            {/* New ticket form */}
            {showNewTicketForm && (
                <Card className='new-ticket'>
                    <CardHeader>
                        <CardTitle className="ticket-title">
                            <Plus size={20} />
                            Créer Un Nouveau Ticket D'Assistance
                        </CardTitle>
                        <CardDescription>
                            Soumettez une nouvelle demande à notre équipe d'assistance.
                            Nous vous répondrons dans les plus brefs délais.
                        </CardDescription>
                    </CardHeader>

                    <CardBody>
                        <div>
                            <div className="form-content">
                                <div className="form-field">
                                    <label htmlFor="subject" className="field-label">
                                        Sujet
                                    </label>
                                    <Input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        placeholder="Brève description de votre problème"
                                        icon={<FileText size={18} />}
                                        value={formData.subject}
                                        onChange={(value) => handleChange('subject', value)}
                                        error={errors.subject}
                                    />
                                    {errors.subject && (
                                        <div className="error-message">
                                            <AlertCircle size={14} />
                                            {errors.subject}
                                        </div>
                                    )}
                                </div>

                                <div className="form-field">
                                    <label htmlFor="category" className="field-label">
                                        Catégorie
                                    </label>
                                    <Select
                                        id="category"
                                        name="category"
                                        icon={<FileText size={18} />}
                                        options={categories}
                                        value={formData.category}
                                        onChange={(value) => handleChange('category', value)}
                                        error={errors.category}
                                    />
                                    {errors.category && (
                                        <div className="error-message">
                                            <AlertCircle size={14} />
                                            {errors.category}
                                        </div>
                                    )}
                                </div>

                                <div className="form-field">
                                    <label htmlFor="description" className="field-label">
                                        Description détaillée
                                    </label>
                                    <Input
                                        type="textarea"
                                        id="description"
                                        name="description"
                                        placeholder="Veuillez fournir des détails sur votre problème ou votre demande"
                                        value={formData.description}
                                        onChange={(value) => handleChange('description', value)}
                                        error={errors.description}
                                        rows={5}
                                    />
                                    {errors.description && (
                                        <div className="error-message">
                                            <AlertCircle size={14} />
                                            {errors.description}
                                        </div>
                                    )}
                                </div>

                                <div className="form-field">
                                    <label htmlFor="attachment" className="field-label">
                                        Pièces jointes (facultatif)
                                    </label>
                                    <div
                                        className={`file-uploader ${isDragging ? 'dragging' : ''} ${formData.attachments.length > 0 ? 'has-files' : ''}`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <input
                                            type="file"
                                            id="attachment"
                                            multiple
                                            onChange={handleFileChange}
                                            className="file-input"
                                        />
                                        <label htmlFor="attachment" className="upload-label">
                                            <Upload size={20} />
                                            <span className="upload-text">
                                                <span className="clickable">Cliquez pour télécharger</span> ou glisser-déposer des fichiers ici
                                            </span>
                                            <span className="upload-subtext">Max. 5 fichiers, 10MB chacun</span>
                                        </label>

                                        {formData.attachments.length > 0 && (
                                            <div className="attachments-list">
                                                {formData.attachments.map((file, index) => (
                                                    <div key={index} className="attachment-item">
                                                        <FileText size={14} />
                                                        <span className="file-name">{file.name}</span>
                                                        <span className="file-size">
                                                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className="remove-file"
                                                            onClick={() => removeFile(index)}
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardBody>

                    <CardFooter className="form-footer">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowNewTicketForm(false)}
                            type="button"
                        >
                            Annuler
                        </Button>
                        <Button
                            size="sm"
                            type="submit"
                            onClick={handleSubmit}
                        >
                            {loading ? (
                                <ActivityIndicator
                                    size={24}
                                    type='digital'
                                    color='white'
                                />
                            ) : "Envoyer"}
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* Support tickets */}
            <Card className='support'>
                <CardHeader>
                    <div className="support-header">
                        <CardTitle className="support-title">
                            <Inbox size={18} className="support-title__icon" />
                            Mes Tickets de Support
                        </CardTitle>
                        <CardDescription>
                            Gérez et suivez vos demandes d'assistance
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardBody className="support-content">
                    <div className="support-filters">
                        <div className="support-search">
                            <Input
                                type='text'
                                placeholder='Recherchez des tickets'
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="support-search__input"
                                icon={
                                    <Search className="support-search__icon" size={24} />
                                }
                            />
                        </div>

                        <div className="support-filter">
                            <div className="filter-options">
                                {filters.map(filter => (
                                    <button
                                        key={filter.value}
                                        className={`filter-option ${statusFilter === filter.value ? 'active' : ''}`}
                                        onClick={() => handleFilterChange(filter)}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {searchTerm && (
                            <div className="results-info">
                                {filteredTickets.length} ticket(s) trouvé(s)
                            </div>
                        )}
                    </div>
                    {filteredTickets.length > 0 ? (
                        <div className="support-list">
                            {filteredTickets.map(ticket => (
                                <div key={ticket.id} className="support-item">
                                    <div className="support-item__content">
                                        <div>
                                            <div className="__header">
                                                <p className="__subject">{ticket.subject}</p>
                                                <Badge
                                                    variant={
                                                        ticket.status === 'open'
                                                            ? 'primary'
                                                            : ticket.status === 'in_progress'
                                                                ? 'warning'
                                                                : 'success'
                                                    }
                                                    size="sm"
                                                    className={
                                                        ticket.status === 'open'
                                                            ? '__badge--open'
                                                            : ticket.status === 'in_progress'
                                                                ? '__badge--in-progress'
                                                                : '__badge--resolved'
                                                    }
                                                >
                                                    {formatTicketStatus(ticket.status)}
                                                </Badge>
                                            </div>
                                            <div className="__meta">
                                                <span>Ticket #{ticket.id.split('_')[1]}</span>
                                                <span>Catégorie: {ticket.category}</span>
                                                <span>Date de création: {formattedDate(ticket.date)}</span>
                                            </div>
                                            <p className="__update">
                                                {formatTicketStatus(ticket.status)} {ticket.status === 'open' ? " depuis le" : " le"} {formattedDate(ticket.lastUpdated)}
                                            </p>
                                        </div>
                                        <div className="support-item__actions">
                                            <Button variant="primary" size="sm">Voir plus</Button>
                                            {ticket.status !== 'closed' && (
                                                <Button variant="outline" size="sm">Fermer</Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="support-empty">
                            <LifeBuoy size={40} className="support-empty__icon" />
                            <p className="support-empty__text">Aucun ticket trouvé</p>
                            {searchTerm && (
                                <p className="support-empty__subtext">
                                    Essayez un autre mot-clé ou créez un nouveau ticket
                                </p>
                            )}
                            <Button
                                className="support-empty__button"
                                size='sm'
                                variant='outline'
                                onClick={() => setShowNewTicketForm(true)}
                            >
                                Nouveau ticket
                            </Button>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
};

const QuickHelpCard = ({ title, icon, description }) => {
    return (
        <Card className="quick-help-card">
            <CardBody className="quick-help-card__content">
                <div className="quick-help-card__icon">{icon}</div>
                <h3 className="quick-help-card__title">{title}</h3>
                <p className="quick-help-card__description">{description}</p>
            </CardBody>
            <CardFooter>
                <Button
                    size='sm'
                    variant="ghost"
                    className="quick-help-card__button"
                >
                    Voir
                </Button>
            </CardFooter>
        </Card>
    );
};