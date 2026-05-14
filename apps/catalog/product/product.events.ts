export type ProductCreatedEvent = {
  productId: string;
  name: string;
  description: string;
  imageUrl?: string;
  status: "DRAFT" | "ACTIVE";
  price:number;
  createdBy:string
};
