"use client"
import { useEffect } from "react";
import { z } from "zod"


const productSchema = z.object({
  name: z.string(),
  price: z.number(),
});


type TProduct = z.infer<typeof productSchema>;

const Product = () => {
  useEffect(() => {
    fetch("/api/product")
      .then((res) => res.json())
      .then((product: TProduct) => {
        
        //use Zod to validate the product

        const validateProduct = productSchema.safeParse(product);

        if(!validateProduct.success) {
          console.error(validateProduct.error)
          return
        }
        console.log(validateProduct.data.name)

        // console.log(product.name?.toLocaleUpperCase())

        // if (typeof product.price === "number") {
        //   console.log(product?.price?.toFixed(2))
        // }
      });
  }, []);

  return (
    <div>
      <p>Test</p>
    </div>
  );
};

export default Product;
