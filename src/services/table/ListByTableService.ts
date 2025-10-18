import prismaClient from "../../prisma";

class ListByTableService {
  async execute() {
    const table = prismaClient.table.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return table;
  }
}

export { ListByTableService };
