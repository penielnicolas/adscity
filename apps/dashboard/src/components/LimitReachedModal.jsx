import Modal from "./ui/Modal";

export default function LimitReachedModal({ isOpen, onClose, onUpgrade }) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Limite atteinte"
            size="md"
        >
            <div>
                <h2>Limite atteinte</h2>
                <p>Vous avez atteint la limite de vos publications.</p>
                <button onClick={onUpgrade}>Mettre à niveau</button>
            </div>
        </Modal>
    )
}
