import crypto from "crypto";

export class CarOnSaleClientHelper {
    public hashPasswordsWithCycles(plainTextPassword: string, cycles: number) {
        let hash = `${plainTextPassword}`;
        for (let i = 0; i < cycles; i++) {
            hash = this.sha512(hash);
        }
        return hash;
    }

    private sha512(message: string): string {
        const sha512 = crypto.createHash("sha512");
        sha512.update(message);
        return sha512.digest("hex");
    }
}