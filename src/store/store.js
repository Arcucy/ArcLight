// Dependencies
const DataStore = require('nedb')

let freshDb = new DataStore()
let mainDb = new DataStore({filename: './data/arclight.db', autoload: true})
let userDb = new DataStore({filename: './data/user.db', autoload: true})

let fresh = {
    /**
     * Inserting documents    
     * The native types are String, Number, Boolean, Date and null.
     * @param {*} data 
     */
    insert(data) {
        return new Promise((resolve, reject) => {
            freshDb.insert(data, (err, doc) => {
                if (err) {
                    err.name = "Fresh Database Error"
                    reject(err)
                }
                else {
                    resolve(doc)
                }
            })
        })
    },
    /**
     * Finding documents     
     * Use find to look for multiple documents matching you query, or findOne to look for one specific
     * document. You can select documents based on field equality or use comparison operators 
     * ($lt, $lte, $gt, $gte, $in, $nin, $ne). You can also use logical operators $or, $and, 
     * $not and $where.
     * @param {*} key 
     */
    find(key) {
        return new Promise((resolve, reject) => {
            freshDb.find(key, (err, docs) => {
                if (err) {
                    err.name = "Fresh Database Error"
                    reject(err)
                }
                let error = new Error("Cannot find query " + JSON.stringify(key))
                error.name = "Fresh Database Error"
                if (docs.length === 0) reject(error)
                resolve(docs)
            })
        })
    },
    /**
     * Find only on specific document
     * @param {*} key 
     */
    findOne(key) {
        return new Promise((resolve, reject) => {
            freshDb.findOne(key, (err, doc) => {
                if (err) {
                    err.name = "Fresh Database Error"
                    reject(err)
                }
                if (doc === null) resolve(false)
                resolve(doc)
            })
        })
    },
    /**
     * Updating documents    
     * db.update(query, update, options, callback) will update all documents matching query according to the update rules
     * @param {*} query 
     * @param {*} update 
     * @param {*} option 
     */
    update(query, update, option) {
        return new Promise((resolve, reject) => {
            freshDb.update(query, update, option, (err, docs) => {
                if (err) {
                    err.name = "Fresh Database Error"
                    reject(err)
                }
                resolve(docs)
            })
        })
    },
    /**
     * Removing documents    
     * db.remove(query, options, callback) will remove all documents matching query according to options
     * @param {*} query 
     * @param {*} option 
     */
    remove(query, option) {
        return new Promise((resolve, reject) => {
            freshDb.remove(query, option, (err, doc) => {
                if (err) {
                    err.name = "Fresh Databse Error"
                    reject(err)
                }
                resolve(doc)
            })
        })
    },
    /**
     * Counting documents    
     * You can use count to count documents. It has the same syntax as find.
     * @param {*} query 
     */
    count(query) {
        return new Promise((resolve, reject) => {
            freshDb.count(query, (err, count) => {
                if (err) {
                    err.name = "Fresh Database Error"
                    reject(err)
                }
                resolve(count)
            })
        })
    }
}

let main = {
    /**
     * Inserting documents     
     * The native types are String, Number, Boolean, Date and null.
     * @param {*} data 
     */
    insert(data) {
        return new Promise((resolve, reject) => {
            mainDb.insert(data, (err, doc) => {
                if (err) {
                    err.name = "Main Database Error"
                    reject(err)
                }
                else {
                    resolve(doc)
                }
            })
        })
    },
    /**
     * Finding documents     
     * Use find to look for multiple documents matching you query, or findOne to look for one specific
     * document. You can select documents based on field equality or use comparison operators 
     * ($lt, $lte, $gt, $gte, $in, $nin, $ne). You can also use logical operators $or, $and, 
     * $not and $where.
     * @param {*} key 
     */
    find(key) {
        return new Promise((resolve, reject) => {
            mainDb.find(key, (err, docs) => {
                if (err) {
                    err.name = "Main Database Error"
                    reject(err)
                }
                let error = new Error("Cannot find query " + JSON.stringify(key))
                error.name = "Main Database Error"
                if (docs.length === 0) reject(error)
                resolve(docs)
            })
        })
    },
    /**
    * Find only on specific document
    * @param {*} key 
    */
   findOne(key) {
       return new Promise((resolve, reject) => {
            mainDb.findOne(key, (err, doc) => {
               if (err) {
                   err.name = "Main Database Error"
                   reject(err)
               }
               if (doc === null) resolve(false)
               resolve(doc)
           })
       })
   },
    /**
     * Updating documents     
     * db.update(query, update, options, callback) will update all documents matching query according to the update rules
     * @param {*} query 
     * @param {*} update 
     * @param {*} option 
     */
    update(query, update, option) {
        return new Promise((resolve, reject) => {
            mainDb.update(query, update, option, (err, docs) => {
                if (err) {
                    err.name = "Main Database Error"
                    reject(err)
                }
                resolve(docs)
            })
        })
    },
    /**
     * Removing documents    
     * db.remove(query, options, callback) will remove all documents matching query according to options
     * @param {*} query 
     * @param {*} option 
     */
    remove(query, option) {
        return new Promise((resolve, reject) => {
            mainDb.remove(query, option, (err, doc) => {
                if (err) {
                    err.name = "Main Databse Error"
                    reject(err)
                }
                resolve(doc)
            })
        })
    },
    /**
     * Counting documents    
     * You can use count to count documents. It has the same syntax as find.
     * @param {*} query 
     */
    count(query) {
        return new Promise((resolve, reject) => {
            mainDb.count(query, (err, count) => {
                if (err) {
                    err.name = "Main Database Error"
                    reject(err)
                }
                resolve(count)
            })
        })
    }
}

let user = {
    isFirst(id) {
        return new Promise((resolve, reject) => {
            userDb.find({ key: "UserProfile", id: id }, (err, docs) => {
                let result
                if (err) result = true
                if (docs.length === 0) result = true
                else result = false
                resolve(result)
            })
        })
    },
    /**
     * Inserting documents     
     * The native types are String, Number, Boolean, Date and null.
     * @param {*} data 
     */
    insert(data) {
        return new Promise((resolve, reject) => {
            userDb.insert(data, (err, doc) => {
                if (err) {
                    err.name = "User Database Error"
                    reject(err)
                }
                else {
                    resolve(doc)
                }
            })
        })
    },
    /**
     * Finding documents    
     * Use find to look for multiple documents matching you query, or findOne to look for one specific
     * document. You can select documents based on field equality or use comparison operators 
     * ($lt, $lte, $gt, $gte, $in, $nin, $ne). You can also use logical operators $or, $and, 
     * $not and $where.
     * @param {*} key 
     */
    find(key) {
        return new Promise((resolve, reject) => {
            userDb.find(key, (err, docs) => {
                if (err) {
                    err.name = "User Database Error"
                    reject(err)
                }
                let error = new Error("Cannot find query " + JSON.stringify(key))
                error.name = "User Database Error"
                if (docs.length === 0) reject(error)
                resolve(docs)
            })
        })
    },
    /**
     * Find only on specific document
     * @param {*} key 
     */
    findOne(key) {
        return new Promise((resolve, reject) => {
            userDb.findOne(key, (err, doc) => {
                if (err) {
                    err.name = "User Database Error"
                    reject(err)
                }
                if (doc === null) resolve(false)
                resolve(doc)
            })
        })
    },
    /**
     * Updating documents    
     * db.update(query, update, options, callback) will update all documents matching query according to the update rules
     * @param {*} query 
     * @param {*} update 
     * @param {*} option 
     */
    update(query, update, option) {
        return new Promise((resolve, reject) => {
            userDb.update(query, update, option, (err, docs) => {
                if (err) {
                    err.name = "User Database Error"
                    reject(err)
                }
                resolve(docs)
            })
        })
    },
    /**
     * Removing documents     
     * db.remove(query, options, callback) will remove all documents matching query according to options
     * @param {*} query 
     * @param {*} option 
     */
    remove(query, option) {
        return new Promise((resolve, reject) => {
            userDb.remove(query, option, (err, doc) => {
                if (err) {
                    err.name = "User Databse Error"
                    reject(err)
                }
                resolve(doc)
            })
        })
    },
    /**
     * Counting documents    
     * You can use count to count documents. It has the same syntax as find.
     * @param {*} query 
     */
    count(query) {
        return new Promise((resolve, reject) => {
            userDb.count(query, (err, count) => {
                if (err) {
                    err.name = "User Database Error"
                    reject(err)
                }
                resolve(count)
            })
        })
    }
}

module.exports = {
    freshDb,
    fresh,
    mainDb,
    main,
    userDb,
    user
}