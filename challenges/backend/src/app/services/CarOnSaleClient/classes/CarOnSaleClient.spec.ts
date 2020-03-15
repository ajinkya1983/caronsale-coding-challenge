import "reflect-metadata"
import { CarOnSaleClient } from "./CarOnSaleClient";
import { ICarOnSaleClient } from "../interface/ICarOnSaleClient";
import { expect } from "chai";
import sinon from 'sinon';


describe('CarOnSaleClient class test', function () {
    let client: ICarOnSaleClient;

    this.beforeEach(() => { client = new CarOnSaleClient(); })

    it('Should return array of running auctions', async () => {
        const returnList = [
            { numBids: 1, currentHighestBidValue: 1, minimumRequiredAsk: 10 },
            { numBids: 2, currentHighestBidValue: 2, minimumRequiredAsk: 20 },
            { numBids: 3, currentHighestBidValue: 3, minimumRequiredAsk: 30 },
        ];
        CarOnSaleClient.prototype.getRunningAuctions = sinon.fake.returns(returnList);

        const result = await client.getRunningAuctions();

        expect(JSON.stringify(result)).to.equal(JSON.stringify(returnList));
    });
});