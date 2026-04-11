const { Person, generateId } = require('./dbModel');
const opts = { runValidators: true };

async function getData() {
    var per = await Person.find({});
    return per.map(p => ({
        id: p.id,
        name: p.name,
        number: p.number
    }));
}

async function getDataById(id) {
    return await Person.find({ id: id }).then((result) => {
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
}

async function getDataByName(name) {
    return await Person.find({ name: name }).then((result) => {
        console.log(`Data fetched for name ${name}:`, result)
        if (result.length === 0) {
            console.log(`No person found with name ${name}`)
            return null;
        }
        return {
            id: result[0].id,
            name: result[0].name,
            number: result[0].number
        };
    })
}

async function writeData(person) {
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
    return {
        id: newPerson.id,
        name: newPerson.name,
        number: newPerson.number
    };
}

async function updateData(id, name, number) {
    return Person.updateOne({ id: id }, { name: name, number: number }, opts).then(async (result) => {
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
}

async function deleteData(id) {
    return Person.deleteOne({ id: id }).then(() => {
        console.log(`Person with ID ${id} deleted successfully`)
        return true;
    });
}
module.exports = {
    getData,
    getDataById,
    getDataByName,
    writeData,
    updateData,
    deleteData
}
