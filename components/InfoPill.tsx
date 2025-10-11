
const InfoPill = ({ image, text }: InfoPillProps) => {
    return (
        <figure className="info-pill">
            <img src={image} alt={text} className="" />
            <figcaption>{text}</figcaption>
        </figure>
    )
}

export default InfoPill