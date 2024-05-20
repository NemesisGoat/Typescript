class Member {
    
    value: number;
    power: number;

    constructor (value = 0, power = 0) {
        this.value = value;
        this.power = power;
    }

    toString() {
        return this.value ? `${this.value}*x^${this.power}` : '0';
    }
}

export default Member;