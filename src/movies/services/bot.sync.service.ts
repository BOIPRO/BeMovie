// Crawl data fro Anilist
import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { Cron, CronExpression } from '@nestjs/schedule';
import Piscina from 'piscina';
import * as path from 'path';
import {PATHS} from 'src/shared/path.config'
@Injectable()
export class BotService implements OnModuleDestroy {
    private piscina: Piscina;
    constructor() {
        this.piscina = new Piscina({
            filename: PATHS.BOT_WORKER_DEV,
            minThreads: 1,
            maxThreads: 1,
        });
    }
    @Cron(CronExpression.EVERY_DAY_AT_2AM)
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