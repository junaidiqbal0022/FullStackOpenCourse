const mongoose = require('mongoose')
const peopleSchema = new mongoose.Schema({
    id: String,
    name: String,
    number: String,
})

const generateId = () => {
    return Math.ceil(Math.random(0, 1_0000_000_000) * 1_0000_000_000).toString();
}
var args = process.argv;
if (args.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}
if (args.length > 3) {
    var person = {
        id: generateId(),
        name: args[3],
        number: args[4]
    }
}

const password = args[2]
const url = `mongodb+srv://horrible_db_user:${password}@cluster0.eajqmba.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery', false)
async function connectToDatabase() {
    return mongoose.connect(url, { family: 4 }).then(async () => {
        console.log('connected to MongoDB')
    }).catch((error) => {
        console.error('error connecting to MongoDB:', error.message)
    })
}
const OperateOnDatabase = (myCallback) => {
    return connectToDatabase()
        .then(() => {
            console.log('Database operations can be performed now')
            return myCallback()
        })
        .catch((error) => {
            console.error('Error during database operations:', error)
        })
        .finally(() => {
            mongoose.connection.close();
        })
}

async function getData() {
    console.log('This is my method')
    var items = [];
    await OperateOnDatabase(async () => {
        var Person = mongoose.model('Person', peopleSchema);
        return Person.find({}).then((result) => {
            result.forEach(person => {
                items.push(person)
            })
            return items;
        });
    })
    return items
}

async function writeData(person) {
    await OperateOnDatabase(async () => {
        var Person = mongoose.model('Person', peopleSchema);
        const newPerson = new Person({
            id: person.id,
            name: person.name,
            number: person.number
        });
        await newPerson.save();
    })
}

async function updateData(name, number) {
    await OperateOnDatabase(async () => {
        const updatedPerson = await OperateOnDatabase(async () => {
            var Person = mongoose.model('Person', peopleSchema);
            return Person.find({ name: name }).then((result) => {
                if (result.length > 0) {
                    const personToUpdate = result[0];
                    personToUpdate.number = number;
                    return personToUpdate.save();
                } else {
                    console.log(`Person with name ${name} not found`)
                    return null;
                }
            }).catch((error) => {
                console.error('Error updating person:', error)
            });

        })
    })
}

async function deleteData(name) {
    await OperateOnDatabase(async () => {
        var Person = mongoose.model('Person', peopleSchema);
        return Person.deleteOne({ name: name }).then(() => {
            console.log(`Person with name ${name} deleted successfully`)
            return true;
        }).catch((error) => {
            console.error('Error deleting person:', error)
        })
    })

}


if (person) {
    writeData(person).then(() => {
        console.log('Person saved successfully')
    }).catch((error) => {
        console.error('Error saving person:', error)
    })
    return 0;
}
getData().then((peersons) => {
    console.log("phonebook:");
    peersons.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
    })
}).catch((error) => {
    console.error('Error retrieving items:', error)
});

module.exports = {
    getData,
    writeData,
    updateData,
    deleteData
}
