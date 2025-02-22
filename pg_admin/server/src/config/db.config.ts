import { PrismaClient } from '../../generated/global';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

export default prisma;