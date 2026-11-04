import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categoriasIniciais = [
  // Categorias de Despesas
  { nome: 'Alimentação', tipo: 'DESPESA', cor: '#E53E3E' },
  { nome: 'Moradia', tipo: 'DESPESA', cor: '#DD6B20' },
  { nome: 'Transporte', tipo: 'DESPESA', cor: '#D69E2E' },
  { nome: 'Saúde', tipo: 'DESPESA', cor: '#319795' },
  { nome: 'Lazer', tipo: 'DESPESA', cor: '#805AD5' },
  { nome: 'Educação', tipo: 'DESPESA', cor: '#3182CE' },
  { nome: 'Compras', tipo: 'DESPESA', cor: '#D53F8C' },
  { nome: 'Outras Despesas', tipo: 'DESPESA', cor: '#718096' },

  // Categorias de Receitas
  { nome: 'Salário', tipo: 'RECEITA', cor: '#38A169' },
  { nome: 'Rendimentos', tipo: 'RECEITA', cor: '#48BB78' },
  { nome: 'Serviços / Freelance', tipo: 'RECEITA', cor: '#2B6CB0' },
  { nome: 'Outras Receitas', tipo: 'RECEITA', cor: '#4A5568' },
];

async function main() {
  console.log('🌱 Iniciando o seed de categorias...');

  for (const categoria of categoriasIniciais) {
    const existe = await prisma.categoria.findFirst({
      where: { nome: categoria.nome, tipo: categoria.tipo },
    });

    if (!existe) {
      await prisma.categoria.create({
        data: categoria,
      });
      console.log(`  + Categoria criada: [${categoria.tipo}] ${categoria.nome}`);
    } else {
      console.log(`  ~ Categoria ja existe: [${categoria.tipo}] ${categoria.nome}`);
    }
  }

  console.log('✅ Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante a execucao do seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
