const mongoose = require('mongoose')
const peopleSchema = new mongoose.Schema({
    id: String,
    name: String,
    number: String,
})

const generateId = () => {
    return crypto.randomUUID().toString();
}

// const password = args[2]
mongoose.set('strictQuery', false)
async function connectToDatabase() {
    const url = process.env.MONGODB_URI;
    console.log('Connecting to MongoDB with URL:', url)
    return mongoose.connect(url, { family: 4 }).then(async () => {
        console.log('connected to MongoDB')
    })
}
const OperateOnDatabase = (myCallback) => {
    return connectToDatabase()
        .then(() => {
            console.log('Database operations can be performed now')
            return myCallback()
        })
        .finally(() => {
            mongoose.connection.close();
        })
}

async function getData() {
    var items = [];
    await OperateOnDatabase(async () => {
        var Person = mongoose.model('Person', peopleSchema);
        return Person.find({}).then((result) => {
            result.forEach(person => {
                items.push(new Object({
                    id: person.id,
                    name: person.name,
                    number: person.number
                }))
            })
            return items;
        });
    })
    return items
}

async function getDataById(id) {
    return await OperateOnDatabase(async () => {
        var Person = mongoose.model('Person', peopleSchema);
        return Person.find({ id: id }).then((result) => {
            console.log(`Data fetched for ID ${id}:`, result)
            if (result.length === 0) {
                console.log(`No person found with ID ${id}`)
                return null;
            }
            return {
                id: result[0].id,
                name: result[0].name,
                number: result[0].number
            };
        })
    });
}

async function writeData(person) {
    return await OperateOnDatabase(async () => {
        var Person = mongoose.model('Person', peopleSchema);

        var per = await Person.find({ name: person.name }).catch((error) => {
            console.error('Error checking for duplicate entry:', error)
        });
        if (per && per.length > 0) {
            console.log(`Person with name ${person.name} already exists`)
            return null;
        }
        console.log(`Creating new person with name: ${person.name} and number: ${person.number}`)
        const newPerson = new Person({
            id: generateId(),
            name: person.name,
            number: person.number
        });
        await newPerson.save();
        return newPerson;
    })
}

async function updateData(id, name, number) {
    return await OperateOnDatabase(async () => {
        return await OperateOnDatabase(async () => {
            var Person = mongoose.model('Person', peopleSchema);
            return Person.updateOne({ id: id }, { name: name, number: number }).then(async (result) => {
                if (result.matchedCount === 0) {
                    console.log(`No person found with ID ${id} to update`)
                    return null;
                }
                console.log(`Person with ID ${id} updated successfully`)
                return await Person.find({ id: id }).then((result) => {
                    return {
                        id: result[0].id,
                        name: result[0].name,
                        number: result[0].number
                    };
                })
            })
        })
    })
}

async function deleteData(id) {
    return await OperateOnDatabase(async () => {
        var Person = mongoose.model('Person', peopleSchema);
        return Person.deleteOne({ id: id }).then(() => {
            console.log(`Person with ID ${id} deleted successfully`)
            return true;
        })
    })

}
module.exports = {
    getData,
    getDataById,
    writeData,
    updateData,
    deleteData
}
