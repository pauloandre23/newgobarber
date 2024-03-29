import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

import databaseConfig from '../config/database';

const models = [User, File, Appointment];

class Database{
    constructor(){
        this.init(); //conexao com a base de dados
        this.mongo();
    }
    init(){
        this.connection = new Sequelize(databaseConfig);

        models 
        .map(model=> model.init(this.connection))
        .map(model=> model.associate && model.associate(this.connection.models));
        
    }
    mongo() {
        this.mongoConnection = mongoose.connect(
            'mongodb://localhost:27017/bootcampnodejs', 
            {useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true}
            );
        }
}

export default new Database();