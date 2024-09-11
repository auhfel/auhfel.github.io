class Vector3 {
    constructor(x=0,y=0,z=0){
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Add(otherVector) {
        return new Vector3(this.x + otherVector.x,
            this.y + otherVector.y,
            this.z + otherVector.z
        );
    }
    Subtract(otherVector) {
        return new Vector3(this.x - otherVector.x,
            this.y - otherVector.y,
            this.z - otherVector.z
        );
    }
    Multiply(amount) {
        return new Vector3(this.x * amount, this.y * amount, this.z * amount);
    }
    Divide(amount){
        return new Vector3(this.x / amount, this.y / amount, this.z / amount);
    }
}