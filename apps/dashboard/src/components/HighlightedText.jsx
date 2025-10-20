import '../styles/components/HighlightedText.scss';

export default function HighlightedText({ text, query }) {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;

    return (
        <>
            {text.slice(0, index)}
            <strong>{text.slice(index, index + query.length)}</strong>
            {text.slice(index + query.length)}
        </>
    );
};
