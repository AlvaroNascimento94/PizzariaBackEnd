import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const accessProfiles = [
    { name: 'Admin' },
    { name: 'Waiter' },
    { name: 'Chef' },
    { name: 'Cashier' },
  ];

  console.log('Criando perfis de acesso...');
  
  const createdProfiles: Record<string, any> = {};

  for (const profile of accessProfiles) {
    let existing = await prisma.accessProfile.findFirst({
      where: { name: profile.name },
    });

    if (!existing) {
      existing = await prisma.accessProfile.create({
        data: profile,
      });
      console.log(`Perfil criado: ${profile.name}`);
    } 
    createdProfiles[profile.name] = existing;
  }

  const permissions = [
    { name: 'CREATE' },
    { name: 'READ' },
    { name: 'UPDATE' },
    { name: 'DELETE' },
  ];

  console.log('\nCriando permissões...');
  
  const createdPermissions: Record<string, any> = {};
  
  for (const permission of permissions) {
    let existing = await prisma.permission.findFirst({
      where: { name: permission.name },
    });

    if (!existing) {
      existing = await prisma.permission.create({
        data: permission,
      });
      console.log(`Permissão criada: ${permission.name}`);
    } 
    createdPermissions[permission.name] = existing;
  }

  const systemOptions = [
    { name: 'Users', parentOptionId: null },
    { name: 'Categories', parentOptionId: null },
    { name: 'Products', parentOptionId: null },
    { name: 'Orders', parentOptionId: null },
    { name: 'Tables', parentOptionId: null },
    { name: 'OrderItems', parentOptionId: null },
    { name: 'OrderStatus', parentOptionId: null },
  ];

  console.log('\nCriando opções do sistema...');
  
  const createdOptions: Record<string, any> = {};
  
  for (const option of systemOptions) {
    let existing = await prisma.systemOption.findFirst({
      where: { name: option.name },
    });

    if (!existing) {
      existing = await prisma.systemOption.create({
        data: option,
      });
      console.log(`Opção criada: ${option.name}`);
    } 
    createdOptions[option.name] = existing;
  }

  console.log('\nConfigurando permissões RBAC...');

  const adminPermissions = [

    { profile: 'Admin', permission: 'CREATE', option: 'Users' },
    { profile: 'Admin', permission: 'READ', option: 'Users' },
    { profile: 'Admin', permission: 'UPDATE', option: 'Users' },
    { profile: 'Admin', permission: 'DELETE', option: 'Users' },

    { profile: 'Admin', permission: 'CREATE', option: 'Categories' },
    { profile: 'Admin', permission: 'READ', option: 'Categories' },
    { profile: 'Admin', permission: 'UPDATE', option: 'Categories' },
    { profile: 'Admin', permission: 'DELETE', option: 'Categories' },

    { profile: 'Admin', permission: 'CREATE', option: 'Products' },
    { profile: 'Admin', permission: 'READ', option: 'Products' },
    { profile: 'Admin', permission: 'UPDATE', option: 'Products' },
    { profile: 'Admin', permission: 'DELETE', option: 'Products' },

    { profile: 'Admin', permission: 'CREATE', option: 'Orders' },
    { profile: 'Admin', permission: 'READ', option: 'Orders' },
    { profile: 'Admin', permission: 'UPDATE', option: 'Orders' },
    { profile: 'Admin', permission: 'DELETE', option: 'Orders' },

    { profile: 'Admin', permission: 'CREATE', option: 'Tables' },
    { profile: 'Admin', permission: 'READ', option: 'Tables' },
    { profile: 'Admin', permission: 'UPDATE', option: 'Tables' },
    { profile: 'Admin', permission: 'DELETE', option: 'Tables' },

    { profile: 'Admin', permission: 'CREATE', option: 'OrderItems' },
    { profile: 'Admin', permission: 'READ', option: 'OrderItems' },
    { profile: 'Admin', permission: 'UPDATE', option: 'OrderItems' },
    { profile: 'Admin', permission: 'DELETE', option: 'OrderItems' },

    { profile: 'Admin', permission: 'CREATE', option: 'OrderStatus' },
    { profile: 'Admin', permission: 'READ', option: 'OrderStatus' },
    { profile: 'Admin', permission: 'UPDATE', option: 'OrderStatus' },
    { profile: 'Admin', permission: 'DELETE', option: 'OrderStatus' },
  ];

  const waiterPermissions = [

    { profile: 'Waiter', permission: 'CREATE', option: 'Orders' },
    { profile: 'Waiter', permission: 'READ', option: 'Orders' },
    { profile: 'Waiter', permission: 'UPDATE', option: 'Orders' },

    { profile: 'Waiter', permission: 'CREATE', option: 'OrderItems' },
    { profile: 'Waiter', permission: 'READ', option: 'OrderItems' },
    { profile: 'Waiter', permission: 'UPDATE', option: 'OrderItems' },
    { profile: 'Waiter', permission: 'DELETE', option: 'OrderItems' },

    { profile: 'Waiter', permission: 'READ', option: 'Products' },
    { profile: 'Waiter', permission: 'READ', option: 'Categories' },
    { profile: 'Waiter', permission: 'READ', option: 'Tables' },
  ];

  const chefPermissions = [
    { profile: 'Chef', permission: 'READ', option: 'Orders' },
    { profile: 'Chef', permission: 'UPDATE', option: 'OrderStatus' },
    { profile: 'Chef', permission: 'READ', option: 'OrderItems' },
  ];

  const cashierPermissions = [
    { profile: 'Cashier', permission: 'READ', option: 'Orders' },
    { profile: 'Cashier', permission: 'UPDATE', option: 'Orders' },
    { profile: 'Cashier', permission: 'READ', option: 'Tables' },
    { profile: 'Cashier', permission: 'READ', option: 'OrderItems' },
  ];

  const allPermissions = [
    ...adminPermissions,
    ...waiterPermissions,
    ...chefPermissions,
    ...cashierPermissions,
  ];

  for (const perm of allPermissions) {
    const existing = await prisma.accessProfilePermission.findUnique({
      where: {
        accessProfileId_permissionId_systemOptionId: {
          accessProfileId: createdProfiles[perm.profile].id,
          permissionId: createdPermissions[perm.permission].id,
          systemOptionId: createdOptions[perm.option].id,
        },
      },
    });

    if (!existing) {
      await prisma.accessProfilePermission.create({
        data: {
          accessProfileId: createdProfiles[perm.profile].id,
          permissionId: createdPermissions[perm.permission].id,
          systemOptionId: createdOptions[perm.option].id,
        },
      });
      console.log(`${perm.profile}: ${perm.permission} em ${perm.option}`);
    }
  }

  console.log('\nPermissões RBAC configuradas com sucesso!\n');

  const statusData = [
    { name: 'Aguardando' },
    { name: 'Em Preparo' },
    { name: 'Pronto' },
    { name: 'Em Entrega' },
    { name: 'Finalizado' },
    { name: 'Cancelado' },
    { name: 'Iniciado' }
  ];

  console.log('Criando status de pedidos...');
  
  for (const status of statusData) {
    const existing = await prisma.orderStatus.findFirst({
      where: { name: status.name },
    });

    if (!existing) {
      await prisma.orderStatus.create({
        data: status,
      });
      console.log(`Status criado: ${status.name}`);
    } 
  }

  const paymentTypes = [
    { name: 'Dinheiro' },
    { name: 'Cartão de Crédito' },
    { name: 'Cartão de Débito' },
    { name: 'PIX' },
  ];

  console.log('\nCriando tipos de pagamento...');
  
  for (const type of paymentTypes) {
    const existing = await prisma.paymentType.findFirst({
      where: { name: type.name },
    });

    if (!existing) {
      await prisma.paymentType.create({
        data: type,
      });
      console.log(`Tipo criado: ${type.name}`);
    } 
  }

  const paymentStatuses = [
    { name: 'Pendente' },
    { name: 'Pago' },
    { name: 'Cancelado' },
  ];

  console.log('\nCriando status de pagamento...');
  
  for (const status of paymentStatuses) {
    const existing = await prisma.paymentStatus.findFirst({
      where: { name: status.name },
    });

    if (!existing) {
      await prisma.paymentStatus.create({
        data: status,
      });
      console.log(`Status criado: ${status.name}`);
    } 
  }

  console.log('\nCriando as mesas...');
  
  for (let i = 1; i <= 10; i++) {
    const tableName = `Mesa ${i}`;
    const existing = await prisma.table.findFirst({
      where: { name: tableName },
    });

    if (!existing) {
      await prisma.table.create({
        data: { name: tableName, available: true },
      });
      console.log(`Mesa criada: ${tableName}`);
    } 
  }
  

  console.log('\nSeed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
