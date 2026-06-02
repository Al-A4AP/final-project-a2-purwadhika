import prisma from '../../src/config/prisma';
import { PROPERTY_SEEDS } from '../seed/data';
import { getPropertyAmenities } from '../seed/amenities';

type PropertyAmenityUpdate = {
  id: string;
  name: string;
  current: string[];
  next: string[];
};

const applyChanges = process.env.APPLY_AMENITIES === 'true';
const seedNames = PROPERTY_SEEDS.map((seed) => seed.name);
const write = (message: string) => process.stdout.write(`${message}\n`);

const unique = (items: string[]) =>
  Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));

const areEqual = (left: string[], right: string[]) =>
  left.length === right.length && left.every((item) => right.includes(item));

const buildNextAmenities = (name: string, current: string[]) =>
  unique([...current, ...getPropertyAmenities(name)]);

const getUpdates = async (): Promise<PropertyAmenityUpdate[]> => {
  const properties = await findSeedProperties();
  return properties.map(buildAmenityUpdate).filter(needsUpdate);
};

const findSeedProperties = () =>
  prisma.property.findMany({
    where: { deleted_at: null, name: { in: seedNames } },
    select: { id: true, name: true, amenities: true },
    orderBy: { name: 'asc' },
  });

const buildAmenityUpdate = (property: Awaited<ReturnType<typeof findSeedProperties>>[number]) => {
  const current = property.amenities || [];
  return {
    id: property.id,
    name: property.name,
    current,
    next: buildNextAmenities(property.name, current),
  };
};

const needsUpdate = (item: PropertyAmenityUpdate) =>
  !areEqual(item.current, item.next);

const printPlan = (updates: PropertyAmenityUpdate[]) => {
  write(`MODE=${applyChanges ? 'APPLY' : 'DRY_RUN'}`);
  write(`MATCHED_FOR_UPDATE=${updates.length}`);
  updates.forEach((item) => {
    write(`- ${item.name}`);
    write(`  current=[${item.current.join(',')}]`);
    write(`  next=[${item.next.join(',')}]`);
  });
};

const applyUpdates = async (updates: PropertyAmenityUpdate[]) => {
  await prisma.$transaction(
    updates.map((item) =>
      prisma.property.update({
        where: { id: item.id },
        data: { amenities: item.next },
      }),
    ),
  );
};

const main = async () => {
  const updates = await getUpdates();
  printPlan(updates);
  if (!applyChanges || updates.length === 0) return;
  await applyUpdates(updates);
  write(`UPDATED=${updates.length}`);
};

main()
  .catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
