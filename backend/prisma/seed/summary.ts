import type { Order, Property, Review, Room } from '@prisma/client';
import { DEFAULT_PASSWORD } from './data';
import { log } from './log';

type SummaryData = {
  properties: Property[];
  rooms: Room[];
  orders: Order[];
  reviews: Review[];
};

export const printSummary = ({ properties, rooms, orders, reviews }: SummaryData) => {
  log('Seeding selesai.');
  log('='.repeat(50));
  log('Summary:');
  log('  Users     : 3 (tenant@proprrent.com, user1@, user2@)');
  log(`  Properties: ${properties.length}`);
  log(`  Rooms     : ${rooms.length}`);
  log(`  Orders    : ${orders.length}`);
  log(`  Reviews   : ${reviews.length}`);
  log('  Images    : 12 (Cloudinary)');
  log(`  Password  : ${DEFAULT_PASSWORD}`);
  log('='.repeat(50));
};
