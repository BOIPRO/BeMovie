// Crawl data fro Anilist
import { Injectable, OnModuleDestroy } from "@nestjs/common";
import Piscina from 'piscina';
import {PATHS} from 'src/shared/path.config'
@Injectable()
export class BotService implements OnModuleDestroy {
    private piscina: Piscina;
    constructor() {
        this.piscina = new Piscina({
            filename: PATHS.BOT_WORKER_PRODUCT,
            minThreads: 1,
            maxThreads: 1,
        });
    }
    async runTask() {
        try {
            const config = {
                dbUrl: process.env.MONGOOSE_URI,
            };
            console.log("Hoan thanh worker")
            return await this.piscina.run(config);
        } catch (error) {
            console.log("Loi worker: ", error)
        }
    }
    async onModuleDestroy() {
        await this.piscina.destroy();
    }
}