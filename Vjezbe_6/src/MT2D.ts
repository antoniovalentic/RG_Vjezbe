/**
 * Class for 2D matrix manipulation
 */
class MT2D {
    public matrix: number[][];

    public sx: number;
    public sy: number;
    public tx: number;
    public ty: number;

    constructor() {
        this.setIdentityMatrix();
        this.sx = 1;
        this.sy = 1;
        this.tx = 1;
        this.ty = 1;
    }

    /**
     * Returns identity matrix
     * @returns {number[][]} Identity matrix
     */
    public static getIdentityMatrix(): number[][] {
        return [[1,0,0],[0,1,0],[0,0,1]];
    }

    /**
     * Converts degrees to radians
     * @param degrees value expressed in degrees
     * @returns value expressed in radians
     */
    public static toRad(degrees: number): number {
        return degrees * Math.PI / 180;
    }

    /** Set identity matrix */
    public setIdentityMatrix(): void {
        this.matrix = MT2D.getIdentityMatrix();
    }

    /**
     * Multiplies current MT2D matrix with input matrix
     * @param m input matrix
     */
    public mult(m: number[][]) {
        let m1 = [[0,0,0],[0,0,0],[0,0,0]];
        for (let i=0; i<3; i++){
            for (let j=0; j<3; j++){
                for (let k=0; k<3; k++){
                    m1[i][j] += m[i][k] * this.matrix[k][j];
                }
            }
        }
        this.matrix = m1;
    }

    /**
     * Appyl transormation matrix for translation
     * @param px X translation factor
     * @param py Y translation factor
     */
    public translate(px: number, py: number): void {
        let m = [[1,0,px],[0,1,py],[0,0,1]];
        this.mult(m);
    }

    /**
     * Apply transormation matrix for scaling
     * @param sx X scale factor
     * @param sy Y scale factior
     */
    public scale(sx: number, sy: number): void {
        let m = [[sx,0,0],[0,sy,0],[0,0,1]];
        this.mult(m);
    }

    /**
     * Apply transormation matrix for rotation
     * @param angle rotation angle (in radians)
     */
    public rotate(angle: number): void {
        let m = [[Math.cos(angle),-Math.sin(angle),0],[Math.sin(angle),Math.cos(angle),0],[0,0,1]];
        this.mult(m);
    }

    /** Apply transformation matrix that mirrors the vectors for X axis */
    public mirrorForX(): void {
        let m = [[1,0,0],[0,-1,0],[0,0,1]];
        this.mult(m);
    }

    /** Apply transformation matrix that mirrors the vectors for Y axis */
    public mirrorForY(): void {
        let m = [[-1,0,0],[0,1,0],[0,0,1]];
        this.mult(m);
    }

    /**
     * Apply transformation matrix that mirrors the vectors for y = kx + l line
     * @param k 
     * @param l 
     */
    public mirrorFor(k: number, l: number): void {
        var alpha = Math.atan(k);
        this.translate(0, -l);
        this.rotate(-alpha);
        this.mirrorForX();
        this.rotate(alpha);
        this.translate(0, l);
    }

    /**
     * Rotate around (x0, y0) point for a given angle
     * @param x0 X coordinate
     * @param y0 Y coordinate
     * @param angle angle in radians
     */
    public rotate_around_point(x0: number, y0: number, angle: number){
        this.translate(x0, y0);
        this.rotate(angle);
        this.translate(-x0, -y0);
    }
    
    public stretch(alpha: number, beta: number): void {
        let m = [[1,Math.tan(beta),0],[Math.tan(alpha),1,0],[0,0,1]];
        this.mult(m);
    }

    /**
     * Transform MT2D matrix into 1D array for use with gl uniformMatrix3fv function
     * @returns List containing matrix members
     */
    public list() {
        var list = [];
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                list.push(this.matrix[j][i]);
            }
        }
        return list;
    }

    /**
     * Maps the coordinates from the given range to the normalized coordinates between -1 and 1 
     * @param xmin 
     * @param xmax 
     * @param ymin 
     * @param ymax 
     */
    public projection2D(xmin: number, xmax: number, ymin: number, ymax: number) {
        this.sx = 2 / (xmax - xmin);
        this.sy = 2 / (ymax - ymin);
        this.tx = (xmin + xmax) / (xmin - xmax);
        this.ty = (ymin + ymax) / (ymin - ymax);

        //this.mult([[sx, 0, tx], [0, sy, ty], [0, 0, 1]]);
    }

    public transX(x: number){
        return this.sx * x + this.tx;
    }
    public transY(y: number){
        return this.sy * y + this.ty;
    }
}