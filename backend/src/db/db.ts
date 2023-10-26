import { Sequelize, DataTypes, ModelCtor, Model } from "sequelize";
//Wrapper class in case I need to write custom methods, for now will just interface directly with Sequailise ORM

class SqlDb {
    connectionString: string
    dbClient: Sequelize
    connectionStatus: boolean
    //Any other DB Schemas Go here
    SteamUserDb: ModelCtor<Model<any, any>>
    constructor(conString: string) {
      this.connectionString = conString
      this.dbClient = new Sequelize(conString)
      this.connectionStatus = false
      this.SteamUserDb = this.dbClient.define('User', {
        steamid: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        downvotes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
      });
    }

    async testConnection() {
        try {
            await this.dbClient.authenticate();
            console.log('Connection has been established successfully.');
            this.connectionStatus = true
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    async createUser(steamId: string, downvotes: number) {
        return await this.SteamUserDb.findOrCreate({where: {steamid: steamId}})
    }

    async getUser(steamId: string) {
        return await this.SteamUserDb.findOne({where: {steamid: steamId}})
    }

    async softDeleteUser(steamId: string) {
        return await this.SteamUserDb.destroy({where: {steamid: steamId}})
    }

    async getAllUsers(){
        return this.SteamUserDb.findAll()
    }
}

export { SqlDb }