import {mongoose} from 'mongoose';

//Schema pour créer un avis
export const avisSchema = new mongoose.Schema({
    idToilette: {type: Number, required: true},
    ranking: {type: Number, required: true},
})

