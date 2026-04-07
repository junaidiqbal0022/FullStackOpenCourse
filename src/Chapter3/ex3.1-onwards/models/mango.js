const mongoose = require('mongoose')
const peopleSchema = new mongoose.Schema({
    id: String,
    name: String,
    number: String,
})


const generateId = () => {
    return crypto.randomUUID().toString();
}
// var args = process.argv;
// if (args.length < 3) {
//     console.log('give password as argument')
//     process.exit(1)
// }
// if (args.length > 3) {
//     var person = {
//         id: generateId(),
//         name: args[3],
//         number: args[4]
//     }
// }

// const password = args[2]
mongoose.set('strictQuery', false)
async function connectToDatabase() {
    const url = process.env.MONGODB_URI;
    console.log('Connecting to MongoDB with URL:', url)
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

        var exPerson = await Person.find({ name: person.name }).then((result) => {
            if (result.length > 0) {
                console.log(`Person with name ${person.name} already exists, updating number instead`)
                return;
            }
        })
        const newPerson = new Person({
            id: generateId(),
            name: person.name,
            number: person.number
        });
        var per = await newPerson.save();
        return per;
    }).catch((error) => {
        console.error('Error saving person:', error)
    })

}

async function updateData(id, number) {
    return await OperateOnDatabase(async () => {
        return await OperateOnDatabase(async () => {
            var Person = mongoose.model('Person', peopleSchema);
            return Person.updateOne({ id: id }, { number: number }).then(async (result) => {
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
            }).catch((error) => {
                console.error('Error updating person:', error)
            });

        })
    })
}

async function deleteData(id) {
    return await OperateOnDatabase(async () => {
        var Person = mongoose.model('Person', peopleSchema);
        return Person.deleteOne({ id: id }).then(() => {
            console.log(`Person with ID ${id} deleted successfully`)
            return true;
        }).catch((error) => {
            console.error('Error deleting person:', error)
        })
    })

}


// if (person) {
//         writeData(person).then(() => {
//             console.log('Person saved successfully')
//         }).catch((error) => {
//             console.error('Error saving person:', error)
//         })
//         return 0;
//     }
//     getData().then((peersons) => {
//         console.log("phonebook:");
//         peersons.forEach((person) => {
//             console.log(`${person.name} ${person.number}`);
//         })
//     }).catch((error) => {
//         console.error('Error retrieving items:', error)
//     });

module.exports = {
    getData,
    getDataById,
    writeData,
    updateData,
    deleteData
}
