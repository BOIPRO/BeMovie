// Crawl data fro Anilist
import { Injectable, OnModuleDestroy } from "@nestjs/common";
import Piscina from 'piscina';
import {PATHS} from 'src/shared/path.config'
@Injectable()
export class BotService implements OnModuleDestroy {
    private piscinaBot1: Piscina;
    private piscinaBot2: Piscina;
    constructor() {
        this.piscinaBot1 = new Piscina({
            filename: PATHS.METADATA_WORKER_PRODUCT,
            minThreads: 1,
            maxThreads: 1,
        });
        this.piscinaBot2 = new Piscina({
            filename: PATHS.CHECKDATA_WORKER_PRODUCT,
            minThreads: 1,
            maxThreads: 1,
        });
    }
    async getMetadata() {
        try {
            const config = {
                dbUrl: process.env.MONGOOSE_URI,
            };
            console.log("Hoan thanh worker")
            return await this.piscinaBot1.run(config);
        } catch (error) {
            console.log("Loi worker: ", error)
        }
    }
    async updateData() {
        try {
            const config = {
                dbUrl: process.env.MONGOOSE_URI,
            };
            console.log("Hoan thanh worker")
            return await this.piscinaBot2.run(config);
        } catch (error) {
            console.log("Loi worker: ", error)
        }
    }
    async onModuleDestroy() {
        await this.piscinaBot1.destroy();
        await this.piscinaBot2.destroy();
    }
}