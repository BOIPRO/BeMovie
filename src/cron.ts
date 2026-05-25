import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BotService } from './movies/services/bot.sync.service'; 

async function bootstrap() {
    const appContext = await NestFactory.createApplicationContext(AppModule);
    
    const botService = appContext.get(BotService);

    try {
        console.log("Bắt đầu chạy task crawl anime...");
        await botService.runTask();
        console.log("Crawl hoàn tất!");
    } catch (error) {
        console.error("Crawl thất bại:", error);
    } finally {
        await appContext.close();
        process.exit(0);
    }
}

bootstrap();