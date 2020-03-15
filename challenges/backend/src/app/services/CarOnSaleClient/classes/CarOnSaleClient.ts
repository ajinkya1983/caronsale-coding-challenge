import { ICarOnSaleClient } from '../interface/ICarOnSaleClient';
import { injectable } from "inversify";
import request from "request-promise"
import { CarOnSaleClientHelper } from "./CarOnSaleClientHelper";
import { AuctionItem } from '../types/AuctionItem';

@injectable()
export class CarOnSaleClient implements ICarOnSaleClient {

    private userId: string;
    private token: string;
    public apiEndPoint = 'https://caronsale-backend-service-dev.herokuapp.com/api/v1';
    private userMailId = 'salesman@random.com';
    private userPassword = '123test';
    private hashCycles = 5;
    private authData;

    public async getRunningAuctions(): Promise<AuctionItem[]> {
        await this.authenticate();
        return request({
            method: "GET",
            uri: `${this.apiEndPoint}/auction/salesman/${this.userMailId}/_all`,
            json: true,
            headers: {
                userid: this.userId,
                authtoken: this.token
            }
        }).then((response: any) => {
            const auctionItems: AuctionItem[] = [];
            response.forEach(element => {
                    const auctionItem = new AuctionItem(element.currentHighestBidValue, element.numBids, element.minimumRequiredAsk || 0);
                    auctionItems.push(auctionItem);
            });
            return auctionItems;
        });
    }

    private async authenticate() {
        const CarOnSaleApiHelper = new CarOnSaleClientHelper()

        await request({
            method: "PUT",
            uri: `${this.apiEndPoint}/authentication/${this.userMailId}`,
            json: true,
            body: {
                password: CarOnSaleApiHelper.hashPasswordsWithCycles("123test", 5)
            }
        }).then(response => {
            this.userId = response.userId;
            this.token = response.token;
        });
    }
}