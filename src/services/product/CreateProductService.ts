import prismaClient from "../../prisma";

interface IProduct{
    name: string,
    price: number,
    description: string,
    banner: string,
    categoryId:string
}

class CreateProductService{
    async execute({name,price,description,banner,categoryId}:IProduct){

        if(!name || !price || !categoryId) throw new Error("Erro de envio")
            
        const product = await prismaClient.product.create({
            data:{
                name,
                price,
                description,
                banner,
                categoryId
            }
        })
        return product

    }
}

export {CreateProductService}
