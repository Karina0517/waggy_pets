import { MiButton } from "@/components/ui/button/Button";
import { Card } from "@/components/ui/card/Card";
import styles from './page.module.css';
import Image from "next/image";

export default function Home() {
   const products = [
    {
      id: 1,
      title: 'Alimento Premium para Perros',
      description: 'Nutrición balanceada con ingredientes naturales',
      image: 'https://images.pexels.com/photos/1458916/pexels-photo-1458916.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: '49.99',
      originalPrice: '69.99',
      stock: 15,
      rating: 4.8,
      badges: ['Nuevo', 'Oferta'],
      items: ['100% Natural', 'Sin conservantes', 'Alto en proteínas'],
    },
    {
      id: 2,
      title: 'Juguete Interactivo',
      description: 'Diversión garantizada para tu mascota',
      image: 'https://images.pexels.com/photos/1390361/pexels-photo-1390361.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: '24.99',
      stock: 28,
      rating: 4.5,
      badges: ['Popular'],
      items: ['Resistente', 'Material seguro', 'Fácil de limpiar'],
    },
    {
      id: 3,
      title: 'Cama Acolchada',
      description: 'Comodidad premium para el descanso',
      image: 'https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: '89.99',
      originalPrice: '119.99',
      stock: 8,
      rating: 4.9,
      badges: ['Oferta'],
      items: ['Lavable', 'Ortopédica', 'Anti-alergénica'],
    },
    {
      id: 4,
      title: 'Kit de Aseo Completo',
      description: 'Todo lo necesario para el cuidado',
      image: 'https://images.pexels.com/photos/4588065/pexels-photo-4588065.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: '35.99',
      stock: 20,
      rating: 4.7,
      items: ['Cepillo', 'Champú', 'Cortauñas', 'Toalla'],
    } ];
  return (
          <div className={styles.grid}>
            {products.map((product) => (
              <Card
                key={product.id}
                title={product.title}
                description={product.description}
                image={product.image}
                price={product.price}
                originalPrice={product.originalPrice}
                stock={product.stock}
                rating={product.rating}
                badges={product.badges}
                items={product.items}
              >
                <MiButton variant="primary" text="Comprar" />
                <MiButton variant="secondary" text="Ver más" />
              </Card>
            ))}
          </div>
  );
}

