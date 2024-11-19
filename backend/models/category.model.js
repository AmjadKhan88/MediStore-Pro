import mongoose from 'mongoose';


const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    
    status: {
        type: String,
        default:'true',
    },
    
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
},{timestamps: true});



const categoryModel = mongoose.models.Category || mongoose.model('Category',categorySchema);

export default categoryModel;