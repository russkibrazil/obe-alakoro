import Image from "./Image";

interface CardProps {
  src: string;
  productName: string;
  price: string;
}

function Card({ src, productName, price }: CardProps) {
  return (
    <div className="card">
      <Image
        src={src}
        alt={productName}
        width={300}
        height={300}
      />

      <h2>{productName}</h2>
      <p>{price}</p>
    </div>
  );
}

export default Card;