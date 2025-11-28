import axios from 'axios';


export interface UploadedImage {
  url: string;
  publicId: string;
}

export interface ProductImages {
  images: UploadedImage[];
  mainImage: UploadedImage | null;
}

// Tipo para crear productos
export interface ProductFormData {
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  images: UploadedImage[];
  mainImage: UploadedImage | null;
}


export interface Product extends ProductFormData {
  _id: string;
  originalPrice?: number;
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
}


const API_URL = process.env.NEXT_PUBLIC_API_URL;
// Servicios de Productos
export const productService = {
  async getProducts() {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  },

  async getProductById(id: string) {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  },

  async createProduct(data: ProductFormData) {
    const response = await axios.post(`${API_URL}/products`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  async updateProduct(id: string, data: Partial<ProductFormData>) {
    const response = await axios.put(`${API_URL}/products/${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  async deleteProduct(id: string) {
    const response = await axios.delete(`${API_URL}/products/${id}`);
    return response.data;
  }
};

// Servicios de Imágenes
export const imageService = {
  async uploadImage(file: File): Promise<UploadedImage> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return {
      url: response.data.secure_url,
      publicId: response.data.public_id,

    };
  },

  async uploadMultipleImages(files: FileList): Promise<UploadedImage[]> {
    const uploadPromises = Array.from(files).map(file => this.uploadImage(file));
    return Promise.all(uploadPromises);
  },

  async deleteImage(publicId: string) {
    const response = await axios.delete(`/api/upload/${publicId}`);
    return response.data;
  }
};