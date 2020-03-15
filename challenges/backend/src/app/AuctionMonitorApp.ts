import { inject, injectable } from "inversify";
import { ILogger } from "./services/Logger/interface/ILogger";
import { DependencyIdentifier } from "./DependencyIdentifiers";
import "reflect-metadata";
import { ICarOnSaleClient } from "./services/CarOnSaleClient/interface/ICarOnSaleClient";
import { AuctionItem } from "./services/CarOnSaleClient/types/AuctionItem";

@injectable()
export class AuctionMonitorApp {

    public constructor(@inject(DependencyIdentifier.LOGGER) private logger: ILogger,
        @inject(DependencyIdentifier.CLIENT) private client: ICarOnSaleClient) {
    }

    public async start(): Promise<void> {
        this.logger.log(`Auction Monitor started.`);

        this.client.getRunningAuctions()
            .then((response: AuctionItem[]) => {
                const numAuctions: number = response.length;
                let totalBids: number = 0
                let progressRatio: number = 0;
                response.forEach(auctionItem => {
                    totalBids += auctionItem.numberOfBids;
                    progressRatio += auctionItem.currentBidValue / (auctionItem.minimumAsk || auctionItem.currentBidValue);
                });
                // calculate average bids and average auction progress percent
                const avgNumBids: number = totalBids / numAuctions;
                const avgAuctionProgressPercent = (progressRatio / numAuctions) * 100;

                this.logger.log(`Running Auctions Count: ${numAuctions}`);
                this.logger.log(`Average bids in an Auction: ${avgNumBids}`);
                this.logger.log(`Auction average progress: ${avgAuctionProgressPercent.toFixed(2)}%`);
                process.exit();
            })
            .catch(() => process.exit(1));
    }

}