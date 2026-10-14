import "dotenv/config";
import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import { hashPassword } from "@/services/userHash";

const users = [
  {
    id: "fixture-user-maria",
    name: "Maria Oliveira",
    email: "maria.oliveira@example.com",
    cpf: "52998224725",
    phone: "(11) 99999-1001",
    password: await hashPassword('user-maria'),
    role: "ROLE_ADMIN"
  },
  {
    id: "fixture-user-joao",
    name: "João Santos",
    email: "joao.santos@example.com",
    cpf: "11144477735",
    phone: "(21) 99999-1002",
    password: await hashPassword('user-joao'),
    role: "ROLE_USER"
  },
  {
    id: "fixture-user-ana",
    name: "Ana Costa",
    email: "ana.costa@example.com",
    cpf: "93541134780",
    phone: "(31) 99999-1003",
    password: await hashPassword('user-ana'),
    role: "ROLE_USER"
  },
] satisfies Prisma.UserUncheckedCreateInput[];

const addresses = [
  {
    id: "fixture-address-maria-home",
    userId: "fixture-user-maria",
    label: "Casa",
    recipientName: "Maria Oliveira",
    zipCode: "01310-100",
    street: "Avenida Paulista",
    number: "1000",
    complement: "Apto 42",
    neighborhood: "Bela Vista",
    city: "São Paulo",
    state: "SP",
    isDefault: true,
  },
  {
    id: "fixture-address-maria-work",
    userId: "fixture-user-maria",
    label: "Trabalho",
    recipientName: "Maria Oliveira",
    zipCode: "04538-132",
    street: "Rua Gomes de Carvalho",
    number: "1500",
    complement: "Conjunto 81",
    neighborhood: "Vila Olímpia",
    city: "São Paulo",
    state: "SP",
    isDefault: false,
  },
  {
    id: "fixture-address-joao",
    userId: "fixture-user-joao",
    label: "Casa",
    recipientName: "João Santos",
    zipCode: "22070-002",
    street: "Rua Barata Ribeiro",
    number: "300",
    complement: "Apto 704",
    neighborhood: "Copacabana",
    city: "Rio de Janeiro",
    state: "RJ",
    isDefault: true,
  },
  {
    id: "fixture-address-ana",
    userId: "fixture-user-ana",
    label: "Casa",
    recipientName: "Ana Costa",
    zipCode: "30130-110",
    street: "Rua da Bahia",
    number: "1200",
    complement: null,
    neighborhood: "Centro",
    city: "Belo Horizonte",
    state: "MG",
    isDefault: true,
  },
] satisfies Prisma.AddressUncheckedCreateInput[];

const categories = [
  { id: "fixture-category-roupas", name: "Roupas", slug: "roupas" },
  { id: "fixture-category-acessorios", name: "Acessórios", slug: "acessorios" },
  { id: "fixture-category-casa", name: "Casa e decoração", slug: "casa-decoracao" },
  { id: "fixture-category-papelaria", name: "Papelaria", slug: "papelaria" },
] satisfies Prisma.CategoriaUncheckedCreateInput[];

const products = [
  {
    id: "fixture-product-camiseta",
    name: "Camiseta básica de algodão",
    description: "Camiseta unissex 100% algodão, confortável para o dia a dia.",
    price: "79.90",
    stock: 24,
    sku: "ALAK-CAM-001",
    image: "/images/camiseta-basica.jpg",
    active: true,
    categoriaId: "fixture-category-roupas",
  },
  {
    id: "fixture-product-bolsa",
    name: "Bolsa reutilizável",
    description: "Bolsa de tecido resistente para compras e uso cotidiano.",
    price: "34.90",
    stock: 18,
    sku: "ALAK-BOL-001",
    image: "/images/bolsa-reutilizavel.jpg",
    active: true,
    categoriaId: "fixture-category-acessorios",
  },
  {
    id: "fixture-product-caneca",
    name: "Caneca artesanal",
    description: "Caneca de cerâmica feita à mão, capacidade de 300 ml.",
    price: "44.95",
    stock: 12,
    sku: "ALAK-CAN-001",
    image: "/images/caneca-artesanal.jpg",
    active: true,
    categoriaId: "fixture-category-casa",
  },
  {
    id: "fixture-product-caderno",
    name: "Caderno pautado",
    description: "Caderno de capa dura com 96 folhas pautadas.",
    price: "50.00",
    stock: 30,
    sku: "ALAK-CAD-001",
    image: "/images/caderno-pautado.jpg",
    active: true,
    categoriaId: "fixture-category-papelaria",
  },
  {
    id: "fixture-product-garrafa",
    name: "Garrafa térmica",
    description: "Garrafa de aço inoxidável com capacidade de 500 ml.",
    price: "89.90",
    stock: 0,
    sku: "ALAK-GAR-001",
    image: "/images/garrafa-termica.jpg",
    active: true,
    categoriaId: "fixture-category-acessorios",
  },
  {
    id: "fixture-product-luminaria",
    name: "Luminária de mesa",
    description: "Luminária compacta para leitura e escritório.",
    price: "119.90",
    stock: 5,
    sku: "ALAK-LUM-001",
    image: "/images/luminaria-mesa.jpg",
    active: false,
    categoriaId: "fixture-category-casa",
  },
] satisfies Prisma.ProductUncheckedCreateInput[];

const carts = [
  { id: "fixture-cart-maria", userId: "fixture-user-maria" },
  { id: "fixture-cart-joao", userId: "fixture-user-joao" },
] satisfies Prisma.CartUncheckedCreateInput[];

const cartItems = [
  {
    id: "fixture-cart-item-maria-camiseta",
    cartId: "fixture-cart-maria",
    productId: "fixture-product-camiseta",
    quantity: 1,
  },
  {
    id: "fixture-cart-item-maria-caneca",
    cartId: "fixture-cart-maria",
    productId: "fixture-product-caneca",
    quantity: 2,
  },
  {
    id: "fixture-cart-item-joao-caderno",
    cartId: "fixture-cart-joao",
    productId: "fixture-product-caderno",
    quantity: 1,
  },
] satisfies Prisma.CartItemUncheckedCreateInput[];

const orders = [
  {
    id: "fixture-order-pending",
    status: "PENDING",
    valor: "79.90",
    clientId: "fixture-user-maria",
  },
  {
    id: "fixture-order-confirmed",
    status: "CONFIRMED",
    valor: "89.90",
    clientId: "fixture-user-joao",
  },
  {
    id: "fixture-order-processing",
    status: "PROCESSING",
    valor: "100.00",
    clientId: "fixture-user-maria",
  },
  {
    id: "fixture-order-shipped",
    status: "SHIPPED",
    valor: "159.80",
    clientId: "fixture-user-ana",
  },
  {
    id: "fixture-order-delivered",
    status: "DELIVERED",
    valor: "79.85",
    clientId: "fixture-user-ana",
  },
  {
    id: "fixture-order-canceled",
    status: "CANCELED",
    valor: "34.90",
    clientId: "fixture-user-joao",
  },
  {
    id: "fixture-order-refunded",
    status: "REFUNDED",
    valor: "50.00",
    clientId: "fixture-user-maria",
  },
] satisfies Prisma.PedidoUncheckedCreateInput[];

const orderItems = [
  {
    id: "fixture-order-item-pending-camiseta",
    pedidoId: "fixture-order-pending",
    productId: "fixture-product-camiseta",
    unitPrice: "79.90",
    quantity: 1,
  },
  {
    id: "fixture-order-item-confirmed-garrafa",
    pedidoId: "fixture-order-confirmed",
    productId: "fixture-product-garrafa",
    unitPrice: "89.90",
    quantity: 1,
  },
  {
    id: "fixture-order-item-processing-caderno",
    pedidoId: "fixture-order-processing",
    productId: "fixture-product-caderno",
    unitPrice: "50.00",
    quantity: 2,
  },
  {
    id: "fixture-order-item-shipped-camiseta",
    pedidoId: "fixture-order-shipped",
    productId: "fixture-product-camiseta",
    unitPrice: "79.90",
    quantity: 2,
  },
  {
    id: "fixture-order-item-delivered-bolsa",
    pedidoId: "fixture-order-delivered",
    productId: "fixture-product-bolsa",
    unitPrice: "34.90",
    quantity: 1,
  },
  {
    id: "fixture-order-item-delivered-caneca",
    pedidoId: "fixture-order-delivered",
    productId: "fixture-product-caneca",
    unitPrice: "44.95",
    quantity: 1,
  },
  {
    id: "fixture-order-item-canceled-bolsa",
    pedidoId: "fixture-order-canceled",
    productId: "fixture-product-bolsa",
    unitPrice: "34.90",
    quantity: 1,
  },
  {
    id: "fixture-order-item-refunded-caderno",
    pedidoId: "fixture-order-refunded",
    productId: "fixture-product-caderno",
    unitPrice: "50.00",
    quantity: 1,
  },
] satisfies Prisma.ItemPedidoUncheckedCreateInput[];

const payments = [
  {
    id: "fixture-payment-pending",
    pedidoId: "fixture-order-pending",
    metodo: "PIX",
    status: "PENDENTE",
    valor: "79.90",
    transactionId: null,
  },
  {
    id: "fixture-payment-confirmed",
    pedidoId: "fixture-order-confirmed",
    metodo: "CARTAO_CREDITO",
    status: "APROVADO",
    valor: "89.90",
    transactionId: "txn_fixture_approved_001",
  },
  {
    id: "fixture-payment-processing",
    pedidoId: "fixture-order-processing",
    metodo: "BOLETO",
    status: "PROCESSANDO",
    valor: "100.00",
    transactionId: "txn_fixture_processing_001",
  },
  {
    id: "fixture-payment-shipped",
    pedidoId: "fixture-order-shipped",
    metodo: "CARTAO_DEBITO",
    status: "APROVADO",
    valor: "159.80",
    transactionId: "txn_fixture_approved_002",
  },
  {
    id: "fixture-payment-delivered",
    pedidoId: "fixture-order-delivered",
    metodo: "PIX",
    status: "APROVADO",
    valor: "79.85",
    transactionId: "txn_fixture_approved_003",
  },
  {
    id: "fixture-payment-canceled",
    pedidoId: "fixture-order-canceled",
    metodo: "CARTAO_CREDITO",
    status: "CANCELADO",
    valor: "34.90",
    transactionId: "txn_fixture_canceled_001",
  },
  {
    id: "fixture-payment-refunded",
    pedidoId: "fixture-order-refunded",
    metodo: "PIX",
    status: "ESTORNADO",
    valor: "50.00",
    transactionId: "txn_fixture_refunded_001",
  },
] satisfies Prisma.PagamentoUncheckedCreateInput[];

const deliveries = [
  {
    id: "fixture-delivery-confirmed",
    pedidoId: "fixture-order-confirmed",
    status: "PREPARANDO",
    endereco: "Rua Barata Ribeiro",
    numero: "300",
    complemento: "Apto 704",
    bairro: "Copacabana",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    cep: "22070-002",
    transportadora: "Correios",
    codigoRastreio: null,
    valorFrete: "12.00",
  },
  {
    id: "fixture-delivery-processing",
    pedidoId: "fixture-order-processing",
    status: "PREPARANDO",
    endereco: "Avenida Paulista",
    numero: "1000",
    complemento: "Apto 42",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01310-100",
    transportadora: "Jadlog",
    codigoRastreio: null,
    valorFrete: "15.00",
  },
  {
    id: "fixture-delivery-shipped",
    pedidoId: "fixture-order-shipped",
    status: "EM_TRANSITO",
    endereco: "Rua da Bahia",
    numero: "1200",
    complemento: null,
    bairro: "Centro",
    cidade: "Belo Horizonte",
    estado: "MG",
    cep: "30130-110",
    transportadora: "Correios",
    codigoRastreio: "BR123456789XX",
    valorFrete: "18.00",
  },
  {
    id: "fixture-delivery-delivered",
    pedidoId: "fixture-order-delivered",
    status: "ENTREGUE",
    endereco: "Rua da Bahia",
    numero: "1200",
    complemento: null,
    bairro: "Centro",
    cidade: "Belo Horizonte",
    estado: "MG",
    cep: "30130-110",
    transportadora: "Jadlog",
    codigoRastreio: "JD987654321BR",
    valorFrete: "10.00",
  },
  {
    id: "fixture-delivery-canceled",
    pedidoId: "fixture-order-canceled",
    status: "CANCELADO",
    endereco: "Rua Barata Ribeiro",
    numero: "300",
    complemento: "Apto 704",
    bairro: "Copacabana",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    cep: "22070-002",
    transportadora: null,
    codigoRastreio: null,
    valorFrete: "0.00",
  },
  {
    id: "fixture-delivery-refunded",
    pedidoId: "fixture-order-refunded",
    status: "ENTREGUE",
    endereco: "Avenida Paulista",
    numero: "1000",
    complemento: "Apto 42",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01310-100",
    transportadora: "Correios",
    codigoRastreio: "BR123456789YY",
    valorFrete: "12.00",
  },
] satisfies Prisma.EntregaUncheckedCreateInput[];

async function upsertById<T extends { id: string }>(
  records: T[],
  upsert: (record: T) => Promise<unknown>,
) {
  for (const record of records) {
    await upsert(record);
  }
}

async function main() {
  await upsertById(users, (data) =>
    prisma.user.upsert({ where: { id: data.id }, create: data, update: data }),
  );
  await upsertById(addresses, (data) =>
    prisma.address.upsert({ where: { id: data.id }, create: data, update: data }),
  );
  await upsertById(categories, (data) =>
    prisma.categoria.upsert({ where: { id: data.id }, create: data, update: data }),
  );
  await upsertById(products, (data) =>
    prisma.product.upsert({ where: { id: data.id }, create: data, update: data }),
  );
  await upsertById(carts, (data) =>
    prisma.cart.upsert({ where: { id: data.id }, create: data, update: data }),
  );
  await upsertById(cartItems, (data) =>
    prisma.cartItem.upsert({ where: { id: data.id }, create: data, update: data }),
  );
  await upsertById(orders, (data) =>
    prisma.pedido.upsert({ where: { id: data.id }, create: data, update: data }),
  );
  await upsertById(orderItems, (data) =>
    prisma.itemPedido.upsert({ where: { id: data.id }, create: data, update: data }),
  );
  await upsertById(payments, (data) =>
    prisma.pagamento.upsert({ where: { id: data.id }, create: data, update: data }),
  );
  await upsertById(deliveries, (data) =>
    prisma.entrega.upsert({ where: { id: data.id }, create: data, update: data }),
  );

  console.info("Fixtures criadas ou atualizadas com sucesso.");
}

main()
  .catch((error: unknown) => {
    console.error("Erro ao criar fixtures:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
