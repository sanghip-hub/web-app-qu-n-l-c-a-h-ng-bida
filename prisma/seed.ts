import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const venueCount = await prisma.venue.count();
  if (venueCount === 0) {
    await prisma.venue.createMany({
      data: [
        { name: "Bàn 1", type: "BILLIARD", hourlyRate: 50000 },
        { name: "Bàn 2", type: "BILLIARD", hourlyRate: 50000 },
        { name: "Bàn 3", type: "BILLIARD", hourlyRate: 60000 },
        { name: "Bàn 4", type: "BILLIARD", hourlyRate: 60000 },
        { name: "Bàn 5", type: "BILLIARD", hourlyRate: 70000 },
        { name: "Sân A", type: "COURT", hourlyRate: 120000 },
        { name: "Sân B", type: "COURT", hourlyRate: 120000 },
        { name: "Sân C", type: "COURT", hourlyRate: 150000 },
      ],
    });
  }

  const productCount = await prisma.product.count();
  if (productCount === 0) {
    await prisma.product.createMany({
      data: [
        { name: "Nước lọc", category: "Nước uống", price: 10000 },
        { name: "Coca Cola", category: "Nước uống", price: 20000 },
        { name: "Bia Heineken", category: "Bia", price: 35000 },
        { name: "Bia Tiger", category: "Bia", price: 30000 },
        { name: "Bánh mì", category: "Đồ ăn", price: 25000 },
        { name: "Mì tôm", category: "Đồ ăn", price: 15000 },
        { name: "Thuốc lá", category: "Khác", price: 30000 },
      ],
    });
  }

  const equipmentCount = await prisma.equipment.count();
  if (equipmentCount === 0) {
    await prisma.equipment.createMany({
      data: [
        { name: "Gậy bida cơ bản", rentalPrice: 10000, rentalUnit: "PER_USE", available: 10 },
        { name: "Gậy bida cao cấp", rentalPrice: 20000, rentalUnit: "PER_USE", available: 5 },
        { name: "Vợt cầu lông", rentalPrice: 15000, rentalUnit: "PER_USE", available: 8 },
        { name: "Vợt pickleball", rentalPrice: 20000, rentalUnit: "PER_USE", available: 6 },
        { name: "Bóng đá", rentalPrice: 30000, rentalUnit: "PER_USE", available: 4 },
        { name: "Giày thể thao", rentalPrice: 20000, rentalUnit: "PER_USE", available: 10 },
      ],
    });
  }

  console.log("Seed data created successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
