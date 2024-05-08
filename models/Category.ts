class Category {
    public id:number;
    public category:string;
    public created_at:Date;
    public updated_at:Date;

    public constructor() {
        this.id = 0;
        this.category = '';
        this.created_at = new Date();
        this.updated_at = new Date();
    }
}

export default Category;