// prisma/seed.js

const { PrismaClient } = require("@prisma/client");
const userData = require("../src/lib/seeders/users.json");
const membershipData = require("../src/lib/seeders/membership.json");
const documentData = require("../src/lib/seeders/document.json");

const prisma = new PrismaClient();

async function main() {
	console.log(`Start seeding ...`);

	for (const d of documentData) {
		const document = await prisma.document.create({
			data: {
				id: d.id,
				documentUrl: d.documentUrl,
				createdAt: new Date(),
				updatedAt: new Date()
			},
		});
		console.log(`Created document with id: ${document.id}`);
	}

	for (const m of membershipData) {
		const membership = await prisma.membership.create({
			data: {
				id: m.id,
				documentId: m.documentId,
				type: m.type,
				createdAt: new Date(),
				updatedAt: new Date()
			},
		});
		console.log(`Created membership with id: ${membership.id}`);
	}



	for (const u of userData) {
		const user = await prisma.user.create({
			data: {
				id: u.id,
				memberId: u.memberId,
				name: u.name,
				email: u.email,
				birthday: new Date(u.birthday),
				createdAt: new Date(),
				updatedAt: new Date()
			},
		});
		console.log(`Created user with id: ${user.id}`);
	}

	console.log(`Seeding finished.`);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
