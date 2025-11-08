export class Score{

    constructor(
        public id : number,
        public pseudo : string | null,
        public date : string | null,
        public timeInSeconds : number,
        public scoreValue : number,
        public isPublic : boolean
    ){}

}