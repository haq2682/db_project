class Role {
    id:number;
    role:string;
    created_at:Date;
    updated_at:Date;

    public constructor() {
        this.id = 0;
        this.role = '';
        this.created_at = new Date();
        this.updated_at = new Date();
    }
}

export default Role;